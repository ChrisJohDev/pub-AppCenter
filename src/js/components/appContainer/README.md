# App Container

This class defines a custom HTML element for creating an app container. It extends the `HTMLElement` class and provides functionality for initializing the app container element, setting up event listeners, and cleaning up the element when it is removed from the DOM.

## Properties

- `#appName`: A private property that stores the name of the app.
- `#appNumber`: A private property that stores the number of the app.
- `#appId`: A private property that stores the unique ID of the app container.
- `#initialTop`: A private property that stores the initial top position of the app container.
- `#initialLeft`: A private property that stores the initial left position of the app container.
- `#initialWidth`: A private property that stores the initial width of the app container.
- `#initialHeight`: A private property that stores the initial height of the app container.

## Methods

### `connectedCallback()`

Sets up the app container element when it is added to the DOM. This includes setting the app name, adding event listeners for the close button and fullscreen button, and setting the z-index of the app container.

### `disconnectedCallback()`

Cleans up the app container element when it is removed from the DOM.

### `appId`

Returns the unique ID of the app container.

## Events

### click

For entering fullscreen, exiting fullscreen or closing the container.

### mousedown

On mousedown events it generates and dispatches a custom event 'new-select'