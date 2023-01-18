/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

import app from './app.js'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./js/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registered.', registration)
      }, (err) => {
        console.error('Failed loading serviceWorker:', err)
      })
  })
} else {
  console.error('No support for ServiceWorkers!')
}
app()
