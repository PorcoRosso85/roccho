const CACHE_NAME = 'v1'
const urlsToCache = [
  '/',
  'https://unpkg.com/htmx.org@1.9.9',
  'https://unpkg.com/htmx.org/dist/ext/debug.js',
  // 'https://cdn.tailwindcss.com',
]

// サービスワーカーのインストール時に呼ばれる
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching URLs: ', urlsToCache)
      return cache.addAll(urlsToCache).then(() => {
        console.log('All resources are cached')
      })
    }),
  )
})

// リソースのフェッチ時に呼ばれる
self.addEventListener('fetch', (event) => {
  console.log(`[Fetch] Requesting: ${event.request.url}`)

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log(`[Fetch] Returning from cache: ${event.request.url}`)
        return response
      }

      console.log(`[Fetch] Fetching from network: ${event.request.url}`)
      return fetch(event.request).then((response) => {
        // ネットワークからのレスポンスをログに記録
        console.log(`[Fetch] Response from network: ${event.request.url}`, response)

        if (!response || response.status !== 200 || response.type !== 'basic') {
          console.log(`[Fetch] Failed to fetch from network: ${event.request.url}`)
          return response
        }

        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          console.log(`[Fetch] Updating cache with new resource: ${event.request.url}`)
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})

// サービスワーカーのアクティベート時に呼ばれる
self.addEventListener('activate', (event) => {
  console.log(`Service Worker activating. Current scope: ${self.registration.scope}`)
  if (self.location.protocol !== 'https:' && self.location.hostname !== 'localhost') {
    console.log('Service Worker requires HTTPS or localhost for secure operation.')
  }

  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`[Activate] Deleting old cache: ${cacheName}`)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
