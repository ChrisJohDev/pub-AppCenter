# appBay

The app-bay custom element creates a bay to display icons for all games available.

### Usage
```
<app-bay data=${dataArray}></app-bay>
```
### Properties

- `data` (Array): An array of objects that contain information about the games, including the image URL and name.

### Events

- `run-app`: Dispatched when a game icon is clicked. The event detail contains the game object.

### Methods

- `connectedCallback()`: Called when the element is added to the DOM. It sets up the grid layout and creates the game icons.
- `addEventListener('click', (ev) => {...})`: When an icon is clicked, it dispatches a 'run-app' event with the game object as the event detail.