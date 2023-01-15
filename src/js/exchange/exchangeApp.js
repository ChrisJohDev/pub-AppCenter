/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

import { getCurrencyCodes, getPair } from './components/connections.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
  *{
    box-sizing: border-box;
    margin: 0;
  }
  :host{
    display: flex;
    width: 400px;
    height: 300px;
    background-color: rgb(50, 50, 50);
  }
  .wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  h1{
    text-align:center;
  }
  .currency-container{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  fieldset{
    width:max-content;
    margin-top:1rem;
  }
  fieldset div {
    display: inline-block;
    padding: 0 0.3rem;
  }
</style>
<div class="wrapper">
  <h1>Your Currency Exchange</h1>
  <div class="currency-container">
    <form id="queryType">
      <fieldset>
        <legend>Select information type</legend>
        <div title="Select a pair and get their current exchange rate">
          <input id="pair" name="displayType" type="radio" value="pair"  />
          <label for="pair">Currency pair rate</label>
        </div>
        <div  title="Select one currency and 5 other currencies to see the latest exchange rates">
          <input id="latest" name="displayType" type="radio" value="latest" />
          <label for="latest">Latest rates</label>
        </div>
      </fieldset>
    </form>
    <div id="dataArea" class="display-area"></div>
  </div>
</div>
`

const pairTemplate = document.createElement('template')
pairTemplate.innerHTML = `
<style>
  .pair-wrapper{
    margin-top: 0.8rem;
  }
  form{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  form > div + div{
    margin-top: 1rem;
  }
  .selection-wrapper{
    display: flex;
    justify-content: center;
  }
  .section{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 0.4rem;
  }
</style>
<div class="pair-wrapper">
  <form>
    <div class="selection-wrapper">
      <div class="section">
        <label for="base">Base:</label>
        <select id="base"></select>
      </div>
      <div class="section">
        <label for="quote">Quote:</label>
        <select id="quote"></select>
      </div>
    </div>
    <div>
      <input type="submit" id="submit" value="Submit" />
    </div>
  </form>
</div>
`

const latestTemplate = document.createElement('template')
latestTemplate.innerHTML = `
<style></style>
<div class="latest-wrapper">
  <form>
    <label for="base">Currency:</label>
    <select id="base"></select>
  </form>
</div>
`

customElements.define('exchange-app',

  /**
   *
   */
  class extends HTMLElement {
    #currencyList
    /**
     *
     */
    constructor() {
      super()

      getCurrencyCodes()
        .then(list => { this.#currencyList = list })
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     *
     */
    async connectedCallback() {
      const form = this.shadowRoot.querySelector('#queryType')
      const displayTypes = form.querySelectorAll('input[name="displayType"]')

      displayTypes.forEach(type => {
        type.addEventListener('click', (ev) => this.#checkChange(ev))
      })
    }

    /**
     *
     * @param ev
     */
    #checkChange(ev) {
      if (ev.originalTarget) { // Firefox
        if (ev.originalTarget.value === 'pair') {
          this.#loadPair()
        } else {
          this.#loadLatest()
        }
      } else if (ev.path) { // Chrome
        if (ev.path[0].value === 'pair') {
          this.#loadPair()
        } else {
          this.#loadLatest()
        }
      }
    }

    /**
     *
     */
    async #loadPair() {
      // console.log('#loadPair', this.#currencyList)
      const dataArea = this.shadowRoot.querySelector('#dataArea')
      dataArea.replaceChildren(pairTemplate.content.cloneNode(true))
      const form = dataArea.querySelector('form')
      const selectBase = dataArea.querySelector('#base')
      const selectQuote = dataArea.querySelector('#quote')
      const option = document.createElement('option')
      option.setAttribute('value', '')
      option.setAttribute('style', 'color: grey;')
      option.textContent = '-- Select --'
      selectBase.appendChild(option.cloneNode(true))
      selectQuote.appendChild(option)

      for (const curr of await this.#currencyList) {
        const option = document.createElement('option')
        option.setAttribute('value', JSON.stringify([curr[0], curr[1]]))
        option.setAttribute('title', curr[1])
        option.textContent = `${curr[0]}`
        selectBase.appendChild(option.cloneNode(true))
        selectQuote.appendChild(option)
      }

      form.addEventListener('submit', async (ev) => {
        ev.preventDefault()
        if (selectBase.value && selectQuote.value) {
          const base = JSON.parse(selectBase.value)
          const quote = JSON.parse(selectQuote.value)
          console.log('base.value[1]', JSON.parse(selectBase.value)[1])
          console.log('quote.value[1]', quote[1])
          const rate = await getPair(base[0], quote[0])
          const div = document.createElement('div')
          div.setAttribute('id', 'currency-rate')
          const p = document.createElement('p')
          const span1 = document.createElement('span')
          const span2 = document.createElement('span')
          span1.setAttribute('title', base[1])
          span1.textContent = base[0]
          span2.setAttribute('title', quote[1])
          span2.textContent = quote[0]
          p.setAttribute('style', `
          border: 2px solid gold; 
          padding: 0.3rem 0.5rem; 
          border-radius: 8px;
          background-color: rgb(75, 75, 75);
          `)
          p.style.textAlign = 'center'
          p.style.marginTop = '1rem'
          p.innerHTML = `<span title='${base[1]}'>${base[0]}</span>/<span title='${quote[1]}'>${quote[0]}</span> - ${rate.rate}`
          
          
          console.log('base:', selectBase)
          console.log('rate', rate)
          div.appendChild(p)
          if (this.shadowRoot.querySelector('#currency-rate')) {
            this.shadowRoot.querySelector('.currency-container')
            .removeChild(this.shadowRoot.querySelector('#currency-rate'))
          }
          this.shadowRoot.querySelector('.currency-container').appendChild(div)
        } else {
          const popup = document.createElement('div')
          const p = document.createElement('p')
          p.textContent = 'Select a currency!'

          popup.setAttribute('id', 'popup')
          popup.appendChild(p)

          if (!selectBase.value) {
            popup.setAttribute('style',
              `
                position: absolute;
                left: ${selectBase.offsetLeft - 20}px;
                bottom: ${form.offsetTop - 8}px;
                color: red;
                background-color: white;
                border: 2px solid red;
                padding: 0.3rem;
                border-radius: 8px;
              `)
          } else {
            popup.setAttribute('style',
              `
                position: absolute;
                left: ${selectQuote.offsetLeft - 20}px;
                bottom: ${form.offsetTop - 8}px;
                color: red;
                background-color: white;
                border: 2px solid red;
                padding: 0.3rem;
                border-radius: 8px;
              `)
          }
          form.appendChild(popup)
          setTimeout(() => {
            form.removeChild(popup)
          }, 2000)
        }
      })

      // disable the chosen currency in the other select createElement
      // we don't want to query what USD/USD is since it's always 1.
      selectBase.addEventListener('change', (ev) => {
        console.log('ev', selectBase.value)
        const choice = selectBase.value
        const list = selectQuote.querySelectorAll('option')
        for (const option of list) {
          if (option.value === choice) {
            option.setAttribute('disabled', true)
          } else {
            option.removeAttribute('disabled')
          }
        }
      })

      selectQuote.addEventListener('change', (ev) => {
        console.log('ev', selectQuote.value)
        const choice = selectQuote.value
        const list = selectBase.querySelectorAll('option')
        for (const option of list) {
          if (option.value === choice) {
            option.setAttribute('disabled', true)
          } else {
            option.removeAttribute('disabled')
          }
        }
      })
    }

    /**
     *
     */
    #loadLatest() {
      const dataArea = this.shadowRoot.querySelector('#dataArea')
      dataArea.replaceChildren(latestTemplate.content.cloneNode(true))
    }
  }
)
