/**
 * Start of the memory application.
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
    display: flex;
    width: 100%;
    height: 100%;
    flex: 1;
    background-color: rgb(50, 50, 50);
  }
  .game-wrapper{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content:flex-start;
    align-items: flex-start;
  }
  #game{
    flex: 1;
    display: flex;
    width: 100%;
    z-index:2;
  }
  #timer{
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 2;
  }
</style>
<div class="game-wrapper">
  <div id="timer"></div>
  <div id="game"></div>
</div>
`

customElements.define('memory-app',
  /**
   * Custom element that represents the main memory game app.
   */
  class extends HTMLElement {
    /**
     * The shadow root of the component.
     *
     * @private
     */
    #shadow

    /**
     * The welcome page element.
     *
     * @private
     */
    #welcomePage

    /**
     * The timer element used to track elapsed time.
     *
     * @private
     */
    #timer

    /**
     * The final time score of the game.
     *
     * @private
     */
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
     * Callback function that runs when the element is connected to the DOM.
     */
    connectedCallback () {
      // this.setAttribute('style', 'width: max-content;')
      this.#loadWelcome()
      this.addEventListener('load-welcome', (ev) => { this.#loadWelcome() })
      this.addEventListener('play-game', (ev) => { this.#loadGame(ev.detail) })
      this.addEventListener('show-result', (ev) => { this.#loadResultPage(ev.detail) })
    }

    /**
     * Callback function that runs when the element is disconnected from the DOM.
     */
    disconnectedCallback () {
      this.#stopTimer()
    }

    /**
     * Start the timer.
     *
     * @private
     */
    #startTimer () {
      this.#timer = document.createElement('timer-counter')
      this.#timer.data = {}
      this.#timer.data.interval = 1 // set interval to 1 sec.
      this.#timer.data.increment = true // always true if increment present in data object
      this.#timer.data.text = 'Elapsed time:'
      this.shadowRoot.querySelector('#timer').appendChild(this.#timer)
    }

    /**
     * Stop the timer.
     *
     * @returns {number} - the elapsed time in milliseconds.
     * @private
     */
    #stopTimer() {
      return this.#timer && this.#timer.stopTimer()
      // console.log(`questionPage stopTimer score: ${this.#score}`)
    }

    // Idea stolen from chatGPT
    /**
     * Calculates the final score for the game.
     *
     * @param {object} data - The data object containing the score parameters.
     * @param {number} data.numCards - The number of cards in the game.
     * @param {number} data.time - The elapsed time of the game.
     * @param {number} data.numAttempts - The number of attempts taken by the player.
     * @returns {number} The final score for the game.
     * @private
     */
    #calculateScore ({ numCards, time, numAttempts }) {
      // higher number of cards increases points
      // longer time decreases points
      // more attempts decreases points
      // Determine the Card Value (e.g., you could use a fixed value of 100 points per card)
      const cardValue = 100
      const seconds = time / 1000 || 1

      // Calculate the Attempt Penalty (e.g., you could use a coefficient to decrease the score based on the number of attempts)
      const attemptPenalty = numCards > 4 ? numAttempts / Math.sqrt(numCards) : numAttempts

      // Calculate the total score
      const score = (cardValue * numCards * Math.sqrt(numCards / 2)) / (seconds) - attemptPenalty
      // console.log(`\n*** calculateScore:\ntime: ${time}\nnumCards: ${numCards}\nnumAttempts: ${numAttempts}\nscore: ${score}`)

      // return score with two decimals.
      return Math.floor(score * 100 + 0.5) / 100
    }

    /**
     * Loads the welcome page.
     *
     * @param {string} [name=''] - The player name.
     * @private
     */
    #loadWelcome (name = '') {
      const welcome = document.createElement('welcome-page')
      welcome.name = name
      welcome.addEventListener('play-game', (ev) => { this.#loadGame(ev.detail) })
      this.shadowRoot.querySelector('#game').replaceChildren(welcome)
    }

    /**
     * Loads the game board.
     *
     * @param {object} data - The data object containing the game details.
     * @private
     */
    #loadGame (data) {
      const memory = document.createElement('game-board')
      // console.log('memoryApp loadGame data:', data)
      memory.setAttribute('data-input', JSON.stringify(data))
      memory.addEventListener('game-winner', (ev) => {
        ev.preventDefault()
        this.#loadResultPage(ev.detail)
      })
      // console.log('memoryApp loadGame memory.data:', memory)
      this.shadowRoot.querySelector('#game').replaceChildren(memory)
      this.#startTimer()
    }

    /**
     * Loads the result page.
     *
     * @param {object} data - The data object containing the result details.
     * @private
     */
    #loadResultPage (data) {
      const time = this.#stopTimer()
      console.log('loadResultPage data:', data)

      const points = this.#calculateScore({ time, numCards: data.cards, numAttempts: data.attempts })
      const result = document.createElement('memory-result')
      result.data = { name: data.name, score: points }
      result.addEventListener('new-game', (ev) => {
        ev.preventDefault()
        this.#loadWelcome(ev.detail.name)
      })

      this.shadowRoot.querySelector('#timer').replaceChildren('')
      this.shadowRoot.querySelector('#game').replaceChildren(result)
      console.log('points:', points)
    }
  }
)
