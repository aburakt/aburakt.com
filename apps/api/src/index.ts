import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  '*',
  cors({
    origin: ['https://aburakt.com', 'http://localhost:4321'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
)

app.get('/health', (c) => {
  return c.json({ ok: true, timestamp: Date.now() })
})

// API routes will be added in Phase 4
// - /auth/* (Better-Auth)
// - /stats/* (typing & vim stats)
// - /progress/* (lesson progress)

export default app
