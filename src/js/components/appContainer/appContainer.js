/**
 * The appContainer custom element.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.1.0
 */

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host{
      position: absolute;
      border: 1px solid grey;
      background-color: transparent;
      /* temp sizing*/
      min-height: 300px;
      max-height: 500px;
      min-width: 400px;
      max-width: 900px;
      z-index: 1;
    }
    header{
      height: 1.5rem;
      border-bottom: 1px grey solid;
      background-color: lightslategray;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    header:hover{
      cursor: move;
    }
    header > h3 {
      user-select: none;
    }
    input[type="button"]{
      box-sizing: content-box;
      margin-right: 3px;
      color: gold;
      background-color: inherit;
      border: 2px solid transparent;
      /* vertical-align: center; */
    }
    input[type="button"]:hover{
      border: outset 2px black;
    }
    .wrapper{
      
    }
  </style>
  <div class="wrapper">
    <header>
      <div class="icon">
        <img id="gameIcon" src="" alt="" title="" />
      </div>
      <div>
        <h3 id="gameName">Default</h3>
      </div>
      <div>
        <input type="button" id="closeWindow" value="X" />
      </div>
    </header>
    <div class='body'></div>
  </div>
`

customElements.define('app-container',

  /**
   *
   */
  class extends HTMLElement {
    #appName
    /**
     *
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.addEventListener('mousedown', () => {
        this.style.zIndex = 10000
        const selected = new CustomEvent('new-select')
        this.dispatchEvent(selected)
      })
      this.addEventListener('blur', () => {
        this.style.zIndex = 1
      })
    }

    connectedCallback() {
      this.#appName = this.getAttribute('app_name')
      this.shadowRoot.querySelector('#gameName').textContent = this.#appName
      this.shadowRoot.querySelector('#closeWindow').addEventListener('click', (ev) => {
        ev.preventDefault()
        const parent = this.parentNode
        parent.removeChild(this)
        this.remove()
      })
    }
  }
)
