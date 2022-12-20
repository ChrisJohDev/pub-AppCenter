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
    position: absolute;
  }
</style>
  <div><h1>Memory App</h1></div>
`

customElements.define('memory-app',
  /**
   * 
   */
  class extends HTMLElement {
    /**
     * Class contructor function.
     */
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
      this.setAttribute('style', 'width: max-content;')
    }
  }
)