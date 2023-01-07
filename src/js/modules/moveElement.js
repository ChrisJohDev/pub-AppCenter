/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

// Code adapted from https://www.w3schools.com/howto/howto_js_draggable.asp
// and ideas from https://web.dev/drag-and-drop/

/**
 * Main function setting up elmnt to be movable within the boundaries
 * of the parentNode.
 * NOTE: This is not a generic method but rather specialized to the
 * app in which it is included in. Hence, it knows the layout and
 * ids used in the application.
 *
 * @param {HTMLElement} elmnt - the element to make draggable.
 * @param {HTMLElement} parentNode - the element that the elmnt can move within.
 */
const moveElement = (elmnt, parentNode) => {
  if (!elmnt || !parentNode) throw new Error('Missing the element or the parent element, in dragElement,')
  let posX = 0; let posY = 0; let posXStart = 0; let posYStart = 0
  const parent = parentNode
  const header = elmnt.shadowRoot.querySelector('header') // The dragable area
  const boundary = {
    top: parent.offsetTop,
    bottom: parent.offsetHeight + parent.offsetTop,
    left: parent.offsetLeft,
    right: parent.offsetWidth + parent.offsetLeft
  }

  const obj = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  /**
   *
   * @param direction
   */
  const testMax = (direction) => {
    let counter = 0; let test
    if (direction === 'vertical') {
      do {
        test = testPosition({
          height: elmnt.offsetHeight,
          width: 0,
          offsetTop: parent.offsetTop + 10 * counter,
          offsetWidth: 0
        })
        counter++
      } while (test.ok)
    } else {
      do {
        test = testPosition({
          height: 0,
          width: elmnt.offsetWidth,
          offsetTop: 0,
          offsetLeft: parent.offsetLeft + 10 * (counter + 1)
        })
        counter++
      } while (test.ok && counter < 1000)
    }

    // console.log(`testMax return: ${counter}`)
    return counter
  }

  /**
   *
   * @param data
   */
  const testPosition = (data) => {
    let ok = false; let rightOutside = false; let bottomOutside = false

    const bottom = data.offsetTop + data.height
    const right = data.offsetLeft + data.width

    if (right > boundary.right) rightOutside = true
    if (bottom > boundary.bottom) bottomOutside = true
    if (!(bottomOutside || rightOutside)) ok = true

    return { ok, rightOutside, bottomOutside }
  }

  /**
   *
   * @param direction
   * @param parentOffset
   * @param openWindows
   * @param data
   */
  const getCorrection = (direction, parentOffset, openWindows, data) => {
    let test, result
    const maxX = testMax('horrizontal')
    const maxY = testMax('vertical')
    const maxXcount = Math.floor()

    for (let i = 0; i < openWindows + 1; i++) {
      test = parentOffset + 10 * (openWindows - i)
      if (direction === 'bottom') {
        data.offsetTop = test
      } else {
        data.offsetLeft = test
      }
      result = testPosition(data)
      console.log(`result: ${result}\ntest: ${test}\nopenWindows: ${openWindows}\ni: ${i}`)
      if (result.ok) return parentOffset + 10 * i
    }
  }

  /**
   *
   */
  const initialPosition = () => {
    const numbOpenApps = parent.childNodes.length
    const offsetPixelsTop = 10 * numbOpenApps
    const offsetPixelsLeft = 10 * numbOpenApps

    const height = elmnt.offsetHeight
    const width = elmnt.offsetWidth
    let offsetTop = parent.offsetTop + offsetPixelsTop
    let offsetLeft = parent.offsetLeft + offsetPixelsLeft
    // const position = testPosition({ height, width, offsetTop, offsetLeft })
    const maxX = testMax('horrizontal')
    const maxY = testMax('vertical')
    const maxXcount = Math.floor(numbOpenApps / maxX)
    const maxYcount = Math.floor(numbOpenApps / maxY)
    
    
    offsetTop = parent.offsetTop + 10 * (numbOpenApps - maxYcount * maxY)
    offsetLeft = parent.offsetLeft + 10 * numbOpenApps

    // We will have to re-write the whole initial position functionality since
    // apps are of different size so we cannot depend on number of opened apps.
    // Need to adjust this for Y-axis too it's not perfect yet.
    if (maxXcount > 0) {
      offsetLeft = parent.offsetLeft + 10 * (numbOpenApps - maxXcount * maxX)
      // Reset the Y-axis and start increment numbers based on numbOpenApps from here.
    }
    // console.log(`\n*** initialPosition openApps: ${numbOpenApps}\nmaxX: ${maxX}\nmaxY: ${maxY}\nmaxXcount: ${maxXcount}\nmaxYcount: ${maxYcount}`)
    // console.log(`\n*** \noffsetLeft: ${offsetLeft}\noffsetTop: ${offsetTop}`)

    elmnt.style.top = offsetTop + 'px'
    elmnt.style.left = offsetLeft + 'px'
  }

  // Place the elmnt.
  initialPosition()

  // Adds the dragability to the header portion only.
  header.onmousedown = dragMouseDown

  /**
   * Responds to the mouse down event.
   * Attaches closeDragElement function to the mouseUp event and
   * attaches the elementDrag function to the mouseMove event.
   *
   * @param {Event} ev - event object.
   */
  function dragMouseDown (ev) {
    if (!ev) throw new Error('Missing event object in dragMouseDown.')
    ev.preventDefault()
    // get the mouse cursor position at startup:
    posXStart = ev.clientX
    posYStart = ev.clientY

    // adds eventhandler for mouseUp event
    document.onmouseup = closeDragElement
    // adds an eventhandler to the mouseMove event when the mouse button is down
    document.onmousemove = elementDrag
  }

  /**
   * The function that controlls the movement of the elmnt.
   * It sets the boundaries for its movement based on the parent element.
   *
   * @param {Event} ev - event object.
   */
  function elementDrag (ev) {
    if (!ev) throw new Error('Missing event object in elementDrag.')
    ev.preventDefault()

    // Calculate the new cursor position
    posX = ev.clientX - posXStart // relative movement x-axis
    posY = ev.clientY - posYStart // relative movement y-axis
    posXStart = ev.clientX
    posYStart = ev.clientY

    let top = elmnt.offsetTop + posY
    let left = elmnt.offsetLeft + posX

    // Set the current position of the element's 4 sides.
    obj.top = top
    obj.bottom = top + elmnt.offsetHeight
    obj.left = left + 1
    obj.right = left + elmnt.offsetWidth

    // Set up the boundaries for the element's movement.
    if (obj.top < boundary.top) top = boundary.top
    if (obj.bottom > boundary.bottom) top = boundary.bottom - elmnt.offsetHeight
    if (obj.left < boundary.left) left = boundary.left
    if (obj.right > boundary.right) left = boundary.right - elmnt.offsetWidth

    // Set the element's new position
    elmnt.style.top = top + 'px'
    elmnt.style.left = left + 'px'

    // Set up the boundaries for when to stop tracking movements.
    if (posXStart < boundary.left || posXStart > boundary.right) closeDragElement()
    if (ev.clientY < boundary.top || ev.clientY > boundary.bottom) closeDragElement()
  }

  /**
   * Function tha will stop movements of the element.
   * It resets the eventhandlers for mouseUp and mouseMove events.
   */
  function closeDragElement () {
    /* Stop movments when the mouse button is released */
    document.onmouseup = null // removes handler for mouseUp event
    document.onmousemove = null // removes handler for mouseMove event
  }
}

export { moveElement }
