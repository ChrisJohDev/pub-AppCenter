/**
 * The footer component for the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.1.0
 */

const template = document.createElement('template')
const today = new Date()
const currentYear = today.getFullYear()
template.innerHTML = `
  <style>
    p {
      text-align: center;
      font-size: 1rem;
      font-family: serif;
    }
    a {
      color: inherit;
    }
  </style>
  <footer>
    <p>Copyright &copy; ${currentYear} <a href="https://chrisjohannesson.com" tabindex="0" target="_blank">Chris Johannesson</a></p>
  </footer>
`

/**
 * Personalized footer.
 */
class Footer extends HTMLElement {
  /**
   * Stores a referens to the shadow object.
   */
  #shadow

  /**
   * Class contructor.
   */
  constructor () {
    super()

    this.#shadow = this.attachShadow({
      mode: 'open'
    })

    this.#shadow.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('footer-component', Footer)
