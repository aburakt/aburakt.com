import { Hono } from 'hono'
import type { Bindings, Variables } from '../index'

export function leaderboardRoutes() {
  const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

  // Top 20 typing test WPM scores (public, no auth)
  app.get('/typing', async (c) => {
    const result = await c.env.DB.prepare(
      'SELECT user_hash, MAX(wpm) as best_wpm, AVG(wpm) as avg_wpm, COUNT(*) as tests FROM typing_stats WHERE mode = ? GROUP BY user_hash ORDER BY best_wpm DESC LIMIT 20'
    )
      .bind('test')
      .all()

    const data = result.results.map((row: Record<string, unknown>) => ({
      user: (row.user_hash as string).slice(0, 8),
      best_wpm: row.best_wpm,
      avg_wpm: Math.round(row.avg_wpm as number),
      tests: row.tests,
    }))

    return c.json({ ok: true, data })
  })

  // Top 20 vim game scores (public, no auth)
  app.get('/vim', async (c) => {
    const result = await c.env.DB.prepare(
      'SELECT user_hash, game, MAX(score) as best_score, MIN(keystrokes) as min_keystrokes FROM vim_stats GROUP BY user_hash, game ORDER BY best_score DESC LIMIT 20'
    ).all()

    const data = result.results.map((row: Record<string, unknown>) => ({
      user: (row.user_hash as string).slice(0, 8),
      game: row.game,
      best_score: row.best_score,
      min_keystrokes: row.min_keystrokes,
    }))

    return c.json({ ok: true, data })
  })

  return app
}
