/**
 * The appBay custom element.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.1.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
  *{
    box-sizing: border-box;
  }
  :host{
    display: block;
    height:100%;
  }
  .bay-wrapper{
    height: 100%;
    border-bottom: rgb(79, 79, 79) 4px inset;
    display: grid;
    gap: 0.5rem;
    padding-left: 0.5rem;
    align-items: center;
  }
</style>
  <div class='bay-wrapper'></div>
`

customElements.define('app-bay',
  /**
   *
   */
  class extends HTMLElement {
    /**
     * Class constructor function.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     * ConnectedCallback function.
     */
    connectedCallback () {
      // console.log(`app-bay data: ${this.data}`)
      const wrapper = this.shadowRoot.querySelector('.bay-wrapper')
      wrapper.style.gridTemplateColumns = `repeat(${this.data.length}, max-content)`
      this.data.forEach(game => {
        const div = document.createElement('div')
        div.addEventListener('click', (ev) => {
          // console.log(`event target: ${JSON.stringify(game)}`)
          const runApp = new CustomEvent('run-app', { detail: game })
          this.dispatchEvent(runApp)
        })
        div.setAttribute('style', 'width:max-content;box-sizing:border-box;')

        const img = document.createElement('img')
        img.setAttribute('src', game.image.url)
        img.setAttribute('alt', game.name)

        div.appendChild(img)
        wrapper.appendChild(div)
      })
    }
  }
)

// {
//   name: 'Chat',
//   url: './chat',
//   image: {
//     url: './js/chat/images/game.png'
//   }
// }
