import 'preact/debug'

import { html } from 'htm/preact'
import { render } from 'preact'

/**
 * App component
 */
function App (props) {
  return html`
    <h1>Hello ${props.name}</h1>
  `
}

render(
  html`<${App} name="world" />`,
  document.getElementById('root')
)
