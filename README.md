# aburakt.com

This is the personal portfolio of Ahmet Burak Tekin. Built with Next.js,
Tailwind CSS, and MDX, it showcases projects, articles, and talks, and serves
as the canonical place for my CV.

## Project Description

This repository contains the source code for my personal portfolio website. It brings together projects from the public and private sectors, long-form articles, community contributions, and talks, while also offering an always-up-to-date copy of my CV. The site is built with modern web best practices and emphasizes performance, accessibility, and an enjoyable writing workflow.

- **Tech stack**: Next.js (App Router), TypeScript, Tailwind CSS, MDX
- **Highlights**:
  - MDX-powered article workflow
  - Up-to-date CV download via the `cv/download` route
  - Content feed served at `feed.xml`
  - Simple, accessible UI components

## Project Structure

A quick overview of the key folders and files:

```
src/
  app/                  # Next.js App Router routes and pages
    layout.tsx          # App-level layout
    page.tsx            # Home page
    about/              # About page
    articles/           # Articles index and MDX content
    community/          # Community/engagement page
    contact/            # Contact page (route placeholder)
    cv/                 # CV page and download route
      download/route.ts # Serves the PDF CV
    feed.xml/route.ts   # Content feed
    projects/           # Projects page
    thank-you/          # Post-form thank you page
    uses/               # Uses/tools page

  components/           # UI components (Layout, Header, Footer, etc.)
  images/               # Assets (avatar, photos, logos)
  lib/                  # Utilities (article listing, date formatting)
  styles/               # Global styles (Tailwind and Prism)

public/
  cv/                   # Published PDF CV

configuration files: next.config.mjs, tailwind/postcss, tsconfig.json, vercel.json
```

## Getting started

Install dependencies:

```bash
npm install
```

Set the site URL in `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://aburakt.com
```

Run the development server:

```bash
npm run dev
```

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDX Documentation](https://mdxjs.com/docs)
