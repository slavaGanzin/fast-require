#!/usr/bin/env node

require('chai').should()

const R = require('./folder/node_modules/ramda')
const fastRequire = require('./index')
const cp = require('child_process')

const basic = fastRequire()

basic.should.have.property('chai')
global.should.not.have.property('chai')

const withoutChai = fastRequire({without: ['chai']})

withoutChai.should.not.have.property('chai')
withoutChai.should.be.empty
global.should.not.have.property('chai')

const chaiAsNotChai = fastRequire({as: {chai: 'notChai'}})

chaiAsNotChai.should.not.have.property('chai')
chaiAsNotChai.should.have.property('notChai')
global.should.not.have.property('chai')

const search = fastRequire({search: ['.', 'folder']})

search.should.have.property('ramda')
search.should.have.property('lodash')
search.should.have.property('underscore')
search.should.have.property('chai')

global.should.not.have.property('chai')
global.should.not.have.property('lodash')
global.should.not.have.property('underscore')
global.should.not.have.property('ramda')

const onlyFolder = fastRequire({search: ['folder']})

onlyFolder.should.have.property('ramda')
onlyFolder.should.have.property('lodash')
onlyFolder.should.have.property('underscore')
onlyFolder.should.not.have.property('chai')

global.should.not.have.property('chai')
global.should.not.have.property('lodash')
global.should.not.have.property('underscore')
global.should.not.have.property('ramda')

const onlyRamda = fastRequire({search: ['folder'], only: ['ramda']})

onlyRamda.should.have.property('ramda')
onlyRamda.should.not.have.property('lodash')
onlyRamda.should.not.have.property('underscore')
onlyRamda.should.not.have.property('chai')


const ramdaToRoot = fastRequire({toRoot: ['ramda'], search: ['folder']})

ramdaToRoot.should.not.have.property('ramda')
ramdaToRoot.should.have.property('lodash')
ramdaToRoot.should.have.property('underscore')


for (const f in R) {
  ramdaToRoot.should.have.property(f)
  if (['toString'].indexOf(f) == -1)
    global.should.not.have.property(f)
}

const ramdaToGlobal = fastRequire({toRoot: ['ramda'], search: ['folder'], globally: true})

ramdaToGlobal.should.not.have.property('ramda')
global.should.not.have.property('ramda')
ramdaToGlobal.should.have.property('lodash')
global.should.have.property('lodash')
ramdaToGlobal.should.have.property('underscore')
global.should.have.property('underscore')

for (const f in R)
  global.should.have.property(f)


cp.execSync('rm -rf no_node_modules/node_modules; true')
const install = fastRequire({install: true, search: ['no_node_modules']})

install.should.have.property('fastRequire')

const _require = fastRequire({require: ['fs']})

_require.should.have.property('fs')

console.log(require('fs').readFileSync(__filename, 'utf-8'))
