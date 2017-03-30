var tap = require('tap')
var Mock = require('./mock')

tap.test('should normalize *pathToJson*', function (t) {
  function coerce (opts, basePath) {
    var config = Mock.mockConfig(opts, basePath)
    var reporter = Mock.mockReporter(config)

    return reporter.__coercePathToJson(config, opts)
  }

  t.test('with default config', function (t) {
    var out = coerce({}, '.')

    t.same(out, ['results.json'])
    t.end()
  })

  t.test('with different *basePath*', function (t) {
    var out = coerce({}, '../example')

    t.same(out, ['../example/results.json'])
    t.end()
  })

  t.test('with relative *pathToJson*', function (t) {
    var out = coerce({ pathToJson: 'stuff.json' }, '../example')

    t.same(out, ['../example/stuff.json'])
    t.end()
  })

  t.test('with absolute *pathToJson*', function (t) {
    var out = coerce({ pathToJson: '/home/stuff.json' }, '../example')

    t.same(out, ['/home/stuff.json'])
    t.end()
  })

  t.test('with array *pathToJson*', function (t) {
    var out = coerce({
      pathToJson: [
        '/home/stuff.json',
        '',
        'otherstuff.json',
        null
      ]}, '../example')

    t.same(out, [
      '/home/stuff.json',
      '../example/results.json',
      '../example/otherstuff.json',
      '../example/results.json'
    ])
    t.end()
  })
  t.end()
})

tap.test('should report across browsers and suites', function (t) {
  var config = Mock.mockConfig({})
  var reporter = Mock.mockReporter(config)

  // N.B. results are sorted using the hz field
  var specs = [
    ['Chrome', 'one', 'a', 1, { mean: 0.1, sample: [0.1, 0.2, 0.3] }],
    ['Chrome', 'one', 'b', 2, { mean: 0.3, sample: [10, 20, 30] }],
    ['FF', 'one', 'a', 3, { mean: 0.22, sample: [1, 20, 30] }],
    ['FF', 'one', 'b', 4, { mean: 0.99, sample: [10, 2, 3] }],
    ['Chrome', 'two', 'x', 5, { mean: 1, sample: [1, 2, 20] }],
    ['Chrome', 'two', 'y', 6, { mean: 1.1, sample: [1, 5, 3] }],
    ['FF', 'two', 'z', 7, { mean: 0.03, sample: [1, 2, 10] }],
    ['FF', 'two', 'y', 8, { mean: 0.02, sample: [0.1, 2, 1] }]
  ].reverse()

  var hzDeviations = [
    5.84, 0.56, 0.53, 0.57, 0.28, 0.60, 0.05, 5.10
  ]

  specs.forEach(reporter.__bench)
  reporter.onRunComplete()

  t.ok(reporter.__output)
  t.equal(reporter.__output.results.length, specs.length)

  reporter.__output.results.forEach(function (r, i) {
    var s = specs[i]
    var hzDeviation = hzDeviations[i]

    t.equal(r.browser, s[0], 'browser')
    t.equal(r.suite, s[1], 'suite')
    t.equal(r.name, s[2], 'name')
    t.equal(r.hz, s[3], 'hz')
    t.equal(r.mean, s[4].mean, 'mean')
    t.equal(r.sample, s[4].sample, 'sample')

    t.equal(r.fullName, [s[1], s[2], s[0]].join('-'), 'fullName')
    t.ok(Number(r.hzDeviation.toFixed(2)) === hzDeviation, 'hz dev')
  })

  t.end()
})

tap.test('should work with custom results formatter', function (t) {
  var config = Mock.mockConfig({
    formatResults: function (results) {
      return results.map(function (r) {
        return r.mean
      })
    }
  })

  var reporter = Mock.mockReporter(config)

  reporter.__bench(
    ['Chrome', 'one', 'a', 1, { mean: 0.1, sample: [0.1, 0.2, 0.3] }]
  )
  reporter.onRunComplete()

  t.equal(reporter.__output.results[0], 0.1)

  t.end()
})

tap.test('should work with custom output formatter', function (t) {
  var config = Mock.mockConfig({
    formatOutput: function (results) {
      return {
        meta: {
          description: 'my benchmark',
          version: '1.0.1'
        },
        results: results
      }
    }
  })

  var reporter = Mock.mockReporter(config)

  reporter.__bench(
    ['Chrome', 'one', 'a', 1, { mean: 0.1, sample: [0.1, 0.2, 0.3] }]
  )
  reporter.onRunComplete()

  t.equal(reporter.__output.meta.description, 'my benchmark')
  t.equal(reporter.__output.meta.version, '1.0.1')
  t.equal(reporter.__output.results.length, 1)

  t.end()
})
