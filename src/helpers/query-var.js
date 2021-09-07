function getQueryVar (value) {
  value = String(value)
    .split(',')
    .map(item => item.trim())
    .filter(item => item)
  return value
}

module.exports = getQueryVar
