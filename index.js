const path = require('path')

module.exports = options => {
  const {only, without, search, globally, as, toRoot, install, verbose, lazy} = options = Object.assign({
    only:     null,
    without:  [],
    search:   [process.cwd()],
    globally: false,
    as:       {},
    toRoot:   [],
    install:  true,
    verbose:  true,
    require:  null,
    lazy:     true,
  }, options)

  const start = (new Date()).getTime()

  const packages = globally ? global : {}


  for (let dir of search) {
    dir = path.resolve(dir)
    const packageJSON = require(path.resolve(dir, 'package.json'))

    if (only) {
      for (const i in only) {
        only[only[i]] = only[i]
        delete only[i]
      }
    }

    if (options.require) {
      for (const i in options.require) {
        options.require[options.require[i]] = options.require[i]
        delete options.require[i]
      }
    }
    const deps = only || Object.assign(packageJSON.dependencies || {}, packageJSON.devDependencies || {}, options.require)

    for (const package in deps) {
      if (!only && without.indexOf(package) > -1) continue

      const name = as[package] || package.replace(/(\.|-)([^-])/g, (all, dash, symbol) => symbol.toUpperCase())
      let _path = null


      try {
        _path = require.resolve(package, {paths: [dir]})
      } catch (e) {
        if (install) {
          const cmd = `npm install ${package}`

          console.error(`fast-require: ${cmd}`)
          require.cache = {}
          require('child_process').execSync(cmd, {cwd: dir, stdio: 'inherit'})
          if (options.require)
            require('child_process').execSync(`npm install ${options.require.join(' ')}`, {cwd: dir, stdio: 'inherit'})

          console.log(dir)
          _path = require.resolve(package, {paths: [dir]})
        }
      }


      if (toRoot.indexOf(package) > -1) {
        const start = new Date()
        const module = require(_path)

        for (const f in module)
          packages[f] = module[f]

        if (verbose) console.error(`${name} loaded to root ${new Date() - start}ms`)
      } else if (!lazy)
        packages[name] = require(package)
      else {
        let module

        Object.defineProperty(packages, name, {
          set: () => {
            throw new Error(`${name} in use by ${package} package`)
          },
          get: () => {
            const start = new Date()

            if (!module) module = require(_path)
            if (verbose) console.error(`${name} loaded ${new Date() - start}ms`)
            return module
          }})
      }
    }
  }

  console.error(`All packages loaded: ${(new Date()).getTime() - start}ms`)

  return packages
}
