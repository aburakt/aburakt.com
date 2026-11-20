import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'static',
  site: 'https://aburakt.com',
  integrations: [react(), sitemap({ filter: (page) => !/\/(en\/)?(dashboard|404)\/?$/.test(page) })],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
})
