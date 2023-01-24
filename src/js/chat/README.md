# Chat App

This is a simple chat app that utilizes `template` and `customElements.define` to create a chat interface.

## Usage

This code can be used to create a chat interface.

## Features

- The chat interface has a form for entering messages
- The chat interface has an emoji picker

## Requirements

- A web browser that supports `template` and `customElements.define`

## Events
- message - activated when we recieve a message on the websocket connection
- click - Send message when arrow is clicked, or displays emojies
- emoji:select - fires when an emojie is selected
- keydown - Send message when enter is pressed
- submit - activated when the user submits its username