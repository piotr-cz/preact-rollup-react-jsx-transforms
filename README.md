# Preact with 3p packages using JSX syntax


## Motivation

React packages generally use [Babel](https://babeljs.io/) to transpile react code for browser and assume developers use workflows similar to one used by [Create React App](https://create-react-app.dev/).

This may not work when project uses [Preact](http://preactjs.com/) and build pipeline is based on [Rollup](https://rollupjs.org/) especially when vendor packages use JSX syntax.


For evaluation needs the [resthooks.io](https://resthooks.io/) package is used.


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


## Issues

1.  Errors in console 

    - `Uncaught ReferenceError: global is not defined`
    - `Uncaught ReferenceError: process is not defined`

    **Description**:
    
    When using create-react-app, webpack is configured to replace references to these variables.

    **Solution**

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
