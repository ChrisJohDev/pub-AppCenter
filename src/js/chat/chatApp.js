/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

// import { createPicker, globalConfig } from 'picmo'
import { createPopup } from '@picmo/popup-picker'
import { v4 } from 'uuid'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    *{
      box-sizing: border-box;
      margin: 0;
    }
    
    :host{
      display: flex;
      max-width: 350px;
      height: 100%;
      background-color: rgb(50, 50, 50);
      width: 100%;
      font-size: 14px;
    }
    .wrapper{
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    #chat {
      /* flex: 1 1; */
      border: 1px solid black;
      padding: 10px;
      width: 100%;
      overflow-y: scroll;
      max-height: 250px;
      height: calc(100% - 40px)
    }
    #chat > div + div{
      margin-top: 0.5rem;
    }
    form{
      position: relative;
      width: 100%;
      height:40px;
      left: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.3rem 5%;
      /* padding-right: 5%;
      padding-left: 5%; */
    }
    #message {
      width: 100%;
      padding-right: 2.9rem;
    }
    #arrow, #selection-emoji {
      position: absolute;
      top: 0.3rem;
      height: 1.4rem;
      width: 1rem;
      cursor: pointer;
      /* z-index: 10; */
    }
    #arrow{
      right: calc(5% + 0.3rem);
      background: center / contain no-repeat url("./js/chat/images/send-arrow.png");
    }
    #selection-emoji{
      right: calc(5% + 1.6rem);
      background: center / contain no-repeat url("./js/chat/images/emoji.svg");
    }
    .picker{
      z-index: 10500;
    }
  </style>
  <div class="wrapper">
    <div id="chat"></div>
    <form>
      <input type="text" id="message" placeholder="Enter message" tabindex="1" />
      <i id="arrow" title="Send" tabindex="3"></i><i id="selection-emoji" title="emojis" tabindex="2"></i>
      <!-- <img src="./js/chat/images/send-arrow.png" onclick="submitForm()" style="cursor: pointer;"> -->
    </form>
  </div>
`
const welcomeTemplate = document.createElement('template')
welcomeTemplate.innerHTML = `
  <style>
    *{
      box-sizing: border-box;
      margin: 0;
    }
    
    :host{
      display: flex;
      width: 100%;
      height: 100%;
      flex: 1;
      background-color: rgb(50, 50, 50);
      width: 100%;
      font-size: 14px;
    }
    .wrapper{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }
    input[type="submit"]{
      color: gold;
      background-color: rgb(50, 50, 50);
      border-radius: 0.3rem;
    }
    input[type="submit"]:hover{
      background-color: rgb(30, 30, 30);
    }
    h1{
      width: max-content;
    }
    label{
      display: block;
      text-align: center;
      margin-bottom: 0.5rem;
    }
  </style>
  <div class="wrapper">
    <h1>Welcome to Chatterbox</h1>
    <form>
      <label for="name">Create your Chatterbox username:</label>
      <input type="text" id="name" placeholder="Your user name" />
      <input type="submit" id="createUser" value="Submit" />
    </form>
  </div>
