const CACHE_NAME = 'aburakt-v3'

self.addEventListener('install', (event) => {
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

  // Only handle GET requests for same-origin navigation/assets
  if (request.method !== 'GET') return
  if (!request.url.startsWith(self.location.origin)) return

  // Skip API calls
  const url = new URL(request.url)
  if (url.pathname.startsWith('/auth/') || url.pathname.startsWith('/stats/') || url.pathname.startsWith('/progress/') || url.pathname.startsWith('/leaderboard/')) return

  // Network-first: try network, fall back to cache for offline
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful, non-redirected, non-opaque responses
        if (response.ok && response.type === 'basic' && !response.redirected) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})
