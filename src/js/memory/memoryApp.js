/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

import './components/welcome.js'
import './components/gameBoard.js'
import './components/results.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
  *{
    box-sizing: border-box;
    margin: 0;
  }
  :host{
    display: block;
    width: 100%;
    height: 100%;
  }
  #root{
    height: 100%;
  }
</style>
<div id="root"></div>
`

customElements.define('memory-app',
  /**
   *
   */
  class extends HTMLElement {
    #shadow
    #welcomePage
    /**
     * Class contructor function.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     * Connecte callback function.
     */
    connectedCallback () {
      // this.setAttribute('style', 'width: max-content;')
      this.#loadWelcome()
      this.addEventListener('load-welcome', (ev) => { this.#loadWelcome() })
      this.addEventListener('play-game', (ev) => { this.#loadGame(ev.detail) })
      this.addEventListener('show-result', (ev) => { this.#resultPage(ev.detail) })
    }

    #loadWelcome() {
      const welcome = document.createElement('welcome-page')
      welcome.addEventListener('play-game', (ev) => { this.#loadGame(ev.detail)})
      this.shadowRoot.querySelector('#root').replaceChildren(welcome)
    }

    #loadGame(data) {
      const memory = document.createElement('game-board')
      console.log('memoryApp loadGame data:', data)
      memory.setAttribute('data-input', JSON.stringify(data))
      console.log('memoryApp loadGame memory.data:', memory)
      this.shadowRoot.querySelector('#root').replaceChildren(memory)
    }

    #resultPage(data) {
      null
    }
  }
)
