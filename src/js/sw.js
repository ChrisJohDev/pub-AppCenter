
// Code stolen from https://hellonehha.medium.com/pwa-series-service-workers-cookbook-part-1-c89fa0d547a7
// Adapted by Chris Johannesson
const cacheName = 'pwa4EK9i-B3SW-v0.0.1'
const cacheId = 'pwa4EK9i'
const VERSION = 'v0.0.1'
let count = 0
const fileList = [
  '../index.html',
  '../css/styles.css',
  './app.js',
  './components/appBay/index.js',
  './components/appBay/appBay.js',
  './components/appContainer/index.js',
  './components/appContainer/appContainer.js',
  './components/footer/index.js',
  './components/footer/footer.js',
  './components/layout/index.js',
  './components/layout/layout.js',
  './components/timer/index.js',
  './components/timer/timer.js',
  './chat/index.js',
  './chat/chatApp.js',
  './exchange/index.js',
  './exchange/exchangeApp.js',
  './exchange/components/connection.js',
  './exchange/images/game.jpg',
  './memory/index.js',
  './memory/memoryApp.js',
  './memory/components/card.js',
  './memory/components/gameBoard.js',
  './memory/components/results.js',
  './memory/components/welcome.js',
  './memory/images/game.png',
  './memory/images/cards/back.png',
  './memory/images/cards/img1.png',
  './memory/images/cards/img2.png',
  './memory/images/cards/img3.png',
  './memory/images/cards/img4.png',
  './memory/images/cards/img5.png',
  './memory/images/cards/img6.png',
  './memory/images/cards/img7.png',
  './memory/images/cards/img8.png',
  './memory/images/cards/img9.png',
  './memory/images/cards/img10.png'
]

// ServiceWorker installation
self.addEventListener('install', (ev) => {
  console.log(`\n*** Installing: ${cacheName}, count: ${count++}`)
  self.skipWaiting() // makes this the active version if there is an older version installed
  ev.waitUntil(caches.open(cacheName)
    .then((cache) => {
      return cache.addAll(fileList)
    })
    .catch((err) => {
      console.log('Failed adding files: ', err)
    })
  )
})

// ServiceWorker activation
self.addEventListener('activate', (ev) => {
  console.log(`\n*** Activating: ${cacheName}, count: ${count}`)
  ev.waitUntil(caches.keys()
    .then((keyList) => {
      keyList.forEach((key) => {
        console.log('key:', key)
        if (key.indexOf(VERSION) < 0 && key.indexOf(cacheId) > -1) {
          console.log('[ServiceWorker] Removing old cache', key)
          caches.delete(key)
        }
      })
    })
  )
  // return self.clients.claim()
})

/**
 *
 * @param req
 */
const doesRequestAcceptHtml = (req) => {
  console.log('req: ', req)
  if (req) return true
  return false
}

self.addEventListener('fetch', (ev) => {
  console.log('[ServiceWorker] fetch', ev.request.url)
  const req = ev.request
  if (doesRequestAcceptHtml(req)) {
    ev.respondWith(
      fetch(req)
        .catch(() => {
          return caches.match('../offline.html')
        })
    )
  } else {
    ev.respondWith(
      caches.match(req)
        .then((res) => {
          return res || fetch(req)
        })
    )
  }
})
