module.exports = function (config) {
  config.set({
    frameworks: ['benchmark'],
    files: ['bench.js'],
    reporters: ['benchmark', 'benchmark-json'],

    // options for 'karma-benchmark-json-reporter'
    benchmarkJsonReporter: {
      pathToJson: ['results-iteration.json', 'results-fill.json'],
      formatResults: formatResults,
      formatOutput: formatOutput
    },

    basePath: '.',
    browsers: ['Firefox'],
    port: 9877,
    colors: true,
    autoWatch: false,
    singleRun: true,
    logLevel: config.LOG_INFO
  })
}

function formatResults (results) {
  return {
    iteration: results.filter(function (r) { return r.suite === 'Array iteration' }),
    fill: results.filter(function (r) { return r.suite === 'Array fill' })
  }
}

function formatOutput (results) {
  var meta = {
    title: 'example benchmark'
  }

  return [{
    meta: meta,
    results: results.iteration
  }, {
    meta: meta,
    results: results.fill
  }]
}
