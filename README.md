# aburakt.com

This is the personal portfolio of Ahmet Burak Tekin. Built with Vite, React,
and Tailwind CSS, it showcases projects, articles, and talks, and serves
as the canonical place for my CV.

## Project Description

This repository contains the source code for my personal portfolio website. It brings together projects from the public and private sectors, long-form articles, community contributions, and talks, while also offering an always-up-to-date copy of my CV. The site is built with modern web best practices and emphasizes performance, accessibility, and an enjoyable writing workflow.

- **Tech stack**: Vite, React, React Router, TypeScript, Tailwind CSS
- **Highlights**:
  - Client-side routing with React Router
  - Fast build times with Vite
  - Simple, accessible UI components with Framer Motion animations
  - Dark mode support with next-themes

## Project Structure

A quick overview of the key folders and files:

```
src/
  pages/                # React Router page components
    home.tsx            # Home page
    about.tsx           # About page
    articles.tsx        # Articles index
    articles/           # Individual article pages (TSX)
    community.tsx       # Community/engagement page
    cv.tsx              # CV page
    projects.tsx        # Projects page
    thank-you.tsx       # Post-form thank you page
    uses.tsx            # Uses/tools page
    not-found.tsx       # 404 page

  components/           # UI components (Layout, Header, Footer, etc.)
  images/               # Assets (avatar, photos, logos)
  lib/                  # Utilities (article listing, date formatting)
  providers.tsx         # Theme and context providers

  App.tsx               # Main app component with routing
  main.tsx              # Application entry point

public/                 # Static assets (favicon, etc.)

configuration files: vite.config.ts, tailwind/postcss, tsconfig.json
```

## Getting started

Install dependencies (using pnpm):

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

The dev server runs on `http://localhost:4264`

Build for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## Learn more

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
