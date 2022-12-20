// Code adapted from https://www.w3schools.com/howto/howto_js_draggable.asp
// Ideas from https://web.dev/drag-and-drop/

/**
 *
 * @param elmnt
 */
export const dragElement = (elmnt, parentNode) => {
  let posX = 0; let posY = 0; let posXStart = 0; let posYStart = 0
  const parent = parentNode
  const obj = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  // let boundry
  // if (document.getElementById(elmnt.id + "header")) {
  //   /* if present, the header is where you move the DIV from:*/
  //   document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  // } else {
  //   /* otherwise, move the DIV from anywhere inside the DIV:*/
  //   elmnt.onmousedown = dragMouseDown;
  // }
  elmnt.onmousedown = dragMouseDown // Maybe not a good idea, continue testing.

  /**
   *
   * @param e
   */
  function dragMouseDown (e) {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    posXStart = e.clientX
    posYStart = e.clientY
    //
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves and the click button is down:
    document.onmousemove = elementDrag
    // parent.onmouseout = closeDragElement; // Find a better solution
  }

  /**
   *
   * @param e
   */
  function elementDrag (e) {
    e = e || window.event
    e.preventDefault()

    const boundary = {
      top: parent.offsetTop,
      bottom: parent.offsetHeight + parent.offsetTop,
      left: parent.offsetLeft,
      right: parent.offsetWidth + parent.offsetLeft
    }

    console.log(`parent boundary:\ntop: ${boundary.top}\nbottom: ${boundary.bottom}\nleft: ${boundary.left}\nright: ${boundary.right}\n\n`)

    console.log(`-- cursor pos.\nxStart: ${posXStart}\nyStart: ${posYStart}`)
    // calculate the new cursor position:
    posX = posXStart - e.clientX
    posY = posYStart - e.clientY
    posXStart = e.clientX
    posYStart = e.clientY

    let top = elmnt.offsetTop - posY
    let left = elmnt.offsetLeft - posX

    obj.top = top
    obj.bottom = top + elmnt.offsetHeight
    obj.left = left + 1
    obj.right = left + elmnt.offsetWidth

    console.log(`-- object\ntop: ${obj.top}\nbottom: ${obj.bottom}\nleft: ${obj.left}\nright: ${obj.right}`)

    if (obj.top < boundary.top) top = boundary.top
    if (obj.bottom > boundary.bottom) top = boundary.bottom - elmnt.offsetHeight
    if (obj.left < boundary.left) left = boundary.left
    if (obj.right > boundary.right) left = boundary.right - elmnt.offsetWidth
    // set the element's new position:
    elmnt.style.top = top + 'px'
    elmnt.style.left = left + 'px'

    // console.log(`clientX: ${e.clientX}\noffsetLeft: ${parent.offsetLeft}\noffsetRight: ${parent.offsetWidth + parent.offsetLeft}`)
    if (posXStart < boundary.left || posXStart > (boundary.right)) closeDragElement()
    if (e.clientY < parent.offsetTop || e.clientY > (parent.offsetHeight + parent.offsetTop)) closeDragElement()
  }

  /**
   *
   */
  function closeDragElement () {
    /* stop moving when mouse button is released: */
    document.onmouseup = null
    document.onmousemove = null
  }
}
