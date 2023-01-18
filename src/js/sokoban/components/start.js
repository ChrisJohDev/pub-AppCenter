
// **** Program Start ****
/**
 *
 * @param board
 */
function init (board) {
  createSelectBox()
  newGame(board)
  Game.init()
}

/**
 *
 * @param board
 */
function newGame (board) {
  Current.boardNo = board
  Player.setLocation(Board.createBoard(board))
  Helper.focus('game-content')
  Current.moves = 0
  Helper.setValue('gameTime', '')
  Helper.setValue('gameMoves', '')
}

/**
 *
 */
function createSelectBox () {
  let html = '<div class="select-restart">'
  html += '<button class="reset-button" onclick="javascript: resetGame()">Reset Game</button>'
  html += '<select id="gameList" onchange="javascrip: selectGame(this)">'
  for (let i = 0; i < mapsArray.length; i++) {
    html += `<option value="${i}">Game ${i}</option>`
  }
  html += '</select></div>'
  Helper.setHtml('select-box', html)
}

/**
 *
 * @param board
 */
function selectGame (board) {
  newGame(board.value)
  document.getElementById('gameList').blur()
}

/**
 *
 */
function resetGame () {
  newGame(Current.boardNo)
}
