var WHITESPACE = /s/g

function compileResults (resultSet) {
  var runs = []
  var caseNames = []

  Object.keys(resultSet).forEach(function (browserName) {
    var browserSet = resultSet[browserName]

    Object.keys(browserSet).forEach(function (suiteName) {
      var results = browserSet[suiteName]

      results.forEach(function (result) {
        var benchmark = result.benchmark
        var benchmarkName = benchmark.name
        var benchmarkStats = benchmark.stats

        var caseName = [
          suiteName.replace(WHITESPACE, '-'),
          benchmarkName.replace(WHITESPACE, '-'),
          browserName.replace(WHITESPACE, '-')
        ].join('-')

        if (caseNames.indexOf(caseName) !== -1) {
          console.warn('Same benchmark done twice', caseName)
        }

        caseNames.push(caseName)

        runs.push({
          fullName: caseName,
          browser: browserName,
          suite: suiteName,
          name: benchmarkName,

          // number of times the test was executed
          count: benchmark.count,
          // number of cycles performed while benchmarking
          cycles: benchmark.cycles,
          // number of operations per sec
          hz: benchmark.hz,
          // standard  deviation in hz
          hzDeviation: calcHzDeviation(benchmarkStats),
          // mean in secs
          mean: benchmarkStats.mean,
          // standard deviation in secs
          deviation: benchmarkStats.deviation,
          // variance in secs^2
          variance: benchmarkStats.variance,
          // margin of error
          moe: benchmarkStats.moe,
          // relative margin of error (in percentage of the mean)
          rme: benchmarkStats.rme,
          // standard error of the mean
          sem: benchmarkStats.sem,
          // list of sample points
          sample: benchmarkStats.sample
        })
      })
    })
  })

  // sort from fastest to slowest
  runs.sort(function (a, b) {
    return b.hz - a.hz
  })

  return runs
}

function calcHzDeviation (stats) {
  var sample = stats.sample
  var N = sample.length

  var sum = 0
  for (var i = 0; i < N; i++) {
    sum += 1 / sample[i]
  }

  var mean = sum / (N - 1)

  var ssq = 0
  for (var j = 0; j < N; j++) {
    ssq += Math.pow((1 / sample[j]) - mean, 2)
  }

  return Math.sqrt(ssq / (N - 1))
}

module.exports = compileResults
