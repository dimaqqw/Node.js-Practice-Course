const path = require('path')

const args = process.argv.slice(2)

if (args.length === 0) {
  console.log('Please provide path parts as arguments.')
  process.exit(1)
}

const joinedPath = path.join(...args)

const normalizedPath = path.normalize(joinedPath)

console.log(`Normalized Path: ${normalizedPath}`)

// node app.js /some/directory/ part/of/path filename.ext
