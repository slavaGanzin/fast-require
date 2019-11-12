# fast-require
[![Build Status](https://img.shields.io/travis/slavaGanzin/fast-require/master.svg)](https://travis-ci.org/slavaGanzin/fast-require)
[![NPM version](https://img.shields.io/npm/v/fast-require.svg)](https://www.npmjs.org/package/fast-require)


Automatically require all packages from your package.json

Inspired by: https://github.com/viktor-ku/auto-require/

## Options

#### 1. Get modules you only need

```js
const options = {
  only: ['gulp', 'gulp-stylus', 'gulp-plumber']
}

const $ = require('fast-require')(options)

// $.gulp, $.stylus, $.plumber only avaliable
```

#### 2. Get modules you only need from different places

Note that paths are absolute and begins from the root of your project (it's where the `package.json` is)

```js
const options = {
  search: ['src/my-folder/'],
  only: ['customize']
}

const $ = require('fast-require')(options)

// $.customize only avaliable
```

#### 3. Get all modules without any

```js
const options = {
  without: ['kaktuz', 'zepto']
}

const $ = require('fast-require')(options)

// $.kaktuz and $.zepto are not avaiable at all
```

#### 4. If only and without, then without will be ignored

```js
const options = {
  without: ['gulp', 'zepto']
  only: ['gulp', 'zepto']
}

const $ = require('fast-require')(options)

// $.zepto and $.gulp avaliable only
```

#### 5. Globally

By using it that way you can get all vars as you specified them, but be careful as it's global namespace.

```js
const options = {
  only: ['gulp', 'gulp-notify'],
  globally: true
}

require('fast-require')(options)

// gulp and notify avaliable globaly (only)

//All global imports are guarded and can't be overriden:
gulp = {}
// Error: gulp is already defined
}
```

#### 6. As

You can rename module before import.

```js
const options = {
  only: ['gulp', 'gulp-notify'],
  as: {gulp: 'g', 'gulp-notify': 'gn'}

// You can access gulp and gulp-notify as $.g and $.gn
const $ = require('fast-require')(options)
```

#### 7. toRoot

You can import all functions of module into root object.

```js
const options = {
  only: ['request'],
  toRoot: ['request']
}

// $.get, $.post, $.head (all function from request). But not $.request
const $ = require('fast-require')(options)
```

#### 7. install

Automatically installs missing dependencies

```js
const $ = require('fast-require')({install: true})
```

#### 8. require

Require additional modules, like globally install or core ones

```js
const $ = require('fast-require')({require: ['fs']})
```
