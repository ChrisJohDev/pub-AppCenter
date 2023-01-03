/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */
import './components/layout'
import './components/footer'
import './components/appBay'
import { dragElement } from './modules/moveElement.js'

const games = [
  {
    name: 'Chat',
    url: './chat',
    tag: 'chat-app',
    image: {
      url: './js/chat/images/game.png'
    }
  },
  {
    name: 'Exchange',
    url: './exchange',
    tag: 'exchange-app',
    image: {
      url: './exchange/images/game.png'
    }
  },
  {
    name: 'Memory',
    url: './memory',
    tag: 'memory-app',
    image: {
      url: './memory/images/game.png'
    }
  },
  {
    name: 'Sokoban',
    url: './sokoban',
    tag: 'sokoban-app',
    image: {
      url: './sokoban/images/game.png'
    }
  }

]

let tabIndexCounter = 1

/**
 *
 * @param ev
 */
const newSelectedElement = (ev) => {
  const apps = document.querySelector('#appArea').childNodes
  // console.log(`newSelectedElement apps.length: ${apps.length}`)
  apps.forEach(app => {
    // console.log(`ev: ${ev.target.getAttribute('tabindex')}`)
    if (ev.target.getAttribute('tabindex') !== app.getAttribute('tabindex')) {
      app.style.zIndex = app.getAttribute('tabindex')
    }
  })
}

/**
 * Launches a new app and appends it to the content in #appArea.
 *
 * @param {object} data - object containing name, url, tag, and image.url.
 */
const startNewApp = (data) => {
  console.log(`startNewApp data: ${JSON.stringify(data)}`)
  try {
    import(data.url)
    console.log(`data.tag: ${data.tag}`)
    /* @vite-ignore */
    const app = document.createElement(data.tag)
    app.setAttribute('tabindex', tabIndexCounter++)
    app.addEventListener('new-select', (ev) => {
      newSelectedElement(ev)
    })
    dragElement(app, document.querySelector('#appArea')) // Add movement capability for app
    document.querySelector('#appArea').appendChild(app)
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
  bay.addEventListener('bay-loaded', () => {
    console.log('bay-loaded event fired.')
    sizeAppArea()
  })

  appBay.appendChild(bay)
}

/**
 *
 */
const sizeAppArea = () => {
  
  const appArea = parent.querySelector('#appArea')
  const parent = appArea.offsetParent // document.querySelector('main')
  const bayHeight = parent.querySelector('#bay').offsetHeight
  const parentHeight = parent.offsetHeight
  console.log(`size:\nbayHeight: ${bayHeight}\nparentHeight: ${parentHeight}\nappArea.height: ${appArea.offsetHeight}`)
  appArea.style.height = (parentHeight - bayHeight) + 'px'
  console.log(`new size:\nbayHeight: ${bayHeight}\nparentHeight: ${parentHeight}\nappArea.height: ${appArea.offsetHeight}`)
}

/**
 * The application.
 * Starting point for the application.
 */
const app = () => {
  const body = document.querySelector('body')
  const footer = document.createElement('footer-component')
  body.appendChild(footer)

  addAppBay()
}
export default app
