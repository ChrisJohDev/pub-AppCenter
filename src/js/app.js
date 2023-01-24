/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */
import './components/footer'
import './components/appBay'
import './components/appContainer'
import { moveElement } from './modules/moveElement.js'
import { getAppOrder, clearAppOrder } from './modules/appOrder.js'

const games = [
  {
    name: 'Chatterbox',
    url: './chat',
    tag: 'chat-app',
    image: {
      url: './js/chat/images/game.png'
    }
  },
  {
    name: 'Exchange Rates',
    url: './exchange',
    tag: 'exchange-app',
    image: {
      url: './js/exchange/images/game.jpg'
    }
  },
  {
    name: 'Memory',
    url: './memory',
    tag: 'memory-app',
    image: {
      url: './js/memory/images/game.png'
    }
  }
]

/**
 * When a new app-container is selected all apps z-index
 * properties are set to the new order.
 *
 * @param {Event} ev - the event object.
 */
const newSelectedElement = (ev) => {
  const apps = document.querySelector('#appArea').childNodes
  apps.forEach(app => {
    app.style.zIndex = getAppOrder(app.appId)
  })
}

/**
 * Launches the sub-applications.
 * If app failed to load we will provide a default message.
 *
 * @param {boolean} failedImport - indicates if the import was succesful or not.
 * @param {object} data - object containing name, url, tag, and image.url.
 */
const launchApp = (failedImport, data) => {
  try {
    const parent = document.querySelector('#appArea')
    // console.log(`data.tag: ${data.tag}`)
    const container = document.createElement('app-container')
    container.setAttribute('app_name', data.name)
    const app = !failedImport
      ? document.createElement(data.tag)
      : document.createElement('div')
    container.setAttribute('tabindex', '0')
    container.addEventListener('new-select', (ev) => {
      newSelectedElement(ev)
    })
    // Set the attributes for the fallback when offline and app not cached.
    if (failedImport) {
      app.setAttribute('style', 'flex:1; height: calc(300px - 1.5rem); background-color: grey;')
      app.innerHTML = `<h1 style='text-align: center; margin-top:2rem; color: red;'>App Failure!!</h1><p style='color: white; margin-top:1rem; text-align: center;'>Failed to load ${data.name}.</p>`
    }
    container.shadowRoot.querySelector('.wrapper > .body').appendChild(app)
    document.querySelector('#appArea').appendChild(container)
    moveElement(container, parent) // Add movement capability for app
  } catch (err) {
    console.error('[app] launchApp try - catch: ', err)
  }
}

/**
 * Launches a new app and appends it to the content in #appArea.
 *
 * @param {object} data - object containing name, url, tag, and image.url.
 */
const startNewApp = (data) => {
  // console.log('startNewApp data: ', data)

  import(data.url) // Dynamic import of applications
    .then(() => {
      launchApp(false, data)
    })
    .catch((err) => {
      launchApp(true, data)
      console.error('[app] startNewApp import catch: ', err)
    })
}

/**
 * Adds the application bay from where the applications can be launched.
 */
const addAppBay = () => {
  const appBay = document.querySelector('#bay')
  const bay = document.createElement('app-bay')
  // console.log(`addAppBay bay: ${bay}`)
  bay.data = [...games]
  bay.addEventListener('run-app', (ev) => {
    startNewApp(ev.detail)
  })

  appBay.appendChild(bay)
}

/**
 * The application.
 * Starting point for the application.
 */
const app = () => {
  clearAppOrder()
  const body = document.querySelector('body')
  const footer = document.createElement('footer-component')
  body.appendChild(footer)

  addAppBay()
}

export default app

// Removed from app temporarily, due to time constraint.
// ,
// {
//   name: 'Sokoban',
//     url: './sokoban',
//       tag: 'sokoban-app',
//         image: {
//     url: './js/sokoban/images/game.jpg'
//   }
// }
