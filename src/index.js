import 'preact/debug'

import { html } from 'htm/preact'
import { render } from 'preact'

import { CacheProvider } from 'rest-hooks'

/**
 * App component
 */
function App (props) {
  return html`
    <h1>Hello ${props.name}</h1>
  `
}

render(
  html`
    <${CacheProvider}>
      <${App} name="world" />
    </${CacheProvider}>
  `,
  document.getElementById('root')
)
