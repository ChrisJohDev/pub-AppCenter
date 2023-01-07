/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

import './card.js'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    #board-wrapper{
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #board-content{
      display: grid;
      gap: 3px;
      border:solid blue 1px;
    }
  </style>
  <div id="board-wrapper"><div id="board-content"></div></div>
`
const images = ['./js/memory/images/cards/back.png', './js/memory/images/cards/img1.png', './js/memory/images/cards/img2.png', './js/memory/images/cards/img3.png', './js/memory/images/cards/img4.png', './js/memory/images/cards/img5.png', './js/memory/images/cards/img6.png', './js/memory/images/cards/img7.png', './js/memory/images/cards/img8.png', './js/memory/images/cards/img9.png', './js/memory/images/cards/img10.png']

customElements.define('game-board',
  /**
   *
   */
  class extends HTMLElement {
    #inData
    #board
    /**
     *
     */
    constructor() {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.inData = {}
      this.#board = {}
    }

    /**
     *
     */
    connectedCallback() {
      this.#inData = JSON.parse(this.getAttribute('data-input'))
      this.#board = this.shadowRoot.querySelector('#board')
      console.log('inData:', this.#inData)
      this.#setUpBoard()
    }

    /**
     *
     * @param cards
     */
    #findColumns(cards) {
      console.log('cards', cards)
      for (let i = 1; i < Math.ceil((cards + 1) / 2); i++) {
        if (i * i === cards) return i
        for (let j = 0; j < i; j++) {
          if (i * (i - j) === cards) return i
        }
      }
    }

    /**
     *
     */
    #setUpBoard() {
      // console.log(`***\ninData.game: ${this.#inData.game}\nNumber(inData.game): ${Number(this.#inData.game)}`)
      const numberOfCards = Number(this.#inData.game)
      const columns = this.#findColumns(numberOfCards)
      const boardContent = this.shadowRoot.querySelector('#board-content')
      const rows = numberOfCards / columns
      const pile = []

      const style = this.shadowRoot.querySelector('style')
      style.innerHTML += `#board-content{grid-template-columns: repeat(${columns}, 50px); grid-template-rows: repeat(${rows}, 50px)}`

      for (let i = 1; i < (numberOfCards / 2 + 1); i++) {
        const card1 = document.createElement('memory-card')
        const card2 = document.createElement('memory-card')
        const data = {
          imgFront: images[i],
          imgBack: images[0],
          pair: `pair-${i}`
        }
        card1.data = data
        card2.data = data
        pile.push(card1)
        pile.push(card2)
      }

      const usedNumbers = []
      for (let i = 0; i < numberOfCards; i++) {
        let ok = false
        let counter = 0
        try {
          while (!ok) {
            const numb = Math.floor(Math.random() * (numberOfCards))
            if (!usedNumbers.includes(numb)) {
              usedNumbers.push(numb)
              ok = true
            }
            if (counter > 100000) throw new Error('Too many iterations without useful number.')
            counter++
          }
        } catch (err) {
          console.error(err)
        }
      }
      console.log('usedNumbers:', usedNumbers)
      usedNumbers.forEach(numb => {
        boardContent.appendChild(pile[numb])
      })
    }
  })
