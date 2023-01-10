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
    :host{
      flex: 1;
    }
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
    // #board
    #flipCounter
    #flippedCards
    #numberOfAttempts
    #correctPairedCards
    #delayTurnBackCards
    #delayHideCards
    /**
     *
     */
    constructor() {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.inData = {}
      // this.#board = {}
      this.#flipCounter = 0
      this.#flippedCards = []
      this.#numberOfAttempts = 0
      this.#correctPairedCards = 0
      this.#delayTurnBackCards = 1200 // time in ms
      this.#delayHideCards = 1000 // time in ms
    }

    /**
     *
     */
    connectedCallback() {
      this.#inData = JSON.parse(this.getAttribute('data-input'))
      // this.#board = this.shadowRoot.querySelector('#board')
      // console.log('inData:', this.#inData)
      this.#setUpBoard()
    }

    /**
     *
     * @param cards
     */
    #findColumns(cards) {
      // console.log('cards', cards)
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
    #lockAllCards() {
      const boardContent = this.shadowRoot.querySelector('#board-content')
      const cards = boardContent.childNodes

      cards.forEach(card => {
        card.lockCard()
      })
    }

    /**
     *
     */
    #unlockAllCards() {
      const boardContent = this.shadowRoot.querySelector('#board-content')
      const cards = boardContent.childNodes

      cards.forEach(card => {
        card.unlockCard()
      })
    }

    /**
     * Returns the cards displayed to have their backside up.
     */
    #flipCards() {
      const numbOfCards = this.#flippedCards.length
      this.#flippedCards.forEach(card => {
        card.flipCard()
      })
      for (let i = 0; i < numbOfCards; i++) {
        this.#flippedCards.shift()
      }
      this.#unlockAllCards()
    }

    /**
     *
     */
    #winsGame() {
      // console.log('WinsGame')
      const winner = new CustomEvent('game-winner', { detail: { name: this.#inData.name, attempts: this.#numberOfAttempts, cards: Number(this.#inData.game) } })
      this.dispatchEvent(winner)
    }

    /**
     *
     * @param data
     */
    #cardFlip(data) {
      this.#flipCounter++
      const cardId = data.detail.cardId
      const pairId = data.detail.pairId
      const card = this.shadowRoot.querySelector(`#${cardId}`)
      const boardContent = this.shadowRoot.querySelector('#board-content')
      const cards = boardContent.childNodes
      let winner = false
      this.#flippedCards.push(card)

      if (this.#flipCounter === 2) {
        this.#lockAllCards()
        this.#numberOfAttempts++

        if (this.#flippedCards[0].data.pair === pairId && this.#flippedCards[0].id !== cardId) {
          this.#correctPairedCards++
          // Check if we have found all pairs
          if (this.#correctPairedCards === cards.length / 2) {
            this.#winsGame()
            winner = true
          } else {
            setTimeout(() => {
              this.#flippedCards.forEach(card => {
                card.hideCard()
              })
            }, this.#delayHideCards)
          }
        }
        if (!winner) {
          setTimeout(() => {
            this.#flipCards()
          }, this.#delayTurnBackCards)
        }

        // console.log(`\n***cardFlip:\ncards: ${cards}\nflippedCards: ${this.#flippedCards}\nattempts: ${this.#numberOfAttempts}\ncorrectPairedCards: ${this.#correctPairedCards}`)
        this.#flipCounter = 0
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
        card1.setAttribute('id', `cardId-${i}-1`)
        card2.setAttribute('id', `cardId-${i}-2`)
        card1.addEventListener('card-flip', (ev) => {
          this.#cardFlip(ev)
        })
        card2.addEventListener('card-flip', (ev) => {
          // console.log('cardFlip event', ev)
          this.#cardFlip(ev)
        })
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
      // console.log('usedNumbers:', usedNumbers)
      let count = 0
      usedNumbers.forEach(numb => {
        // console.log('pile[numb]:', pile[numb])
        pile[numb].setAttribute('tabindex', ++count)
        pile[numb].addEventListener('keydown', (ev) => {
          // console.log('card keyown ev:', ev)
          if (ev.code === 'Space' || ev.code === 'Enter') {
            if (ev.originalTarget) {
              ev.originalTarget.shadowRoot.querySelector('.container').click()
            } else {
              console.log('b4 click', document.activeElement)
              ev.path[0].shadowRoot.querySelector('.container').click()
              ev.path[0].focus()
              console.log('after click', document.activeElement)
            }
          }
        })
        boardContent.appendChild(pile[numb])
      })

      console.log('activeElement 0', document.activeElement)
      this.shadowRoot.querySelector('[tabindex="1"]').focus()
      console.log('activeElement 1', document.activeElement)
        // setTimeout(() => {
        //   console.log(this.shadowRoot.querySelector('[tabindex="1"]'))
        //   console.log('activeElement 2', document.activeElement)
        //   this.shadowRoot.querySelector('[tabindex="1"]').focus()
        //   console.log('activeElement 3', document.activeElement)
        // }, 2000)
    }
  })
