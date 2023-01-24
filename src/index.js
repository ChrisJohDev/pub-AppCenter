/**
 * Initializes the application and registers the service worker.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

import app from './js/app.js'
import './sw.js'

/**
 * Registering the serviceworker.
 */
const register = () => {
  navigator.serviceWorker.register('./sw.js')
    .then((registration) => {
      console.log('[index.js] ServiceWorker registered.', registration)
    }, (err) => {
      console.error('[index.js] Failed loading serviceWorker:', err)
    })
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    register()
  })
} else {
  console.error('[index.js] No support for ServiceWorkers!')
}
app()
