import { Hono } from 'hono'
import type { Bindings, Variables } from '../index'
import { requireAuth } from '../middleware/auth'

export function statsRoutes() {
  const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

  // Save typing stat
  app.post('/typing', requireAuth, async (c) => {
    const userHash = c.get('userHash')!
    const body = await c.req.json<{
      mode: string
      wpm: number
      accuracy: number
      duration_s: number
      layout: string
    }>()

    const id = crypto.randomUUID()
    await c.env.DB.prepare(
      'INSERT INTO typing_stats (id, user_hash, mode, wpm, accuracy, duration_s, layout) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(id, userHash, body.mode, body.wpm, body.accuracy, body.duration_s, body.layout)
      .run()

    return c.json({ ok: true, data: { id } })
  })

  // Get typing stats
  app.get('/typing', requireAuth, async (c) => {
    const userHash = c.get('userHash')!
    const limit = Number(c.req.query('limit') ?? 50)
    const mode = c.req.query('mode')

    let query = 'SELECT * FROM typing_stats WHERE user_hash = ?'
    const params: (string | number)[] = [userHash]

    if (mode) {
      query += ' AND mode = ?'
      params.push(mode)
    }

    query += ' ORDER BY created_at DESC LIMIT ?'
    params.push(limit)

    const result = await c.env.DB.prepare(query).bind(...params).all()
    return c.json({ ok: true, data: result.results })
  })

  // Get typing summary (for dashboard)
  app.get('/typing/summary', requireAuth, async (c) => {
    const userHash = c.get('userHash')!

    const [totalTests, bestWpm, avgWpm, avgAccuracy, recentStats] = await Promise.all([
      c.env.DB.prepare('SELECT COUNT(*) as count FROM typing_stats WHERE user_hash = ?')
        .bind(userHash).first<{ count: number }>(),
      c.env.DB.prepare('SELECT MAX(wpm) as best FROM typing_stats WHERE user_hash = ? AND mode = ?')
        .bind(userHash, 'test').first<{ best: number | null }>(),
      c.env.DB.prepare('SELECT AVG(wpm) as avg FROM typing_stats WHERE user_hash = ? AND mode = ?')
        .bind(userHash, 'test').first<{ avg: number | null }>(),
      c.env.DB.prepare('SELECT AVG(accuracy) as avg FROM typing_stats WHERE user_hash = ?')
        .bind(userHash).first<{ avg: number | null }>(),
      c.env.DB.prepare(
        'SELECT wpm, accuracy, mode, layout, created_at FROM typing_stats WHERE user_hash = ? ORDER BY created_at DESC LIMIT 20'
      ).bind(userHash).all(),
    ])

    return c.json({
      ok: true,
      data: {
        totalTests: totalTests?.count ?? 0,
        bestWpm: bestWpm?.best ?? 0,
        avgWpm: Math.round(avgWpm?.avg ?? 0),
        avgAccuracy: Math.round(avgAccuracy?.avg ?? 0),
        recent: recentStats.results,
      },
    })
  })

  // Save vim stat
  app.post('/vim', requireAuth, async (c) => {
    const userHash = c.get('userHash')!
    const body = await c.req.json<{
      game: string
      score: number
      keystrokes: number
    }>()

    const id = crypto.randomUUID()
    await c.env.DB.prepare(
      'INSERT INTO vim_stats (id, user_hash, game, score, keystrokes) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(id, userHash, body.game, body.score, body.keystrokes)
      .run()

    return c.json({ ok: true, data: { id } })
  })

  // Get vim stats
  app.get('/vim', requireAuth, async (c) => {
    const userHash = c.get('userHash')!
    const result = await c.env.DB.prepare(
      'SELECT * FROM vim_stats WHERE user_hash = ? ORDER BY created_at DESC LIMIT 50'
    )
      .bind(userHash)
      .all()

    return c.json({ ok: true, data: result.results })
  })

  // Export all data as JSON
  app.get('/export', requireAuth, async (c) => {
    const userHash = c.get('userHash')!

    const [typing, vim, progress] = await Promise.all([
      c.env.DB.prepare('SELECT * FROM typing_stats WHERE user_hash = ? ORDER BY created_at')
        .bind(userHash).all(),
      c.env.DB.prepare('SELECT * FROM vim_stats WHERE user_hash = ? ORDER BY created_at')
        .bind(userHash).all(),
      c.env.DB.prepare('SELECT * FROM lesson_progress WHERE user_hash = ?')
        .bind(userHash).all(),
    ])

    return c.json({
      ok: true,
      data: {
        typing_stats: typing.results,
        vim_stats: vim.results,
        lesson_progress: progress.results,
        exported_at: Date.now(),
      },
    })
  })

  return app
}
