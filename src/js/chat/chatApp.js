/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
  *{
    margin: 0;
  }
  #chatWrapper{
    width: max-content;
    height: min-content;
  }
  :host{
    /* position: absolute;
    z-index: 1; */
    z-index:2;
  }
</style>
  <div><h1>Chat App</h1></div>
`

customElements.define('chat-app',
  /**
   * 
   */
  class extends HTMLElement {
    /**
     * Class contructor function.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      // this.addEventListener('mousedown', () => {
      //   this.style.zIndex = 100
      //   const selected = new CustomEvent('new-select')
      //   this.dispatchEvent(selected)
      // })
      // this.addEventListener('blur', () => {
      //   this.style.zIndex = 1
      // })
    }

    connectedCallback() {
      this.setAttribute('style', 'width: max-content;')
    }
  }
)
