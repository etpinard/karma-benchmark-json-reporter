var path = require('path')

module.exports = function normarlizePath (p, base, dflt) {
  if (typeof p !== 'string' || p === '') {
    return path.join(base, dflt)
  } else {
    if (path.isAbsolute(p)) return p
    else return path.join(base, p)
  }
}
