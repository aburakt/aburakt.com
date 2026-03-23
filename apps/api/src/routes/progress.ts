import { Hono } from 'hono'
import type { Bindings, Variables } from '../index'
import { requireAuth } from '../middleware/auth'

export function progressRoutes() {
  const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

  // Get lesson progress
  app.get('/', requireAuth, async (c) => {
    const userHash = c.get('userHash')!
    const result = await c.env.DB.prepare(
      'SELECT * FROM lesson_progress WHERE user_hash = ?'
    )
      .bind(userHash)
      .all()

    return c.json({ ok: true, data: result.results })
  })

  // Upsert lesson progress
  app.post('/', requireAuth, async (c) => {
    const userHash = c.get('userHash')!
    const body = await c.req.json<{
      lesson_id: string
      completed: 0 | 1
      best_wpm: number
      best_acc: number
    }>()

    await c.env.DB.prepare(`
      INSERT INTO lesson_progress (user_hash, lesson_id, completed, best_wpm, best_acc)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_hash, lesson_id) DO UPDATE SET
        completed = MAX(lesson_progress.completed, excluded.completed),
        best_wpm = MAX(lesson_progress.best_wpm, excluded.best_wpm),
        best_acc = MAX(lesson_progress.best_acc, excluded.best_acc)
    `)
      .bind(userHash, body.lesson_id, body.completed, body.best_wpm, body.best_acc)
      .run()

    return c.json({ ok: true })
  })

  return app
}
