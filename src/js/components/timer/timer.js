/**
 * The timer component of the application.
 * Can produce both a countdown timer and a regular timer.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.1.0
 */

const template = document.createElement('template')
template.innerHTML = `
  <style></style>
  <div class="timer">
    <p><span id="text"></span> <span id="time"></span></p>
  </div>
`

customElements.define('timer-counter',
  /**
   * Anonymous class.
   *
   * Attributes: data {interval, text, increment?, startTime}
   */
  class extends HTMLElement {
    /**
     * Stores a referens to the shadow object.
     *
     * @type {object}
     */
    #thisShadow
    /**
     * Stores the start time in ms from 1970 jan 1 12 (midnight)
     *
     * @type {number}
     */
    #start // The start time to use as referens.
    /**
     * A referens to the interval ID for the instance.
     *
     * @type {number}
     */
    #intervalId
    /**
     * The interval at which the timer should update its visible data.
     *
     * @type {number}
     */
    #updateInterval
    /**
     * Boolean value indicating whether a timer or count down timer is requested.
     *
     * @type {boolean}
     */
    #increment

    /**
     * Constructor function.
     */
    constructor () {
      super()

      this.#start = Date.now()
      this.#thisShadow = this.attachShadow({ mode: 'open' })
      this.#thisShadow.appendChild(template.content.cloneNode(true))
    }

    /**
     * Called when the element is mounted.
     */
    connectedCallback () {
      /** data: {
       * /  text:{string},
       * /  interval:{number (in seconds)},
       * /  increment?,
       * /  startTime: {number (in seconds)}? - the time to count down from.
       * }
       */

      // console.log(`timer - data: ${JSON.stringify(this.data)}\nincrement: ${'increment' in this.data}`)
      this.#increment = 'increment' in this.data
      this.#updateInterval = Number(this.data.interval) * 1000 || 1000 // update interval in ms
      this.#thisShadow.querySelector('#text').textContent = this.data.text || 'Timer:'
      const time = 'startTime' in this.data ? this.data.startTime * 1000 : 0 // time in ms
      try {
        if (this.#increment) this.#elapsedTime()
        else this.#countDown(time)
      } catch (err) {
        console.log(`message: ${err.message}\noptions: ${err.options}`)
      }
    }

    /**
     * Called before element is dismounted.
     */
    disconnectedCallback () {
      // console.log(`timer - disconnectedCallback id: ${this.#intervalId}`)
      clearInterval(this.#intervalId)
    }

    /**
     * Stops the timer and returns the elapsed time since it was sstarted.
     *
     * @returns {number} - the current elapsed time in ms.
     */
    stopTimer () {
      const time = Date.now() - this.#start
      clearInterval(this.#intervalId)
      return time
    }

    /**
     * The update timer updates the visible timer.
     */
    #elapsedTime () {
      this.#intervalId = window.setInterval(() => {
        const time = Date.now() - this.#start

        const minutes = Math.floor(time / 1000 / 60)
        const sec = Math.floor(time / 1000 - minutes * 60)

        this.#thisShadow.querySelector('#time').textContent = `${minutes > 9 ? minutes : '0' + minutes}:${sec > 9 ? sec : '0' + sec}`
      }, this.#updateInterval)
    }

    /**
     * Countdown timer.
     *
     * @param {number} time - the time to count down.
     */
    #countDown (time) {
      this.#intervalId = window.setInterval(() => {
        const elapsedTime = Date.now() - this.#start
        const currTime = time - elapsedTime
        const minutes = Math.floor(currTime / 1000 / 60)
        const sec = Math.floor(currTime / 100 - minutes * 60) / 10
        const tenths = sec - Math.floor(sec)
        let update = ''
        if (currTime > 0) {
          update += minutes > 1 ? `${minutes}:` : ''
          update += sec > 9 ? sec : `0${sec}`
          update += tenths > 0 ? '' : '.0'
        } else {
          this.#timerDone()
        }
        this.#thisShadow.querySelector('#time').textContent = update
      }, this.#updateInterval)
    }

    /**
     * The countdown timer has expired.
     */
    #timerDone () {
      clearInterval(this.#intervalId)
      const done = new CustomEvent('timer-done', { detail: { timerDone: true } })
      this.#thisShadow.querySelector('#text').textContent = ''
      // console.log(`#timerDone(): ${JSON.stringify(done)}`)
      this.dispatchEvent(done)
    }
  }
)

// Sample Code from: https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
/*
#expectedUpdate
#currentSec

var interval = 1000; // ms
var expected = Date.now() + interval;
this.#expectedUpdate = Date.now() + this.#updateInterval

setTimeout(step, interval);
function step() {
    var dt = Date.now() - expected; // the drift (positive for overshooting)
    if (dt > interval) {
        // something really bad happened. Maybe the browser (tab) was inactive?
        // possibly special handling to avoid futile "catch up" run
    }
    … // do what is to be done

    expected += interval;
    setTimeout(step, Math.max(0, interval - dt)); // take into account drift
}
*/

// Code saved for later
/*
#elapsedTime() {
  const timeNow = Date.now()
  const drift = timeNow - this.#expectedUpdate
  const time = timeNow - this.#start

  if (drift > this.#updateInterval) {
    throw new TimerError('Error in timer drift.', { drift, interval: this.#updateInterval, id: this.#intervalId })
  }
  const minutes = Math.floor(time / 1000 / 60)
  const sec = Math.floor(time / 1000 - minutes * 60)

  if (this.#currentSec < sec) {
    this.#thisShadow.querySelector('#time').textContent = `${minutes > 9 ? minutes : '0' + minutes}:${sec > 9 ? sec : '0' + sec}`
    this.#currentSec = sec < 59 ? sec : 0
  }
  this.#expectedUpdate += this.#updateInterval
  this.#intervalId = window.setTimeout(() => { this.#elapsedTime() }, Math.max(0, this.#updateInterval - drift))
}
*/
