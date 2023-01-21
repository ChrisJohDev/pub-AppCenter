/**
 * Provide the result of the last game and a list of the top five scores
 * from localStorage.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.1.0
 */

const template = document.createElement('template')
template.innerHTML = `
  <style>
    *{
      box-sizing: border-box;
      margin: 0;
    }
    :host{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    h1{
      font-family: Cambria, Cochin, Georgia, "Times New Roman", Times, serif;
      font-weight: 700;
    }
    div + div{
      margin-top: 1rem;
    }
    p, h4{
      margin: 0;
    }
    p{
      text-align: center;
    }
    .score{
      text-align: right;
      padding-right: 0.5rem;
    }
    h4{
      text-decoration: underline;
      margin: 0 3px 0 3px
    }
    #resultPage{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    #topFiveList{
      display: grid;
      /* gap: 1rem; */
      grid-template-columns: auto max-content max-content auto;
      grid-template-rows: auto min-content min-content min-content min-content min-content ;
      grid-template-areas: 
      ". playerHeader scoreHeader ."
      ". player0 score0 ."
      ". player1 score1 ."
      ". player2 score2 ."
      ". player3 score3 ."
      ". player4 score4 ." ;
    }
    #name-0{
      grid-area: player0;
    }
    #score-0{
      grid-area: score0;
    }
    #name-1{
      grid-area: player1;
    }
    #score-1{
      grid-area: score1;
    }
    #name-2{
      grid-area: player2;
    }
    #score-2{
      grid-area: score2;
    }
    #name-3{
      grid-area: player3;
    }
    #score-3{
      grid-area: score3;
    }
    #name-4{
      grid-area: player4;
    }
    #score-4{
      grid-area: score4;
    }
    #player-header{
      grid-area: playerHeader;
    }
    #score-header{
      grid-area: scoreHeader;
    }
    input[type="button"]{
      color: gold;
      background-color: grey;
      padding: 0.5rem 1rem;
      border-radius: 0.3rem;
    }
    input[type="button"]:hover{
      background-color: darkgrey;
    }
  </style>
  <div id="resultPage">
    <h1 id="resultHeader">Top Points</h1>
    <div id="playerRank"></div>
    <div id="topFiveList"></div>
    <div><input type="button" tabindex="1" id="newGame" value="Play again?" />
  </div>
`

/**
 * Result page class.
 */
class ResultPage extends HTMLElement {
  /**
   * The reference to this shadow DOM.
   *
   * @type {object}
   * #private
   */
  #thisShadow

  /**
   * Object that holds the data for the player who just played the game.
   *
   * @type {object}
   * @private
   */
  #lastPlayer

  /**
   * Text string for the name we use for this game in the local web storage.
   *
   * @type {string}
   * @private
   */
  #storageName

  /**
   * Creates an instance of ResultPage.
   *
   * Appends a shadow root to the element and adds
   * the content of the 'template' variable to it.
   * Initializes the properties of the class.
   */
  constructor () {
    super()
    this.#thisShadow = this.attachShadow({ mode: 'open' })
    this.#thisShadow.appendChild(template.content.cloneNode(true))
    this.#lastPlayer = {}
    this.#storageName = 'memoryGameB3LNU-highScoreList'

    // for test ONLY
    // this.#setHighScoreList(
    //   [{ name: 'Alpha', score: '4567' }, { name: 'Bravo', score: '1234' }, { name: 'Charlie', score: '3214' }, { name: 'Delta', score: '4657' }, { name: 'Echo', score: '9875' }, { name: 'Foxtrot', score: '6464' }, { name: 'Golf', score: '4565' }, { name: 'Hotel', score: '5465' }, { name: 'India', score: '7856' }, { name: 'Juliet', score: '5564' }, { name: 'Kilo', score: '5321' }, { name: 'Lima', score: '4321' }, { name: 'Mike', score: '4512' }, { name: 'November', score: '4532' }, { name: 'Oscar', score: '3451' }, { name: 'Papa', score: '2403' }, { name: 'Quebec', score: '3985' }, { name: 'Romeo', score: '6464' }, { name: 'Sierra', score: '4324' }, { name: 'Tango', score: '5123' }, { name: 'Uniform', score: '8654' }, { name: 'Victor', score: '10321' }, { name: 'Whiskey', score: '10987' }, { name: 'X-Ray', score: '7300' }, { name: 'Yankee', score: '5512' }, { name: 'Zulu', score: '2365' }]
    // )
  }

  /**
   * Called every time the element is inserted into the DOM.
   */
  connectedCallback () {
    if (this.data) {
      this.#lastPlayer.name = this.data.name
      this.#lastPlayer.score = this.data.score
    }
    this.#thisShadow.querySelector('#newGame').addEventListener('click', (ev) => {
      ev.preventDefault()
      this.#newGame()
    })
    this.#displayResults()
    this.#thisShadow.querySelector('#newGame').focus()
  }

  /**
   * Handles the request to pplay the game again.
   *
   * @private
   */
  #newGame () {
    const data = { name: this.#lastPlayer.name }
    const newGame = new CustomEvent('new-game', { detail: data })
    this.dispatchEvent(newGame)
  }

  /**
   * Gets the previous scores from the local storage.
   *
   * @returns {object} - an array with all scores in storage.
   * @private
   */
  #getHighScoreList () {
    const data = localStorage.getItem(this.#storageName)
    if (data && data.length < 1) return null
    try {
      const array = JSON.parse(data)
      return array
    } catch (err) {
      console.error(`#getHighScorelist: ${err}`)
      return [{ error: '-1' }]
    }
  }

  /**
   * Writes the high scores into browser local storage.
   *
   * @param {object} list - an array of all the scores.
   * @private
   */
  #setHighScoreList (list) {
    try {
      localStorage.setItem(this.#storageName, JSON.stringify(list))
    } catch (err) {
      console.log(`Storage not available: ${err}`)
    }
  }

  /**
   * Sorting function for the supplied array in list.
   *
   * @param {object} indata - {ascending: boolean, list: array}
   *
   * @returns {object} - a sorted list
   * @private
   */
  #sortList (indata) {
    const newInData = JSON.parse(JSON.stringify(indata.list))
    const data = []

    newInData.forEach((elem, indx) => {
      if (indx === 0) data.push(elem)
      else {
        if (indata.ascending) {
          if (Number(data[data.length - 1].score) < Number(elem.score)) data.push(elem)
          else {
            for (let i = 0; i < data.length; i++) {
              if (Number(elem.score) < Number(data[i].score)) {
                data.splice(i, 0, elem)
                i = data.length
              }
            }
          }
        } else {
          if (Number(data[data.length - 1].score) > Number(elem.score)) data.push(elem)
          else {
            for (let i = 0; i < data.length; i++) {
              if (Number(elem.score) > Number(data[i].score)) {
                data.splice(i, 0, elem)
                i = data.length
              }
            }
          }
        }
      }
    })

    return data
  }

  /**
   * Returns the player's placement in the sorted list.
   *
   * @param {object} sortedList - array of sorted data.
   * @param {object} player - the player object to compare against the data.
   *
   * @returns {number} - players ranking.
   * @private
   */
  #findPlayerRank (sortedList, player) {
    let rank = -1
    sortedList.forEach((item, indx) => {
      if (Number(player.score) < Number(item.score) && rank < 0) {
        rank = indx + 1
      }
    })

    if (rank < 0) return sortedList.length + 1
    return rank
  }

  /**
   * Main controller.
   *
   * @private
   */
  #displayResults () {
    const resultList = this.#getHighScoreList() || []

    if (Array.isArray(resultList)) {
      const sortedList = this.#sortList({ list: resultList, ascending: false })
      this.#makeDisplay(sortedList)
    } else { console.log('list is not an array', JSON.stringify(resultList) + Array.isArray(resultList)) }
  }

  /**
   * Controlls the dislay.
   *
   * @param {object} inList - array of high scores.
   * @private
   */
  #makeDisplay (inList) {
    const listRoot = this.#thisShadow.querySelector('#topFiveList')

    this.#lastPlayer.score && inList.push({ name: this.#lastPlayer.name, score: this.#lastPlayer.score })
    const sortedList = this.#sortList({ list: inList, ascending: false })
    // List the top 5 scores
    const max = sortedList.length < 5 ? sortedList.length : 5

    this.#thisShadow.querySelector('#playerRank').textContent = `Your score: ${this.#lastPlayer.score}`

    for (let i = 0; i < max; i++) {
      const nameNode = document.createElement('p')
      nameNode.setAttribute('id', `name-${i}`)
      nameNode.textContent = sortedList[i].name
      const scoreNode = document.createElement('p')
      scoreNode.setAttribute('id', `score-${i}`)
      scoreNode.setAttribute('class', 'score')
      scoreNode.textContent = sortedList[i].score // this.#formatScore(sortedList[i].score)
      listRoot.appendChild(nameNode)
      listRoot.appendChild(scoreNode)
    }
    const nameNode = document.createElement('h4')
    nameNode.setAttribute('id', 'player-header')
    nameNode.textContent = 'Name'
    const scoreNode = document.createElement('h4')
    scoreNode.setAttribute('id', 'score-header')
    scoreNode.textContent = 'Points'

    listRoot.appendChild(nameNode)
    listRoot.appendChild(scoreNode)

    this.#setHighScoreList(sortedList)
  }
}

customElements.define('memory-result', ResultPage)
