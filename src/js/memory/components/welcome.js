/**
 * The initial page for the memory application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

const headline = 'Memory Game'
const pageText = 'Match all pairs of cards in as few attempts and as fast as possible.'
const template = document.createElement('template')
template.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
    }
    :host, main, form{
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    :host{
      justify-content: flex-start;
      height: 100%;
      /* width: 500px;
      height: 300px; */
    }
    h1{
      margin-bottom: 1rem;
    }
    p{
      width: clamp(50px, 60%, 300px);
      text-align: center;
    }
    header{
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    main{
      margin-top: 1rem;
      justify-content: center;
      gap: 1rem;
    }
    form{
      gap: 1rem;
    }
    form > div{
      align-items: center;
    }
    .error{
      color: red;
      font-weight: 700;
    }
    #nameError{
      visibility: hidden;
      text-align: center;
    }
  </style>
  <header>
    <h1>${headline}</h1>
    <p>${pageText}</p>
  </header>
  <main>
    <form>
      <p class="error" id="nameError"></p>
      <div>
        <label for="name">Name: </label>
        <input tabindex="1" type="text" id="name" placeholder="Your game name" />
      </div>
      <select tabindex="2">
        <option disabled selected value="">-- Select your Game --</option>
        <option value="4">2x2 - 4 cards</option>
        <option value="8">4x2 - 8 cards</option>
        <option value="16">4x4 - 16 cards</option>
      </select>
      <div>
        <input type="submit" value="Start Game" tabindex="3" />
      </div>
  </form>
  </main>
`
/**
 * Custom Element for displaying a welcome page
 * with a form to submit user's name and selected game.
 *
 * @augments {HTMLElement}
 */
customElements.define('welcome-page',

  /**
   *
   */
  class extends HTMLElement {
    /**
     * The player's username.
     *
     * @private
     * @type {string}
     */
    #name

    /**
     * Creates an instance of WelcomePage.
     *
     * Appends a shadow root to the element and adds
     * the content of the 'template' variable to it.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     * Called every time the element is inserted into the DOM.
     *
     * Adds an event listener to the form and sets the value of
     * the '#name' input field if it was previously set.
     */
    connectedCallback () {
      this.#name = this.name
      console.log('welcome name:', this.name)
      const form = this.shadowRoot.querySelector('form')
      form.addEventListener('submit', (ev) => {
        ev.preventDefault()
        let name = form.querySelector('#name').value
        const game = form.querySelector('select').value
        if (name.match(/[^a-zA-Z]/)) name = null
        if (name && game) {
          const data = { name, game }
          const playGame = new CustomEvent('play-game', { detail: data })
          this.dispatchEvent(playGame)
        } else {
          const error = form.querySelector('#nameError')
          error.style.visibility = 'visible'
          if (!name && game) {
            error.innerHTML = 'A name is required and <br /> can only contain letter a - z and A - Z'
          } else if (name && !game) {
            error.textContent = 'You need to select a game from the drop down list.'
          } else {
            error.innerHTML = 'A name is required and <br> you need to select a game'
          }
        }
      })
      if (this.#name) {
        this.shadowRoot.querySelector('#name').value = this.#name
      }
      this.shadowRoot.querySelector('#name').focus()
    }
  }
)
