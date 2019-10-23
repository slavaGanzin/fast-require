const path = require('path')

module.exports = options => {
  const {only, without, search, globally, as, toRoot} = Object.assign({
    only:     null,
    without:  [],
    search:   [process.cwd()],
    globally: false,
    as:       {},
    toRoot:   [],
  }, options)

  const packages = globally ? global : {}

  for (const dir of search) {
    const packageJSON = require(path.resolve(dir, 'package.json'))

    if (only) {
      for (const i in only) {
        only[only[i]] = only[i]
        delete only[i]
      }
    }

    for (const package in only || Object.assign(packageJSON.dependencies || {}, packageJSON.devDependencies || {})) {
      if (!only && without.indexOf(package) > -1) continue

      const name = as[package] || package.replace(/(\.|-)([^-])/g, (all, dash, symbol) => symbol.toUpperCase())
      const module = require(require.resolve(package, {paths: [dir]}))

      if (toRoot.indexOf(package) > -1) {
        for (const f in module)
          packages[f] = module[f]
      } else
        packages[name] = module
    }
  }

  return packages
}
