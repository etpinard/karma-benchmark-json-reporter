var BenchReporter = require('../')['reporter:benchmark-json'][1]
var NOOP = function () {}

exports.mockReporter = function (config) {
  var reporter = new BenchReporter(NOOP, config)

  // mock writeToJson method to assert output
  // w/o having to write/read file
  reporter._writeToJson = function (output) {
    reporter.__output = output
  }

  // shortcut to call 'specSuccess' to fill in results
  reporter.__bench = function (_) {
    var browserArg = exports.mockBrowserArg(_[0])
    var resultArg = exports.mockResultArg(_[1], _[2], _[3], _[4])

    reporter.specSuccess(browserArg, resultArg)
  }

  return reporter
}

exports.mockConfig = function (opts, basePath) {
  return {
    basePath: basePath || '.',
    benchmarkJsonReporter: opts || {}
  }
}

exports.mockBrowserArg = function (browserName) {
  return {
    name: browserName
  }
}

// N.B. results are sorted using the hz field
exports.mockResultArg = function (suiteName, benchmarkName, hz, stats) {
  return {
    benchmark: {
      suite: suiteName,
      name: benchmarkName,
      hz: hz,
      stats: stats
    }
  }
}
