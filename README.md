# aburakt.com

Personal portfolio and interactive playground built with a terminal/hacker aesthetic.

**Live:** [aburakt.com](https://aburakt.com)

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Astro 5 + React 19 islands |
| Styling | Tailwind CSS v4, JetBrains Mono |
| API | Hono on Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Auth | GitHub OAuth (sha256 hashed ID, no PII) |
| Hosting | Cloudflare Pages + Workers |
| Monorepo | pnpm workspaces |

## Structure

```
apps/
  web/          # Astro frontend (static output)
  api/          # Hono API on Workers
packages/
  shared/       # Shared TypeScript types
```

## Features

- **Portfolio** — terminal-themed homepage, about, CV viewer
- **Vim Playground** — cheatsheet (70+ commands, fuzzy search), 20 interactive exercises, 5 games (DeleteSpeed, CIGame, RelativeJump, WordJump, MacroRun)
- **Typing Center** — 8 progressive lessons with visual keyboard, typing test, speed challenge, 3 games (WordRain, TypeSprint, Survival)
- **Dashboard** — WPM trends, lesson progress, vim scores (requires GitHub login)
- **i18n** — Turkish (default) + English
- **Site-wide vim navigation** — j/k scroll, gg/G, multi-key sequences

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
