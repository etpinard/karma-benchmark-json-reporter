module.exports = function (config) {
  config.set({
    frameworks: ['benchmark'],
    files: ['bench.js'],
    reporters: ['benchmark', 'benchmark-json'],

    // options for 'karma-benchmark-json-reporter'
    benchmarkJsonReporter: {
      pathToJson: 'results.json',
      formatResults: formatResults,
      formatOutput: formatOutput
    },

    basePath: '.',
    browsers: ['Chrome', 'Firefox'],
    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: true,
    logLevel: config.LOG_INFO
  })
}

function formatResults (results) {
  return results
}

function formatOutput (results) {
  return {
    meta: {
      title: 'example benchmark'
    },
    results: results
  }
}
