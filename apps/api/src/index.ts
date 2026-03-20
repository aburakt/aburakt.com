import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth'
import { statsRoutes } from './routes/stats'
import { progressRoutes } from './routes/progress'

export type Bindings = {
  DB: D1Database
  ENVIRONMENT: string
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  SESSION_SECRET: string
}

export type Variables = {
  userHash: string | null
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use(
  '*',
  cors({
    origin: ['https://aburakt.com', 'http://localhost:4321'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.get('/health', (c) => {
  return c.json({ ok: true, timestamp: Date.now() })
})

app.route('/auth', authRoutes())
app.route('/stats', statsRoutes())
app.route('/progress', progressRoutes())

export default app
