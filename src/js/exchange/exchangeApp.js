/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

import { getCurrencyCodes } from './components/connections.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
  *{
    box-sizing: border-box;
    margin: 0;
  }
  :host{
    display: flex;
    width: 100%;
    height: 100%;
    background-color: rgb(50, 50, 50);
  }
  .wrapper{
    width: 400px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  h1{
    text-align:center;
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
    <div class="section">
      <label for="base">Base:</label>
      <select id="base"></select>
    </div>
    <div class="section">
      <label for="quote">Quote:</label>
      <select id="quote"></select>
    </div>
  </form>
</div>
`

const latestTemplate = document.createElement('template')
latestTemplate.innerHTML = `
<style></style>
<div class="pair-wrapper">
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

      this.#currencyList = getCurrencyCodes()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     *
     */
    connectedCallback() {
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
      if (ev.originalTarget.value === 'pair') {
        this.#loadPair()
      } else {
        this.#loadLatest()
      }
    }

    /**
     *
     */
    async #loadPair() {
      console.log('#loadPair', this.#currencyList)
      const dataArea = this.shadowRoot.querySelector('#dataArea')
      dataArea.replaceChildren(pairTemplate.content.cloneNode(true))
      const selectBase = dataArea.querySelector('#base')
      const selectQuote = dataArea.querySelector('#quote')
      const option = document.createElement('option')
      option.setAttribute('value', '')
      option.textContent = '-- Select --'
      selectBase.appendChild(option.cloneNode(true))
      selectQuote.appendChild(option)

      for (const curr of await this.#currencyList) {
        const option = document.createElement('option')
        option.setAttribute('value', curr[0])
        option.setAttribute('title', curr[1])
        option.textContent = `${curr[0]}`
        selectBase.appendChild(option.cloneNode(true))
        selectQuote.appendChild(option)
      }
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
