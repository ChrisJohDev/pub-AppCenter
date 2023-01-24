# Memory App

This class provides a memory app/game. Stores high scores and presents the top 5 at the end of the game.
Three possible games 4 cards, 8 cards of 16 cards.

## Properties

- `#shadow`: The shadow root of the component.
- `#welcomePage`: The welcome page element.
- `#timer`: The timer element used to track elapsed time.
- `#timeScore`: The final time score of the game.
- `nameStorage`: The name used in localStorage to store the player's name.

## Methods

### `connectedCallback()`

Sets up the app container element when it is added to the DOM. 

### `disconnectedCalbback()`

Cleans up the app and stops the timer when the element is removed from the DOM.

### `getName()` 

Get the user's name from localStorage.

### `setName()`

Writes the user's name to localStorage.

### `loadWelcome()`

Loads the welcome page.

### `loadGame()`

Loads the game baord.

### `loadResultPage()`

Loads the result page and displays the results.