const CACHE_NAME = 'aburakt-v1'
const STATIC_ASSETS = [
  '/',
  '/about',
  '/cv',
  '/playground',
  '/dashboard',
  '/manifest.json',
  '/favicon.ico',
  '/images/pp/logo.webp',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET and API requests
  if (request.method !== 'GET') return
  if (request.url.includes('/auth/') || request.url.includes('/stats/') || request.url.includes('/progress/') || request.url.includes('/leaderboard/')) return

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      }).catch(() => cached)

      return cached || fetched
    })
  )
})
