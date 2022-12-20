/**
 * Class that adds movement functionality to elements.
 *
 * Code adapted from https://www.w3schools.com/howto/howto_js_draggable.asp
 * Ideas from https://web.dev/drag-and-drop/
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

/**
 *
 */
export class moveElement {
  #posX
  #posY
  #posX_start
  #posY_start
  #parent
  #obj
  #element
  /**
   *
   * @param element
   */
  constructor (element) {
    console.log(`moveElement element: ${JSON.stringify(element)}`)
    this.#element = element
    this.#dragElement(element)
    this.#parent = element.parentNode
    this.#posX = 0
    this.#posY = 0
    this.#posX_start = 0
    this.#posY_start = 0
    this.#obj = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
    this.#element.onmousedown = this.#dragMouseDown
  }

  /**
   *
   * @param elmnt
   */
  #dragElement (elmnt) {
    this.#posX = 0
    this.#posY = 0
    this.#posX_start = 0
    this.#posY_start = 0
    this.#obj = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
console.log(`dragElement posX_start: ${this.#posX_start}`)
    // let boundry
    // if (document.getElementById(elmnt.id + "header")) {
    //   /* if present, the header is where you move the DIV from:*/
    //   document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    // } else {
    //   /* otherwise, move the DIV from anywhere inside the DIV:*/
    //   elmnt.onmousedown = dragMouseDown;
    // }
     // Maybe not a good idea, continue testing.
  }

  /**
   *
   * @param e
   */
  #dragMouseDown (e) {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    console.log(`dragMouseDown e.clientX: ${this.#posX_start}`)
    this.#posX_start = e.clientX
    this.#posY_start = e.clientY
    //
    document.onmouseup = this.#closeDragElement
    // call a function whenever the cursor moves and the click button is down:
    document.onmousemove = this.#elementDrag
    // this.#parent.onmouseout = closeDragElement; // Find a better solution
  }

  /**
   *
   * @param e
   */
  #elementDrag (e) {
    e = e || window.event
    e.preventDefault()

    const boundary = {
      top: 0,
      bottom: this.#parent.offsetHeight,
      left: 0,
      right: this.#parent.offsetWidth
    }

    // console.log(`posY_start: ${posY_start}\nclientY: ${e.clientY}\noffsetTop: ${posY_start - e.clientY}\nelement top: ${elmnt.offsetTop - (posY_start - e.clientY)}`)

    // boundry = elmnt.parentNode;
    // console.log(`boundry: \ntop: ${boundry.offsetTop}\nheight: ${boundry.offsetHeight}\nleft: ${boundry.offsetLeft}\nwidth: ${boundry.offsetWidth}`)
    // calculate the new cursor position:
    this.#posX = this.#posX_start - e.clientX
    this.#posY = this.#posY_start - e.clientY
    this.#posX_start = e.clientX
    this.#posY_start = e.clientY

    let top = this.#element.offsetTop - this.#posY
    let left = this.#element.offsetLeft - this.#posX

    this.#obj.top = top
    this.#obj.bottom = top + this.#element.offsetHeight
    this.#obj.left = left
    this.#obj.right = left + this.#element.offsetWidth

    if (this.#obj.top < 0) top = 0
    if (this.#obj.bottom > boundary.bottom) top = boundary.bottom - this.#element.offsetHeight
    if (this.#obj.left < 0) left = 0
    if (this.#obj.right > boundary.right) left = boundary.right - this.#element.offsetWidth
    // set the element's new position:
    this.#element.style.top = top + 'px'
    this.#element.style.left = left + 'px'

    console.log(`clientX: ${e.clientX}\noffsetLeft: ${this.#parent.offsetLeft}\noffsetRight: ${this.#parent.offsetWidth + this.#parent.offsetLeft}`)
    if (e.clientX < this.#parent.offsetLeft || e.clientX > (this.#parent.offsetWidth + this.#parent.offsetLeft)) this.#closeDragElement()
    if (e.clientY < this.#parent.offsetTop || e.clientY > (this.#parent.offsetHeight + this.#parent.offsetTop)) this.#closeDragElement()
  }

  /**
   *
   */
  #closeDragElement () {
    /* stop moving when mouse button is released: */
    document.onmouseup = null
    document.onmousemove = null
  }
}

// Make the DIV element draggable:
