# Components to the Memory App

# Card

The base for a memory card.

## Properties
- `#height` - the height of a card.
- `#width` - the width of a card.
- `pairId` - the id for the pair.
- `#locked` - a flag indicating that the card is locked i.e. cannot be flipped.

## Methods

### connectedCallback()
Set ups the card and attaches a click eventlistener.

### lockCard()
Locks the card so it cannot be flipped.

### unlocCard()
Unlocks the card so it can be flipped.

### hideCard()
Hides that card by setting its visibility to hidden.

### flipCard()
Flips the card.

## Events

- Dispatches a 'card-flip' event when the card is clicked and not locked.

---

# gameBoard

Custom Element for displaying a game board with cards to match pairs.

## Properties
- `#indata` - holds name and game fields.
- `#flipCounter` - counts how many flipps we've had. Max is two then cards needs to be locked.
- `#flippedCards` - counts the number of flipped cards.
- `#numberOfAttempts` - counts one for every two counts of #flipCounter used for scoring.
- `#correctPairedCards` - increased with each maching pair. Used to see if we have mached all cards.
- `#delayTurnBackCards` - delay in ms before unsuccesful attempt turns cards with backside up.
- `#delayHideCards` - delay in ms before paired cards are hidden.

## Methods

### connectedCallback()
Called every time the element is inserted into the DOM.

### findColumns()
Calculates how many columns we should have.

### lockAllCards()
Locks all cards on the game board.

### unlockAllCards()
Unlocks all the cards on the game board.

### flipCards()
Flips back all flipped cards. I.e. puts all cards with face up back with backside up.

### winsGame()
Dispatches the 'game-winner' event indicating that the player has won the game.

### cardFlip()
Flips a card and updates the game state.

### setupBoard()
Sets up the game board.

## Events
- Dispatches the 'game-winner' event when a player has won.


---


# results
The result page where we display the result and the top five scores.

## Properties
- `#thisShadow` - The reference to this shadow DOM.
- `#lastPlayer` - Object that holds the data for the player who just played the game.
- `#storageName` - Text string for the name we use for this game in the local web storage.

## Methods

### connectedCallback()
Called every time the element is inserted into the DOM.

### newGame()
Handles the request to play another game.

### getHighScoreList()
Retrieves the previous scores from localStorage.

### setHighScoreList()
Writes the scores into browser's localStorage.

### sortList()
Sorting function for the supplied array in list.

### findPlayerRank()
Returns the player's placement in the sorted list.

### displayResults()
The main controller.

### makeDisplay()
Controlls the display.

## Events
- Dispatches the 'new-game' event.

---

# welcome

Custom Element for displaying a welcome page with a form to submit user's name and selected game.

## Properties
- `name` - The player's username.

## Methods

### connectedCallback()
Called every time the element is inserted into the DOM.

## Events
- Dispatches the 'play-game; event.
