const path = require('path')

module.exports = options => {
  const {only, without, search, globally, as, toRoot, install, verbose} = Object.assign({
    only:     null,
    without:  [],
    search:   [process.cwd()],
    globally: false,
    as:       {},
    toRoot:   [],
    install:  true,
    verbose:  true,
  }, options)

  const start = (new Date()).getTime()

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
      let _path = null

      try {
        _path = require.resolve(package, {paths: [dir]})
      } catch (e) {
        if (install) {
          console.error(String(require('child_process').execSync(
            `npm install ${package}`, {cwd: dir}))
          )
        }
        _path = path.resolve(`${dir}/node_modules/${package}`)
      }

      const module = require(_path)

      if (toRoot.indexOf(package) > -1) {
        for (const f in module)
          packages[f] = module[f]
      } else
        packages[name] = module
    }
  }

  console.error(`All packages loaded: ${(new Date()).getTime() - start}ms`)

  return packages
}
