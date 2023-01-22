
// Code stolen from https://hellonehha.medium.com/pwa-series-service-workers-cookbook-part-1-c89fa0d547a7
// Adapted by Chris Johannesson

const cacheId = 'pwa4EK9i'
const VERSION = 'v0.1.5'
const cacheName = cacheId + '-B3SW-' + VERSION
// let count = 0
const preCacheList = [
  '/index.js',
  '/manifest.webmanifest',
  '/images/favicon.ico',
  '/images/icon-48x48.png',
  '/images/icon-72x72.png',
  '/images/icon-96x96.png',
  '/images/icon-144x144.png',
  '/images/icon-152x152.png',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  '/js/components/footer/index.js',
  '/js/components/footer/footer.js',
  '/js/chat/images/game.png',
  '/js/exchange/images/game.jpg',
  '/js/memory/images/game.png',
  '/js/memory/images/cards/back.png',
  '/js/memory/images/cards/img1.png',
  '/js/memory/images/cards/img2.png',
  '/js/memory/images/cards/img3.png',
  '/js/memory/images/cards/img4.png',
  '/js/memory/images/cards/img5.png',
  '/js/memory/images/cards/img6.png',
  '/js/memory/images/cards/img7.png',
  '/js/memory/images/cards/img8.png',
  '/js/memory/images/cards/img9.png',
  '/js/memory/images/cards/img10.png'
]

// ServiceWorker installation
self.addEventListener('install', (ev) => {
  // console.log(`\n*** [ServiceWorker] Installing: ${cacheName}, count: ${count++}`)
  console.log(`\n*** [ServiceWorker] Installing ev: ${ev}`, ev)
  self.skipWaiting() // makes this the active version if there is an older version installed
  ev.waitUntil(caches.open(cacheName)
    .then((cache) => {
      cache.addAll(preCacheList)
    })
    .catch((err) => {
      console.lerror('[ServiceWorker] Failed adding files: ', err)
    })
  )
})

// ServiceWorker activation
self.addEventListener('activate', (ev) => {
  console.log(`\n*** [ServiceWorker] Activating: ${cacheName}`)
  ev.waitUntil(caches.keys()
    .then((keyList) => {
      keyList.forEach((key) => {
        console.log('key:', key)
        if (key.indexOf(VERSION) < 0 && key.indexOf(cacheId) > -1) {
          console.log('[ServiceWorker] Removing old cache', key)
          caches.delete(key)
          fetch(key)
            .then(res => {
              caches.open(cacheName)
                .then(cache => {
                  cache.put(key, res)
                })
            })
        }
      })
    })
  )
  return self.clients.claim()
})

// Respond to query about version of current service worker.
self.addEventListener('message', (ev) => {
  console.log('[ServiceWorker] ServiceWorker version outdated.', VERSION, ev.data)
  if (ev.data !== VERSION) {
    ev.source.postMessage('registerNew')
  }
})

/**
 *
 * @param ev
 */
const respondAndCache = async (ev) => {
  console.log('\n*** [xxServiceWorker] respondAndCache():', ev)
  const url = new URL(ev.request.url)
  ev.respondWith(
    caches.open(cacheName)
      .then(async (cache) => {
        return fetch(ev.request.url)
          .then((fetchedResponse) => {
            const response = fetchedResponse.clone()
            const data = response.text()
            const r = fetchedResponse.clone()
            console.log('[ServiceWorker] respondAndCache url, data', ev.request.url, data)
            cache.put(url.pathname, r)
            return fetchedResponse
          }).catch((err) => {
            // No network, return cache
            console.log('[ServiceWorker] respondAndCache read from cache url', url.pathname)
            return cache.match(url.pathname)
              .then((response) => {
                if (response) {
                  console.log('[ServiceWorker] respondAndCache return cached:', url.pathname)
                  return response
                } else if (url.pathname.includes('api/pair')) {
                  console.log('[ServiceWorker] respondAndCache not in cache url', url.pathname)
                  const options = {status: 200, statusText: 'OK-cache'}
                  const res = new Response('{ "rate": "Offline rate is not available" }', options)
                  return res
                } else if (url.pathname.includes('api/latest')) {
                  console.log('[ServiceWorker] respondAndCache not in cache latest url', url.pathname)
                  const options = { status: 200, statusText: 'OK-cache' }
                  const res = new Response('{ "rate": "Offline rates are not available." }', options)
                  return res
                } else {
                  console.error('[ServiceWorker] respondAndCache.\nRequested data not available in cache.\nurl', url, err)
                }
              }).catch((err) => {
                console.error('[ServiceWorker] respondAndCache.\nRequested catched last stop.\nurl', url, err)
              })
          })
      })
  )
}

/**
 *
 * @param ev
 */
const respondNoCache = (ev) => {
  console.log('\n*** [xxServiceWorker] respondNoCache():', ev)
  ev.respondWith(caches.open(cacheName)
    .then((cache) => {
      return fetch(ev.request.url)
        .then((fetchedResponse) => {
          const response = fetchedResponse.clone()
          const data = response.text()
          console.log('[ServiceWorker] respondNoCache url, data', ev.request.url, data)
          return fetchedResponse
        }).catch((err) => {
          console.error('No network access', err)
        })
    })
  )
}

