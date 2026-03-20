import { createMiddleware } from 'hono/factory'
import type { Bindings, Variables } from '../index'

// Simple session-based auth middleware
// Reads the session token from Authorization header and looks up the user
export const requireAuth = createMiddleware<{ Bindings: Bindings; Variables: Variables }>(
  async (c, next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return c.json({ ok: false, error: 'Unauthorized' }, 401)
    }

    try {
      const session = await c.env.DB.prepare(
        'SELECT user_hash FROM sessions WHERE token = ? AND expires_at > ?'
      )
        .bind(token, Math.floor(Date.now() / 1000))
        .first<{ user_hash: string }>()

      if (!session) {
        return c.json({ ok: false, error: 'Invalid or expired session' }, 401)
      }

      c.set('userHash', session.user_hash)
      await next()
    } catch {
      return c.json({ ok: false, error: 'Auth error' }, 500)
    }
  }
)

// Optional auth — sets userHash if present but doesn't block
export const optionalAuth = createMiddleware<{ Bindings: Bindings; Variables: Variables }>(
  async (c, next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    if (token) {
      try {
        const session = await c.env.DB.prepare(
          'SELECT user_hash FROM sessions WHERE token = ? AND expires_at > ?'
        )
          .bind(token, Math.floor(Date.now() / 1000))
          .first<{ user_hash: string }>()

        if (session) {
          c.set('userHash', session.user_hash)
        }
      } catch {
        // Ignore auth errors for optional auth
      }
    }
    await next()
  }
)
