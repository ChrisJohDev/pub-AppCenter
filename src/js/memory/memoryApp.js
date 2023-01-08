/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

import './components/welcome.js'
import './components/gameBoard.js'
import './components/results.js'
import '../components/timer'

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
<div class="game-wrapper">
  <div id="timer"></div>
  <div id="game"></div>
</div>
`

customElements.define('memory-app',
  /**
   *
   */
  class extends HTMLElement {
    #shadow
    #welcomePage
    #timer
    #timeScore
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

    disconnectedCallback() {
      this.#stopTimer()
    }

    /**
   * The game timer.
   */
    #startTimer() {
      this.#timer = document.createElement('timer-counter')
      this.#timer.data = {}
      this.#timer.data.interval = 1 // set interval to 1 sec.
      this.#timer.data.increment = true // always true if increment present in data object
      this.#timer.data.text = 'Elapsed time:'
      this.shadowRoot.querySelector('#timer').appendChild(this.#timer)
    }

    /**
   * Stops the current timer.
   */
    #stopTimer() {
      this.#timeScore = this.#timer.stopTimer()
      // console.log(`questionPage stopTimer score: ${this.#score}`)
    }

    #loadWelcome() {
      const welcome = document.createElement('welcome-page')
      welcome.addEventListener('play-game', (ev) => { this.#loadGame(ev.detail)})
      this.shadowRoot.querySelector('#game').replaceChildren(welcome)
    }

    #loadGame(data) {
      const memory = document.createElement('game-board')
      console.log('memoryApp loadGame data:', data)
      memory.setAttribute('data-input', JSON.stringify(data))
      console.log('memoryApp loadGame memory.data:', memory)
      this.shadowRoot.querySelector('#game').replaceChildren(memory)
      this.#startTimer()
    }

    #resultPage(data) {
      null
    }
  }
)
