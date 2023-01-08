# &lt;timer-counter&gt;

A web component that provides timer functionalities. Both measuring and displaying elapsed and remaining time time.

## Attributes

### `interval`

Numeric value specifying the the interval with which the visible data will be updated in seconds.

Default value: 1,000 ms.

### `text`

The text to display. In the examples below "Elapsed time:" and "Remaining time:"

Default value: Timer:.

### `increment`

If present it will create a timer and if not it will be a countdown timer.

Default value: none.

### `startTime`

If increment not present then we need a startTime that the counter counts down from.

Default value: 0.

## Example Elapsed Time

```html
<footer-component>
  <div class="timer">
    <p><span id="text"></span> <span id="time"></span></p>
  </div>
</footer-component>
```

![Example](./images/counter-timer.jpg)

![Example](./images/countdown-timer.jpg)