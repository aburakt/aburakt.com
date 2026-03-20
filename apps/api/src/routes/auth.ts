import { Hono } from 'hono'
import type { Bindings, Variables } from '../index'

export function authRoutes() {
  const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

  // Get GitHub OAuth URL
  app.get('/github', (c) => {
    const clientId = c.env.GITHUB_CLIENT_ID
    const redirectUri = `${c.req.url.replace('/auth/github', '/auth/callback')}`
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`
    return c.json({ ok: true, data: { url } })
  })

  // GitHub OAuth callback
  app.get('/callback', async (c) => {
    const code = c.req.query('code')
    if (!code) {
      return c.json({ ok: false, error: 'Missing code' }, 400)
    }

    try {
      // Exchange code for access token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: c.env.GITHUB_CLIENT_ID,
          client_secret: c.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      })

      const tokenData = await tokenRes.json() as { access_token?: string; error?: string }
      if (!tokenData.access_token) {
        return c.json({ ok: false, error: 'Failed to get access token' }, 400)
      }

      // Get user info
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'aburakt-api',
        },
      })

      const userData = await userRes.json() as { id?: number }
      if (!userData.id) {
        return c.json({ ok: false, error: 'Failed to get user info' }, 400)
      }

      // Hash the GitHub ID (no PII stored)
      const encoder = new TextEncoder()
      const data = encoder.encode(String(userData.id))
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const userHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

      // Upsert user
      await c.env.DB.prepare(
        'INSERT INTO users (id) VALUES (?) ON CONFLICT(id) DO NOTHING'
      )
        .bind(userHash)
        .run()

      // Create session token
      const tokenBytes = new Uint8Array(32)
      crypto.getRandomValues(tokenBytes)
      const sessionToken = Array.from(tokenBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days

      await c.env.DB.prepare(
        'INSERT INTO sessions (token, user_hash, expires_at) VALUES (?, ?, ?)'
      )
        .bind(sessionToken, userHash, expiresAt)
        .run()

      // Redirect back to the app with token
      return c.redirect(`https://aburakt.com/dashboard?token=${sessionToken}`)
    } catch {
      return c.json({ ok: false, error: 'Auth failed' }, 500)
    }
  })

  // Get current user info
  app.get('/me', async (c) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return c.json({ ok: true, data: { authenticated: false } })
    }

    const session = await c.env.DB.prepare(
      'SELECT user_hash FROM sessions WHERE token = ? AND expires_at > ?'
    )
      .bind(token, Math.floor(Date.now() / 1000))
      .first<{ user_hash: string }>()

    if (!session) {
      return c.json({ ok: true, data: { authenticated: false } })
    }

    return c.json({
      ok: true,
      data: { authenticated: true, userHash: session.user_hash },
    })
  })

  // Logout
  app.post('/logout', async (c) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    if (token) {
      await c.env.DB.prepare('DELETE FROM sessions WHERE token = ?')
        .bind(token)
        .run()
    }
    return c.json({ ok: true })
  })

  return app
}
