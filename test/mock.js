var BenchReporter = require('../')['reporter:benchmark-json'][1]
var normalizePath = require('../lib/normalize_path')
var NOOP = function () {}

exports.mockReporter = function (config) {
  var reporter = new BenchReporter(NOOP, config)

  // mock writeToJson method to assert output
  // w/o having to write/read file
  reporter._writeToJson = function (output) {
    reporter.__output = output
  }

  // copied from index for a more 'real-life' test
  // of normalizePath
  reporter.__coercePathToJson = function (config, opts) {
    var array = Array.isArray(opts.pathToJson)
      ? opts.pathToJson
      : [opts.pathToJson]

    return array.map(function (p) {
      return normalizePath(p, config.basePath, 'results.json')
    })
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