/**
 *
 * @param ev
 */
const navigation = (ev) => {
  console.log('\n*** [xServiceWorker] navigation():')
  respondAndCache(ev)
}

/**
 *
 * @param ev
 */
const noCors = (ev) => {
  const url = new URL(ev.request.url)
  console.log('\n*** [xServiceWorker] noCors() protocol:', url.pathname, url.protocol)
  if (!url.protocol.includes('http')) {
    respondNoCache(ev)
  } else {
    respondAndCache(ev)
  }
}

/**
 *
 * @param ev
 */
const withCors = (ev) => {
  const url = new URL(ev.request.url)
  console.log('\n*** [xServiceWorker] withCors() pathname:', url.pathname)
  if (url.pathname.startsWith('/@')) {
    // if (url.pathname.startsWith('/@vite') || url.pathname.startsWith('/@fs')) return
    respondNoCache(ev)
  } else {
    respondAndCache(ev)
  }
}

// NOTE:
// First we need to check what kind of request it is.
// 1) navigation => network then cache (add or update)
// 2) no-cors => check if protocol is "chrome-extension" network do not cache
//                     else network then cache
// 3) cors => all js files. Check if pathname starts with "/@" network do not cache else network then cache
//
self.addEventListener('fetch', (ev) => {
  // console.log('\n*** [ServiceWorker] fetch event mode:', ev.request.mode)
  // const url = new URL(ev.request.url)
  const url = new URL(ev.request.url)
  console.log('\n*** [ServiceWorker] fetch ev, url:', ev, url)
  console.log('\n*** [ServiceWorker] fetch request mode:', typeof ev.request.mode, ev.request.mode)

  if (ev.request.headers.get('upgrade') === 'websocket') {
    // Allow WebSocket connections to pass through the service worker
    ev.respondWith(fetch(ev.request))
  } else {
    if (ev.request.mode === 'navigate') {
      console.log('\n*** [ServiceWorker] if navigate:')
      navigation(ev)
    } else if (ev.request.mode === 'no-cors') noCors(ev)
    else if (ev.request.mode === 'cors') withCors(ev)
  }

  // else respondNoCache(ev)
})

// self.addEventListener('fetch', (ev) => {
//   console.log('\n*** [ServiceWorker] fetch event:', ev)
//   // console.log('\n*** [ServiceWorker] fetch request:', ev.request)
//   // console.log('\n*** [ServiceWorker] fetch request url:', ev.request.url)
//   // console.log('\n*** [ServiceWorker] fetch self.location.origin:', self.location.origin)
//   const url = new URL(ev.request.url)
//   const isCached = CacheStorage.open(cacheName).keys()

//   console.log('\n*** [ServiceWorker] fetch url:', url)

//   if (isCached) {
//   // if (ev.request.url === self.location.origin || ev.request.url === self.location.origin + '/') {
//     console.log('\n*** [ServiceWorker] fetch:', `\nrequest.url: ${ev.request.url}\nlocation.origin: ${self.location.origin}`)
//     console.log('\n*** cache index.html', caches.match('/index.html'))
//     ev.respondWith(caches.match('/index.html'))
//   } else {
//     ev.respondWith(
//       caches.match(ev.request)
//         .then((res) => {
//           if (res) {
//             console.log('\n*** [ServiceWorker] fetch cache res:', res)
//             return res
//           }
//           console.log('\n*** [ServiceWorker] fetch no-cache request:', ev.request)
//           fetch(ev.request)
//             .then(response => {
//               caches.open(cacheName)
//                 .then((cache) => {
//                   const clone = response.clone()
//                   console.log('\n*** [ServiceWorker] fetch no-cache clone:', clone.clone())
//                   cache.add(url.pathname, clone)
//                 })
//               return response
//             })
//         })
//     )
//   }
// })

// Listen for fetch requests.
// self.addEventListener('fetch', (ev) => {
//   console.log(`[ServiceWorker] fetch: ${cacheName}, count: ${count}`)
//   const req = ev.request

//   count++

//   if (req.url.endsWith('.css')) {
//     ev.respondWith(
//       caches.match(req)
//         .then((res) => {
//           if (res) {
//             console.log('[ServiceWorker] fetch res b4:', res)
//             // // clone the response to change the headers
//             // const newRes = res.clone()
//             // // change the headers
//             // newRes.headers.set('Content-Type', 'text/css')
//             // console.log(`[ServiceWorker] fetch newRes: ${JSON.stringify(newRes)}`, newRes)
//             res.headers.set('Content-Type', 'text/css')
//             console.log('[ServiceWorker] fetch res after:', res)
//             return res
//           }
//           // if the file is not in the cache return the fetch request
//           return fetch(req)
//         })
//     )
//   } else {
//     ev.respondWith(caches.match(req)
//       .then((res) => {
//         if (res) {
//           console.log('[ServiceWorker] fetch cache res:', res)
//           return res
//         }
//         console.log('[ServiceWorker] fetch no-cache req:', req)
//         return fetch(req)
//       })
//     )
//   }
// })

// fetch('/css/styles.css')
//   .then(response => {
//     console.log(response.headers.get('content-type'))
//   })
