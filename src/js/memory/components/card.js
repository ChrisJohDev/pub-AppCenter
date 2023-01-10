/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

/**
 * Codebase adapted from an idea from ChatGPT
 * Similar code from https://www.w3schools.com/howto/howto_css_flip_card.asp
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
  .container{
    font-size: 14px;
    max-height:3rem;
    max-width:3rem;
  }
  .card-front,
  .card-back{
    position: absolute;
    backface-visibility: hidden;
    transition: transform 0.8s ease-in-out;
  }

  .card-front {
    transform: rotateY(180deg);
  }

  .card-back {
    transform: rotateY(0deg);
  }

  .flipped .card-front {
    transform: rotateY(0deg);
  }

  .flipped .card-back {
    transform: rotateY(180deg);
  }

  img{
    height:3rem;
    width:3rem;
  }

</style>
<div class="container">
  <div class="card-front">
    <img id="imgFront" src="" alt="Front of card" />
  </div>
  <div class="card-back flipped">
    <img id="imgBack" src="" alt="Back of card" />
  </div>
</div>
`

customElements.define('memory-card',
  /**
   *
   */
  class extends HTMLElement {
    #height
    #width
    #pairId
    #locked

    /**
     *
     * @param height
     * @param width
     */
    constructor (height = '50px', width = '50px') {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.#height = height
      this.#width = width
      this.#locked = false
    }

    /**
     *
     */
    connectedCallback () {
      const { imgFront, imgBack, pair } = this.data
      const container = this.shadowRoot.querySelector('.container')
      // container.setAttribute('tabindex', '0')
      this.shadowRoot.querySelector('#imgFront').setAttribute('src', imgFront)
      this.shadowRoot.querySelector('#imgBack').setAttribute('src', imgBack)
      this.#pairId = pair
      container.addEventListener('click', (ev) => {
        if (!this.#locked) {
          this.#locked = true
          container.classList.toggle('flipped')
          // console.log('pair', this.#pairId)
          const flip = new CustomEvent('card-flip', { detail: { pairId: this.#pairId, cardId: this.getAttribute('id') } })
          this.dispatchEvent(flip)
        }
      })
      this.shadowRoot.querySelector('.card-front').style.height = this.#height
      this.shadowRoot.querySelector('.card-front').style.width = this.#width
      this.shadowRoot.querySelector('.card-back').style.height = this.#height
      this.shadowRoot.querySelector('.card-back').style.width = this.#width
    }

    /**
     *
     */
    lockCard () {
      this.#locked = true
    }

    /**
     *
     */
    unlockCard () {
      this.#locked = false
    }

    /**
     *
     */
    hideCard () {
      this.style.visibility = 'hidden'
    }

    /**
     *
     * @param ev
     */
    flipCard () {
      const container = this.shadowRoot.querySelector('.container')
      container.classList.toggle('flipped')
    }
  }
)
