var execSync = require('child_process').execSync
var pkg = require('./package.json')

module.exports = function (config) {
  config.set({
    frameworks: ['benchmark'],
    files: ['bench.js'],
    reporters: ['benchmark', 'benchmark-json'],

    // options for 'karma-benchmark-json-reporter'
    benchmarkJsonReporter: {
      pathToJson: 'benchmarks.json',
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

// only keep full name and hz statistics
function formatResults (results) {
  return results.map(function (r) {
    return {
      fullName: r.fullName,
      hz: r.hz,
      hzDeviation: r.hzDeviation
    }
  })
}

// add date, commit package version info to output JSON
function formatOutput (results) {
  var date = new Date()
  var commit

  try {
    commit = execSync('git rev-parse HEAD').toString().replace('\n', '')
  } catch (e) {
    commit = 'commit hash not found'
  }

  return {
    meta: {
      title: 'example benchmark',
      version: pkg.version,
      commit: commit,
      date: [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        date.toString().match(/\(([A-Za-z\s].*)\)/)[1]
      ].join(' ')
    },
    results: results
  }
}
