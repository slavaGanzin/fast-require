# fast-require
[![Build Status](https://img.shields.io/travis/slavaGanzin/fast-require/master.svg)](https://travis-ci.org/slavaGanzin/fast-require)
[![NPM version](https://img.shields.io/npm/v/fast-require.svg)](https://www.npmjs.org/package/fast-require)


Lazy require all packages from your package.json

Inspired by: https://github.com/viktor-ku/auto-require/

## Options

#### Require only needed packages

```js
const $ = require('fast-require')({
  only: ['gulp', 'gulp-stylus', 'gulp-plumber']
})

// $.gulp, $.stylus, $.plumber
```

#### Filter packages by name

```js
const $ = require('fast-require')({
  without: ['gulp']
})

// $.stylus, $.plumber, but $.gulp is undefined
```

#### Search for package.json in specific folders

```js
const $ = require('fast-require')({
  search: ['src/my-folder/'],
})

// packages from src/my-folder/package.json available as $.[moduleName]
```

#### Import into global namespace

```js
require('fast-require')({
  only: ['gulp', 'gulp-notify'],
  global: true
})

// gulp, gulpNotify or global.gulp, global.gulpNotify
```

#### Rename

```js
 const $ = require('fast-require')({
  only: ['gulp', 'gulp-notify'],
  as: {gulp: 'g', 'gulp-notify': gn}
})

// $.g $.gn
```

#### Import all package functions into root object

```js
const $ = require('fast-require')({
  only: ['request'],
  toRoot: ['request']
})

// $.get, $.post, $.head (all function from request).
//$.request is undefined
```

#### Disable auto installation of missing packages

```js
const $ = require('fast-require')({install: false})
```

#### Require additional packages: globally installed or core modules

```js
const $ = require('fast-require')({require: ['fs']})

//$.fs
```

#### Disable lazy loading

```js
const $ = require('fast-require')({lazy: false})
// All modules loaded at once

const $ = require('fast-require')()

$.gulp //gulp required
$.gulpNotify //gulp-notify required

```

#### Patch module
```js
const $ = fastRequire({patch: {
  chai: x => {
    x.patchedMethod = () => 'patched return'
    return x
  },

  fs: require('thenifyAll')
}})

```
