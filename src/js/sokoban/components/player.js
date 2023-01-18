/**
 *
 */
class PlayerClass {
  /**
   *
   */
  constructor () {
    const _loaction = ''
  }

  /**
   *
   * @param loc
   */
  setLocation (loc) {
    this._location = loc
  }

  /**
   *
   */
  getLocation () {
    return this._location
  }

  /**
   *
   * @param originBoxId
   * @param targetBoxId
   * @param afterTargetBoxId
   * @param targetBoxType
   * @param afterTargetBoxType
   */
  move (originBoxId, targetBoxId, afterTargetBoxId, targetBoxType, afterTargetBoxType) {
    const origin = document.getElementById(originBoxId)
    const target = document.getElementById(targetBoxId)
    const afterTarget = document.getElementById(afterTargetBoxId)
    let tmpBox; const base = '/images/'
    let ok = false

    if (Current.moves == 0) {
      Current.start = Date.now()
    }
    Current.moves++

    if (targetBoxType == 'empty-square' || targetBoxType == 'target-square') {
      tmpBox = target.querySelector('img')
      tmpBox.setAttribute('src', base + 'player-box.gif')
      tmpBox.setAttribute('class', 'player-square')
      if (Target.indexOf(originBoxId) < 0) {
        tmpBox = origin.querySelector('img')
        tmpBox.setAttribute('src', base + 'board-box.gif')
        tmpBox.setAttribute('class', 'empty-square')
      } else {
        tmpBox = origin.querySelector('img')
        tmpBox.setAttribute('src', base + 'target-box.gif')
        tmpBox.setAttribute('class', 'target-square')
      }
      ok = true
    } else if (targetBoxType == 'box-square' && (afterTargetBoxType == 'empty-square' || afterTargetBoxType == 'target-square')) {
      tmpBox = target.querySelector('img')
      tmpBox.setAttribute('src', base + 'player-box.gif')
      tmpBox.setAttribute('class', 'player-square')
      if (Target.indexOf(originBoxId) < 0) {
        tmpBox = origin.querySelector('img')
        tmpBox.setAttribute('src', base + 'board-box.gif')
        tmpBox.setAttribute('class', 'empty-square')
      } else {
        tmpBox = origin.querySelector('img')
        tmpBox.setAttribute('src', base + 'target-box.gif')
        tmpBox.setAttribute('class', 'target-square')
      }

      tmpBox = afterTarget.querySelector('img')
      tmpBox.setAttribute('src', base + 'move-box.gif')
      tmpBox.setAttribute('class', 'box-square')
      ok = true
    } else {
      ok = false
    }
    if (ok) this._location = targetBoxId
    if (Board.getNumberOfRemainingTargets() == 0) {
      Current.end = Date.now()
      Game.gameEnd()
    }
  }
}
