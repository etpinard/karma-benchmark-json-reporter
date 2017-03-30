module.exports = function (resultSet, browser, result) {
  var browserName = browser.name
  var suite = result.benchmark.suite

  var browserSet = resultSet[browserName] = resultSet[browserName] || {}
  browserSet[suite] = browserSet[suite] || []
  browserSet[suite].push(result)
}
