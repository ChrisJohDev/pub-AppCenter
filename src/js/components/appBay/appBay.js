
const template = document.createElement('template')
template.innerHTML = `
<style>
  .bay-wrapper{
    height: clamp(20px, 5%, 40px);
    border-bottom: rgb(79, 79, 79) 4px inset;
    display: grid;
  }
</style>
  <div class='bay-wrapper'></div>
`

customElements.define('app-bay',
  /**
   *
   */
  class extends HTMLElement {
    #shadow
    /**
     *
     */
    constructor () {
      super()
      this.#shadow = this.attachShadow({ mode: 'open' })
      this.#shadow.appendChild(template.content.cloneNode(true))
    }

    /**
     *
     */
    connectedCallback () {
      console.log(`app-bay data: ${this.data}`)
      const wrapper = this.shadowRoot.querySelector('.bay-wrapper')
      wrapper.style.gridTemplateColumns = `repeat(${this.data.length}, max-content)`
      this.data.forEach(game => {
        const div = document.createElement('div')
        div.addEventListener('click', (ev) => {
          console.log(`event target: ${JSON.stringify(game)}`)
          const runApp = new CustomEvent('run-app', { detail: game })
          this.dispatchEvent(runApp)
        })
        div.setAttribute('style', 'width:max-content;padding:1rem 0.5rem;box-sizing:border-box;')

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
//     url: './chat/images/game.png'
//   }
// }
