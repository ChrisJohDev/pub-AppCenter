
/**
 * The service worker.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 *
 * Code and strategy ideas stolen from https://developer.chrome.com/docs/workbox/caching-strategies-overview/
 * Adapted by Chris Johannesson
 */
const cacheId = 'pwa4EK9i'
const VERSION = 'v0.1.38'
const cacheName = cacheId + '-B3SW-' + VERSION

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
// Clear old caches and update to the latest version.
self.addEventListener('activate', (ev) => {
  // console.log(`\n*** [ServiceWorker] Activating: ${cacheName}`)
  ev.waitUntil(caches.keys()
    .then((keyList) => {
      keyList.forEach((key) => {
        console.log('[ServiceWorker] key:', key)
        // If the cachId is in the key but not the same version we want to delete the old version.
        if (key.indexOf(VERSION) < 0 && key.indexOf(cacheId) > -1) {
          // console.log('[ServiceWorker] Removing old cache', key)
          caches.delete(key)
          // Re-fetch the resource associated with the key
          fetch(key)
            .then(res => {
              caches.open(cacheName)
                .then(cache => {
                  // Put the key and the re-fetched resource in the new cache
                  cache.put(key, res)
                })
            })
        }
      })
    })
  )
  // Claim all clients to control them
  return self.clients.claim()
})

/**
 * Part of the Network first strategy.
 * If network available it gets the resource from the Network
 * and then save it to cache.
 * if not it will try to serve it from the cache.
 *
 * @param {Event} ev - really a FetchEvent with data from the fetch eventlistener.
 * The linting doesn't accept the {FetchEvent} declaration.
 */
const respondAndCache = async (ev) => {
  console.log('\n*** [xxServiceWorker] respondAndCache():', ev)
  const url = new URL(ev.request.url)

  // Strategy Netwoork first and cache, fallback cache.
  ev.respondWith(
    caches.open(cacheName)
      .then(async (cache) => {
        // Get resource from network
        return fetch(ev.request.url)
          .then((fetchedResponse) => {
            const r = fetchedResponse.clone()
            // console.log('[ServiceWorker] respondAndCache url, data', ev.request.url, data)
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
                  // console.log('[ServiceWorker] respondAndCache not in cache url', url.pathname)
                  const options = { status: 200, statusText: 'OK-cache' }
                  const res = new Response('{ "rate": "Offline rate is not available" }', options)
                  return res
                } else if (url.pathname.includes('api/latest')) {
                  console.log('[ServiceWorker] respondAndCache not in cache latest url', url.pathname)
                  const options = { status: 200, statusText: 'OK-cache' }
                  const res = new Response('{"rates":{ "noData": true, "rate": "Offline rates are not available." }}', options)
                  // console.log('[ServiceWorker] respondAndCache not in cache latest res', res)
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
 * Part of the Network first strategy.
 * If network available it gets the resource from the network
 * it doesn't cache or serve from cache.
 *
 * @param {Event} ev - really a FetchEvent with data from the fetch eventlistener.
 * The linting doesn't accept the {FetchEvent} declaration.
 */
const respondNoCache = (ev) => {
  // console.log('\n*** [xxServiceWorker] respondNoCache():', ev)
  ev.respondWith(caches.open(cacheName)
    .then((cache) => {
      return fetch(ev.request.url)
        .then((fetchedResponse) => {
          return fetchedResponse
        }).catch((err) => {
          console.error('No network access', err)
        })
    })
  )
}

/**
 * Handling  mode navigation requests.
 *
 * @param {Event} ev - really a FetchEvent with data from the fetch eventlistener.
 * The linting doesn't accept the {FetchEvent} declaration.
 */
const navigation = (ev) => {
  console.log('\n*** [xServiceWorker] navigation():')
  respondAndCache(ev)
}

/**
 * Handling mode no-cors requests.
 *
 * @param {Event} ev - really a FetchEvent with data from the fetch eventlistener.
 * The linting doesn't accept the {FetchEvent} declaration.
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
 * Handling mode cors requests.
 *
 * @param {Event} ev - really a FetchEvent with data from the fetch eventlistener.
 * The linting doesn't accept the {FetchEvent} declaration.
 */
const withCors = (ev) => {
  const url = new URL(ev.request.url)
  console.log('\n*** [xServiceWorker] withCors() pathname:', url.pathname)
  respondAndCache(ev)
  // Not caching the annoying Vite client prevents off-line functionality.
  // NOTE: In the future setup a test website locally to avoid all these annnoying
  //       problems with Vite.
}

// NOTE:
// First we need to check what kind of request it is.
// 1) navigation => network then cache (add or update)
// 2) no-cors => check if protocol is "chrome-extension" network do not cache
//                     else network then cache
// 3) cors => all js files. Check if pathname starts with "/@" network do not cache else network then cache
//            We ended up cacheing files with /@ too due to the annoying Vite.
//
self.addEventListener('fetch', (ev) => {
  const url = new URL(ev.request.url)
  console.log('\n*** [ServiceWorker] fetch ev, url:', ev, url)

  // Allow WebSocket connections to pass through the service worker
  if (ev.request.headers.get('upgrade') === 'websocket') {
    ev.respondWith(fetch(ev.request))
  } else {
    // Handling the request modes.
    if (ev.request.mode === 'navigate') {
      console.log('\n*** [ServiceWorker] if navigate:')
      navigation(ev)
    } else if (ev.request.mode === 'no-cors') noCors(ev)
    else if (ev.request.mode === 'cors') withCors(ev)
  }
})
