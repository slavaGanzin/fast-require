const path = require('path')

module.exports = options => {
  const {only, without, search, as, toRoot, install, verbose, lazy, patch} = options = Object.assign({
    only:     null,
    without:  [],
    search:   [process.cwd()], //__dirname
    global:  false,
    as:       {},
    toRoot:   [],
    install:  true,
    verbose:  false,
    require:  null,
    lazy:     true,
    patch:   {},
  }, options)

  let initialization = new Date().getTime()

  const packages = options.global ? global : {}
  const V = verbose ? console.error : () => {}


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
      if (without.indexOf(package) > -1 || package == 'fast-require') continue

      const name = as[package] || package.replace(/(\.|-)([^-])/g, (all, dash, symbol) => symbol.toUpperCase())
      let _path = null


      try {
        _path = require.resolve(package, {paths: [dir]})
      } catch (e) {
        if (install) {
          const cmd = `npm install ${package}`

          V(`fast-require:\t${cmd}`)
          require.cache = {}
          require('child_process').execSync(cmd, {cwd: dir, stdio: 'inherit'})
          if (options.require)
            require('child_process').execSync(`npm install ${options.require.join(' ')}`, {cwd: dir, stdio: 'inherit'})

          _path = require.resolve(package, {paths: [dir]})
        }
      }


      const p = patch[name] ? patch[name] : x => x

      if (toRoot.indexOf(package) > -1) {
        const start = new Date()
        const module = p(require(_path))

        for (const f in module) {
          Object.defineProperty(packages, f, {
            set: () => {
              throw new Error(`fast-require:\tDo not override ${f}! Reserved by ${package} package`)
            },
            get: () => module[f],
          })
        }

        const toRootTime = new Date() - start

        initialization += toRootTime
        V(`fast-require:\t${toRootTime}ms\t${name}`)
      } else if (!lazy)
        packages[name] = p(require(package))
      else {
        let module

        if (packages[name]) {
          try {
            packages[name] = 'test'
          } catch (e) {
            if (new RegExp(`fast-require.*${package}`).test(e)) return
          }

          throw new Error(`fast-require:\tTrying to override ${package} which was already defined`)
        }

        Object.defineProperty(packages, name, {
          set: () => {
            throw new Error(`fast-require:\tDo not override ${name}! Reserved by ${package} package`)
          },
          get: () => {
            if (!module) {
              const start = new Date()

              module = p(require(_path))
              V(`fast-require:\t${new Date() - start}ms\t${name}`)
            }

            return module
          }})
      }
    }
  }

  V(`fast-require: \t${new Date().getTime() - initialization}ms\tinit`)

  return packages
}