`
const apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
const socketURL = 'wss://courselab.lnu.se/message-app/socket'
const storageName = 'chatterbox-LNU-B3-2023'
const storageChat = 'chatterbox-LNU-B3-2023-messages'
const maxMessages = 20

customElements.define('chat-app',
  /**
   * A class that represents the chat app component.
   *
   * @augments {HTMLElement}
   */
  class extends HTMLElement {
    #socket
    #messageObj
    #heartbeatObj
    #username
    // emojiPicker
    #emojiTriggerElmnt
    #emojiRefElmnt
    #chatId
    /**
     * Class contructor function.
     */
    constructor () {
      super()
      this.#chatId = v4()
      this.attachShadow({ mode: 'open' })
      this.#loadChat()
    }

    /**
     * Called when connected to the DOM.
     */
    connectedCallback () {
      const parent = this.parentElement
      this.style.height = `${parent.clientHeight}px`
      if (this.#username) this.#setUpConnectedCallback()
      else this.#setUpWelcomeCallback()
      const data = JSON.parse(localStorage.getItem(storageChat))
      console.log('[chatApp] connectedCallback data', data)
      const chat = this.shadowRoot.querySelector('#chat')

      for (let i = data.messages.length - 1; i > -1; i--) {
        const div = document.createElement('div')
        console.log('[chatApp] connectedCallback message', data.messages[i])
        div.innerHTML = data.messages[i].innerHTML
        div.setAttribute('style', data.messages[i].style)
        chat.appendChild(div)
      }
    }

    /**
     * Called when disconnected from the DOM.
     */
    disconnectedCallback () {
      const nodes = this.shadowRoot.querySelector('#chat').childNodes
      const messages = []
      for (let i = nodes.length - 1; (i > nodes.length - maxMessages - 1) && i > -1; i--) {
        const style = nodes[i].getAttribute('style')
        messages.push({ style, innerHTML: nodes[i].innerHTML })
      }
      const data = { id: this.#chatId, messages }
      localStorage.setItem(storageChat, JSON.stringify(data))
      this.#socket.close()
    }

    /**
     * Deploys the server notification message on the screen
     * then removes it after 1.5 sec.
     *
     * @param {object} data - contains the text to be dislpayed.
     */
    #deployNotification (data) {
      // console.log('deployNotification:', data)
      const page = this.shadowRoot.querySelector('.wrapper')
      const wrapper = document.createElement('div')
      const div = document.createElement('div')
      const h2 = document.createElement('h2')
      const p = document.createElement('p')
      div.setAttribute('id', 'serverNote')
      h2.textContent = 'Server Notification!'
      p.textContent = data.data
      div.appendChild(h2)
      div.appendChild(p)
      wrapper.setAttribute('style',
        `
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background-color: rgba(150, 150, 150, 0.8);
          position: absolute;
          top: 0;
          left: 0;
          color: black;
        `)
      h2.setAttribute('style', 'text-align: center;margin-bottom: 1rem;')
      p.setAttribute('style', 'text-align: center;')
      wrapper.appendChild(div)
      page.appendChild(wrapper)
      setTimeout(() => {
        page.removeChild(wrapper)
      }, 1500)
    }

    /**
     * Deploys the mesage.
     *
     * @param {string} inData - stringified JSON object data.
     */
    #deployMessage (inData) {
      const data = JSON.parse(inData)
      const chat = this.shadowRoot.querySelector('#chat')
      // We avoid displaying hearbeat and notifications in the chat.
      if (data.type !== 'heartbeat' && data.type !== 'notification') {
        const div = document.createElement('div')
        const p = document.createElement('p')
        const span = document.createElement('span')
        div.setAttribute('style', 'display: flex;')
        p.setAttribute('style', 'padding: 0 0.5rem; max-width: 70%; word-break: break-word; color: white; box-shadow: 0 0 5px 3px rgb(70, 70, 70); border-radius: 0.2rem;')
        p.style.maxWidth = '70%'
        p.style.overflowWrap = 'break-word'
        p.style.wordBreak = 'break-word'
        p.style.color = 'white'

        if (data.chatId === this.#chatId) {
          div.style.justifyContent = 'flex-end'
          span.style.color = 'yellow'
          p.style.textAlign = 'right'
          p.innerHTML = `<span style='color:yellow;'>${data.username}:</span> ${data.data}`
        } else {
          div.style.justifyContent = 'flex-start'
          p.innerHTML = `<span style='color:green;'>${data.username}:</span> ${data.data}`
        }

        div.appendChild(p)
        chat.appendChild(div)
      } else if (data.type === 'notification') {
        this.#deployNotification(data)
      }
      chat.scrollTop = chat.scrollHeight
    }

    /**
     * Loads stored messages from local storage.
     */
    #loadChat () {
      const data = localStorage.getItem(storageName)
      // console.log('data', data)
      this.#username = data && JSON.parse(data).name
      if (this.#username) {
        // console.log('username', this.#username)
        this.shadowRoot.replaceChildren(template.content.cloneNode(true))
        this.#socket = new WebSocket(socketURL)
        this.#messageObj = {
          type: 'message',
          data: '', // The message text is sent using the data property
          username: this.#username,
          channel: '*',
          chatId: this.#chatId,
          key: apiKey
        }

        // Connection opened
        // this.#socket.addEventListener('open', (event) => {
        //   // console.log('WebSocket connection opened.')
        // })

        // Listen for messages
        this.#socket.addEventListener('message', (ev) => {
          this.#deployMessage(ev.data)
        })
      } else {
        this.shadowRoot.appendChild(welcomeTemplate.content.cloneNode(true))
      }
    }

    /**
     * Used to get the user's username, then stores i in localStorage.
     */
    #setUpWelcomeCallback () {
      const form = this.shadowRoot.querySelector('form')
      form.addEventListener('submit', (ev) => {
        ev.preventDefault()
        const name = form.querySelector('#name').value
        localStorage.setItem(storageName, JSON.stringify({ name }))
        this.#loadChat()
        this.#setUpConnectedCallback()
      })
    }

    /**
     * Sends message to the chat server.
     *
     * @param {object} message - username and data.
     * {
     * channel,
     * chatId,
     * data,
     * key,
     * type,
     * username
     * }
     */
    #sendMessage (message) {
      try {
        this.#validate(message)

        // Send message
        if (message) {
          this.#messageObj.data = message
          // console.log('messageObj', this.#messageObj)
          this.#socket.send(JSON.stringify(this.#messageObj))
          this.shadowRoot.querySelector('#message').value = ''
        }
      } catch (err) {
        console.error(err)
      }
    }

    /**
     * Sets up the connected callback when the user has a uernam.
     */
    #setUpConnectedCallback () {
      this.#emojiTriggerElmnt = this.shadowRoot.querySelector('#selection-emoji')
      this.#emojiRefElmnt = this.shadowRoot.querySelector('form')

      const picker = createPopup(
        {},
        {
          referenceElement: this.#emojiRefElmnt,
          triggerElement: this.#emojiTriggerElmnt,
          position: 'right',
          showCloseButton: false,
          className: 'picker'
        })

      // Send message when arrow is clicked
      this.shadowRoot.querySelector('#arrow').addEventListener('click', (ev) => {
        ev.preventDefault()
        const message = this.shadowRoot.querySelector('#message').value
        if (message) this.#sendMessage(message)
      })
      // Send message when enter is pressed
      this.shadowRoot.querySelector('#message').addEventListener('keydown', (ev) => {
        if (ev.code === 'Enter') {
          ev.preventDefault()

          this.#sendMessage(this.shadowRoot.querySelector('#message').value)
        }
      })

      this.#emojiTriggerElmnt.addEventListener('click', () => {
        setTimeout(() => {
          picker.toggle()
          picker.popupEl.style.zIndex = 10500
          // console.log('picker', picker.popupEl.style.zIndex)
        }, 10)
        // picker.toggle()
      })
      picker.addEventListener('emoji:select', (emoji) => {
        // console.log('emoji label:', emoji.label)
        this.shadowRoot.querySelector('#message').value += emoji.emoji
        this.shadowRoot.querySelector('#message').focus()
      })
    }

    /**
     * Simple validation for the user input string.
     *
     * @param {string} message - the message to check.
     */
    #validate (message = '') {
      if (message.startsWith('<script')) throw new Error('Messages can\'t contain script tags.')
    }
  }
)
