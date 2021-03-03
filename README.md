# Preact with 3p packages using JSX syntax


## Motivation

React packages generally use [Babel](https://babeljs.io/) to transpile react code for browser and assume developers use workflows similar to one used by [Create React App](https://create-react-app.dev/).

This may not work when project uses [Preact](http://preactjs.com/) and build pipeline is based on [Rollup](https://rollupjs.org/) especially when vendor packages use JSX syntax.


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
