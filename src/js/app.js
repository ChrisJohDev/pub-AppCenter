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
      url: './chat/images/game.png'
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

/**
 *
 * @param data
 */
const startNewApp = (data) => {
  console.log(`startNewApp data: ${JSON.stringify(data)}`)
  try {
    import(data.url)
    console.log(`data.tag: ${data.tag}`)
    const app = document.createElement(data.tag)

    console.log(`app: ${app}`)
    dragElement(app, document.querySelector('#appArea'))
    document.querySelector('#appArea').appendChild(app)
  } catch (err) {
    console.error(`startNewApp: ${err}`)
  }
}

/**
 *
 */
const addAppBay = () => {
  const appBay = document.querySelector('#bay')
  const bay = document.createElement('app-bay')
  console.log(`addAppBay bay: ${bay}`)
  bay.data = [...games]
  bay.addEventListener('run-app', (ev) => {
    startNewApp(ev.detail)
  })

  appBay.appendChild(bay)
}

/**
 * The app.
 */
const app = () => {
  const body = document.querySelector('body')
  const footer = document.createElement('footer-component')
  body.appendChild(footer)

  addAppBay()
}
export default app
