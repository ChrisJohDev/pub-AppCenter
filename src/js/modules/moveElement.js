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
export const dragElement = (elmnt, parentNode) => {
  if (!elmnt || !parentNode) throw new Error('Missing the element or the parent element, in dragElement,')
  let posX = 0; let posY = 0; let posXStart = 0; let posYStart = 0
  const parent = parentNode
  const obj = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  elmnt.onmousedown = dragMouseDown

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

    const boundary = {
      top: parent.offsetTop,
      bottom: parent.offsetHeight + parent.offsetTop,
      left: parent.offsetLeft,
      right: parent.offsetWidth + parent.offsetLeft
    }

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
