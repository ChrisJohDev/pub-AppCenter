/**
 * The main script file of the application.
 *
 * @author Chris Johannesson <chris@chrisjohannesson.com>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
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
  }
</style>
<div class="wrapper">
</div>
`
