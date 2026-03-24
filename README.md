# aburakt.com

Personal portfolio and interactive learning platform for developers. Practice typing and Vim — track your progress.

**Live:** [aburakt.com](https://aburakt.com)

## What is this

A developer portfolio with a terminal aesthetic, plus two hands-on skill modules:

- **Typing** — lessons, timed tests, speed challenges, and three games (WordRain, TypeSprint, Survival)
- **Vim** — searchable cheatsheet (70+ commands), 20 interactive exercises, five games (DeleteSpeed, CIGame, RelativeJump, WordJump, MacroRun)
- **Dashboard** — WPM trends, accuracy charts, lesson progress (GitHub login)
- **i18n** — Turkish (default) and English

The whole site uses vim-style keyboard navigation: `j/k` to scroll, `gg`/`G` for top/bottom, Space as leader key.

## Why these technologies

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | Astro 5 + React 19 islands | Static pages for speed, React only where interactivity is needed |
| Code editor | CodeMirror 6 + @replit/codemirror-vim | Real Vim keybindings in the browser — no faking it |
| Styling | Tailwind CSS v4, JetBrains Mono | Fast to build, consistent terminal look |
| API | Hono on Cloudflare Workers | Lightweight, runs at the edge, cold starts under 5ms |
| Database | Cloudflare D1 (SQLite) | Zero-config, lives next to the Workers, free tier is generous |
| Auth | GitHub OAuth | Developers already have accounts — SHA-256 hashed ID only, no PII stored |
| Search | Fuse.js | Client-side fuzzy search for the cheatsheet, no server round-trips |
| Monorepo | pnpm workspaces | Clean separation between frontend, API, and shared types |
| Hosting | Cloudflare Pages + Workers | Fast global CDN, simple deploys, everything in one platform |

## Project structure

```
apps/
  web/        # Astro frontend (static output)
  api/        # Hono REST API on Workers
packages/
  shared/     # Shared TypeScript types
```

## Development

```bash
pnpm install
pnpm --filter web dev     # localhost:4321
pnpm --filter api dev     # localhost:8787
```

## Deploy

```bash
pnpm --filter web build
npx wrangler pages deploy apps/web/dist --project-name aburakt --branch main
npx wrangler deploy        # API (from apps/api/)
```

## Environment

API secrets (set via `wrangler secret put`):

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `SESSION_SECRET`

## License

Open source. See the code, learn from it, build your own.
