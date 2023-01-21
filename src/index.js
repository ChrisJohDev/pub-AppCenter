/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

import app from './js/app.js'
import './sw.js'

/**
 *
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
  navigator.serviceWorker.addEventListener('message', (ev) => {
    console.log('\n*** [index.js] message: ', ev)
    if (ev.data === 'registerNew') register()
  })
  window.addEventListener('load', () => {
    register()
  })

  // navigator.serviceWorker.controller.postMessage('getVersion')
} else {
  console.error('[index.js] No support for ServiceWorkers!')
}
app()
