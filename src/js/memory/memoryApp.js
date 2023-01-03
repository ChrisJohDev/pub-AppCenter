/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */


/**
 * NOTE: In general, you should use the DOMContentLoaded event when you need to run 
 * code that accesses the DOM as soon as possible, and use the load event when you 
 * need to run code that depends on all resources being fully loaded.
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
  *{
    margin: 0;
  }
  /* #chatWrapper{
    width: max-content;
    height: min-content;
    color: white;
  } */
  :host{
    position: absolute;
    color: white;
    z-index: 1;
  }
</style>
  <div><h1>Memory App</h1></div>
`

customElements.define('memory-app',
  /**
   * 
   */
  class extends HTMLElement {
    #shadow
    /**
     * Class contructor function.
     */
    constructor() {
      super()
      this.#shadow = this.attachShadow({ mode: 'open' }).addEventListener('load', () => {
        this.dispatchEvent(new CustomEvent('app-loaded', { detail: { name: 'memoryApp' } }))
      })
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

    connectedCallback() {
      this.setAttribute('style', 'width: max-content;')
      
    }
  }
)