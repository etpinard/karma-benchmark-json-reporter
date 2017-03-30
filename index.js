var fs = require('fs')

var fillResultSet = require('./lib/fill_result_set')
var compileResults = require('./lib/compile_results')
var normarlizePath = require('./lib/normalize_path')

var BenchReporter = function (baseReporterDecorator, config) {
  baseReporterDecorator(this)

  this._key = 'benchmarkJsonReporter'

  var opts = config[this._key] || {}
  var pathToJson = coercePathToJson(config, opts)

  var formatResults = isFunction(opts.formatResults)
    ? opts.formatResults
    : function (results) { return results }

  var formatOutput = isFunction(opts.formatOutput)
    ? opts.formatOutput
    : function (results) { return { results: results } }

  var resultSet = {}

  this.specSuccess = function (browser, result) {
    fillResultSet(resultSet, browser, result)
  }

  this.onRunComplete = function () {
    var results = compileResults(resultSet)
    var output = formatOutput(formatResults(results))

    this._writeToJson(output)
  }

  this._writeToJson = function (output) {
    coerceToArray(output).forEach(function (o, i) {
      var p = pathToJson[i]
      var str = JSON.stringify(o, null, 2) + '\n'

      fs.writeFile(p, str, function (err) {
        if (err) throw err
      })
    })
  }
}

function coercePathToJson (config, opts) {
  return coerceToArray(opts.pathToJson).map(function (p) {
    return normarlizePath(p, config.basePath, 'results.json')
  })
}

function coerceToArray (input) {
  return Array.isArray(input) ? input : [input]
}

function isFunction (obj) {
  return typeof obj === 'function'
}

BenchReporter.$inject = ['baseReporterDecorator', 'config']

module.exports = {
  'reporter:benchmark-json': ['type', BenchReporter]
}
