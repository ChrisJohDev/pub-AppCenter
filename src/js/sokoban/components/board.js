/**
 *
 */
class BoardClass {
  // I know constructor isn't necessary but I keep them there anyhow for convenience.
  /**
   *
   */
  constructor () { }

  /**
   *
   * @param boardNo
   */
  createBoard (boardNo) {
    let playerStartLocation = ''
    let rows, columns, html
    let targetCounter = 0
    Target = []
    if (!(boardNo < mapsArray.length)) {
      console.log(`Requested board number ${boardNo.toString()} is greater than availabel number of boards "${mapsArray.length}".`)
    } else {
      rows = mapsArray[boardNo].mapGrid
      html = ''
      for (let i = 0; i < rows.length; i++) {
        columns = rows[i]
        html += '<div class="row">'
        for (let j = 0; j < columns.length; j++) {
          html += `<div id="${i}:${j}" class="board-square column"><img class="`
          switch (columns[j].toString()) {
            case ' ':
              html += 'empty-square" src="/images/board-box.gif" '
              break
            case 'W':
              html += 'wall-square" src="/images/wall-box.gif" '
              break
            case 'B':
              html += 'box-square" src="/images/move-box.gif" '
              break
            case 'G':
              html += 'target-square" src="/images/target-box.gif" '
              Target[targetCounter] = `${i}:${j}`
              targetCounter++
              break
            case 'P':
              html += 'player-square" src="images/player-box.gif" '
              playerStartLocation = `${i}:${j}`
              break
            default:
              html += '"/>'
          }
          html += 'height="36px" width="36px" /></div>'
        }
        html += '</div>'
      }
      Helper.setHtml('game-content', html)
    }
    return playerStartLocation
  }

  /**
   *
   * @param position
   */
  getBoxType (position) {
    const elem = document.getElementById(position)
    return elem.querySelector('img').attributes.class.value
  }

  /**
   *
   */
  getNumberOfRemainingTargets () {
    const tmp = document.getElementsByTagName('img')
    let counter = Target.length

    for (let i = 0; i < Target.length; i++) {
      if (document.getElementById(Target[i]).querySelector('img').getAttribute('class') == 'box-square') {
        counter--
      }
    }
    return counter
  }
}
