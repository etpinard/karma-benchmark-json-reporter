module.exports = function (config) {
  config.set({
    frameworks: ['benchmark'],
    files: ['bench.js'],
    reporters: ['benchmark', 'benchmark-json'],

    // options for 'karma-benchmark-json-reporter'
    // use defaults here
    // benchmarkJsonReporter: {},

    basePath: '.',
    browsers: ['Chrome', 'Firefox'],
    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: true,
    logLevel: config.LOG_INFO
  })
}
