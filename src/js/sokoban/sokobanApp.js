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
    box-sizing: border-box;
    margin: 0;
  }
  :host{
    display: flex;
    width: 684px;
    height: 576px;
    flex: 1;
    background-color: rgb(50, 50, 50);
  }
</style>
`

customElements.define('sokoban-app',

  /**
   *
   */
  class extends HTMLElement {
    /**
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode())
    }

    /**
     *
     */
    connectedCallback () {}

    /**
     *
     */
    disconnectedCallback () {}
  }
)
