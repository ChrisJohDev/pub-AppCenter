/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */
import './components/layout'
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
  },
  {
    name: 'Sokoban',
    url: './sokoban',
    tag: 'sokoban-app',
    image: {
      url: './js/sokoban/images/game.jpg'
    }
  }
]

const tabIndexCounter = 1
// const appStartPos = { top: 10, left: 10 }

/**
 * When a new app-container is selected all apps z-index
 * properties are set to the new order.
 *
 * @param {HTMLEvent} ev - the event object.
 */
const newSelectedElement = (ev) => {
  const apps = document.querySelector('#appArea').childNodes
  apps.forEach(app => {
    app.style.zIndex = getAppOrder(app.appId)
  })
}

/**
 * Launches a new app and appends it to the content in #appArea.
 *
 * @param {object} data - object containing name, url, tag, and image.url.
 */
const startNewApp = (data) => {
  console.log('startNewApp data: ', data)
  try {
    const parent = document.querySelector('#appArea')
    import(data.url) // Dynamic import of applications
    // console.log(`data.tag: ${data.tag}`)
    const container = document.createElement('app-container')
    container.setAttribute('app_name', data.name)
    const app = document.createElement(data.tag)
    container.setAttribute('tabindex', '0')
    container.addEventListener('new-select', (ev) => {
      newSelectedElement(ev)
    })
    container.shadowRoot.querySelector('.wrapper > .body').appendChild(app)
    document.querySelector('#appArea').appendChild(container)
    moveElement(container, parent) // Add movement capability for app
  } catch (err) {
    console.error(`startNewApp: ${err}`)
  }
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
 *
 */
// const sizeAppArea = () => {
//   const parent = document.querySelector('main')
//   const appArea = parent.querySelector('#appArea')
//   const bayHeight = parent.querySelector('#bay').offsetHeight
//   const parentHeight = parent.offsetHeight
//   console.log(`size:\nbayHeight: ${bayHeight}\nparentHeight: ${parentHeight}\nappArea.height: ${appArea.offsetHeight}`)
//   appArea.style.height = (parentHeight - bayHeight) + 'px'
//   console.log(`new size:\nbayHeight: ${bayHeight}\nparentHeight: ${parentHeight}\nappArea.height: ${appArea.offsetHeight}`)
// }

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
