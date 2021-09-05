const fs = require('fs')
const path = require('path')

function getVersion () {
  try {
    const packagePath = path.resolve(__dirname, '../../package.json')
    const packageContent = fs.readFileSync(packagePath)
    const packageJson = JSON.parse(packageContent)

    return packageJson.version
  } catch (error) {
    return null
  }
}

module.exports = {
  getVersion
}
