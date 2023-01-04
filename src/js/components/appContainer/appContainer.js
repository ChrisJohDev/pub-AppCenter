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
      background-color: lightblue;
      /* temp sizing*/
      height: 100px;
      width: 200px;
      z-index: 1;
    }
    header{
      height: 2rem;
      border-bottom: 1px grey solid;
      background-color: lightslategray;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    input[type="button"]{
      color: gold;
      background-color: inherit;
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
        <h3 id="gameName"></h3>
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
    /**
     *
     */
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.addEventListener('mousedown', () => {
        this.style.zIndex = 100
        const selected = new CustomEvent('new-select')
        this.dispatchEvent(selected)
      })
      this.addEventListener('blur', () => {
        this.style.zIndex = 1
      })
    }
  }

)
