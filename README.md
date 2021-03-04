# Preact with 3p packages using JSX syntax


## Motivation

React packages generally use [Babel](https://babeljs.io/) to transpile react code for browser and assume developers use workflows similar to one used by [Create React App](https://create-react-app.dev/).

This may not work when project uses [Preact](http://preactjs.com/) and build pipeline is based on [Rollup](https://rollupjs.org/) especially when vendor packages use JSX syntax.


For evaluation needs the [resthooks.io](https://resthooks.io/) (rest-hooks v5.0.8 + @rest-hooks/rest v1.0.4) package is used.


## Goals

- Detect issues

- Propose solutions for vendor packages

- Propose workaround for project developers


## Setup

- Build
  ```console
  npm install
  npm start
  ```

- Open <http://localhost:3000>
  
  There should be a message _Hello world_ shown on screen


## Issues


### Errors in console 

- `Uncaught ReferenceError: global is not defined`
- `Uncaught ReferenceError: process is not defined`

**Description**:

When using create-react-app, webpack is configured to replace references to these variables.

**Solution**:

Package authors should not rely on `global` and `process` variable being defined.

**Workaround**:

- replace `process.env.NODE_ENV` with `window` or `globalThis` (see MDN Web Docs: [globalThis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis))
- replace `process.env.NODE_ENV` with `production` or `development`

```js
// rollup.config.js
import rollupPluginReplace from '@rollup/plugin-replace'

const mode = process.env.NODE_ENV || 'development'

export default {
  // ...
  plugins: [
    rollupPluginReplace({
      'global': 'window',
      'process.env.NODE_ENV': JSON.stringify(mode),
      preventAssignment: true,
    }),
  ]
}
```


### Components wrapped in vendor package component don't render

**Description**:

React packages transpiled with Babel that use jsx syntax should use [`@babel/plugin-transform-react-jsx`](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) plugin which transforms it into `React.createElement` or use jsx runtime transform.

Otherwise Babel uses it's jsx built-in runtime helper which transforms jsx into react-specific code 
(see output for rest-hooks: [CacheProvider](./node_modules/@rest-hooks/core/lib/react-integration/provider/CacheProvider.js)) as in example below:

```js
// node_modules/@rest-hooks/core/lib/react-integration/provider/CacheProvider.js
import _jsx from "@babel/runtime/helpers/esm/jsx";

export default function CacheProvider({ children }) {
  // ...
  return /*#__PURE__*/_jsx(
    DispatchContext.Provider,
    { value: dispatch },
    void 0,
    children
  )
}

// node_modules/@babel/runtime/helpers/esm/jsx.js
export default function _createRawReactElement(type, props, key, children) {
  // ...
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key === undefined ? null : '' + key,
    ref: null,
    props: props,
    _owner: null
  };
}
```

This isn't picked up with aliased Preact compatibility layer that expects React methods such as `React.createElement`:

```js
// node_modules/@rest-hooks/core/lib/react-integration/provider/CacheProvider.js
export default function CacheProvider({ children }) {
  // ...
  return /*#__PURE__*/React.createElement(
    DispatchContext.Provider,
    { value: dispatch },
    chilren
  )
}
```

**Solution**:

React packages should be configured to use [`@babel/plugin-transform-react-jsx`](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) plugin

- with _[classic](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#react-classic-runtime)_ runtime the jsx rendering function (`React.createElement`) may be safely aliased by project bundler (see Preact > Getting started > [Aliasing React to Preact](https://preactjs.com/guide/v10/getting-started#aliasing-react-to-preact))

  Babel configuration to transform jsx into `React.createElement`

  ```jsonc
  {
    "plugins": [
      ["@babel/plugin-transform-react-jsx", {
        "runtime": "classic"
      }]
    ]
  }
  ```

- or build two bundles with new babel jsx transform configurations with _[automatic](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#react-automatic-runtime)_ runtime

  - React (see reactjs > [Introducing the New JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html))

    Babel configuration to transform jsx with `react/jsx-runtime`

    ```jsonc
    {
      "plugins": [
        ["@babel/plugin-transform-react-jsx", {
          "runtime": "automatic",
          "importSource": "react"
        }]
      ]
    }
    ```
  
  - Preact >=10.5 (see Preact releases > [10.5.0 - JSX Reloaded](https://github.com/preactjs/preact/releases/tag/10.5.0))

    Babel configuration to transform jsx with `preact/jsx-runtime`

    ```jsonc
    {
      "plugins": [
        ["@babel/plugin-transform-react-jsx", {
          "runtime": "automatic",
          "importSource": "preact"
        }]
      ]
    }
    ```
