# karma-benchmark-json-reporter

[![npm version][badge-version]][npm]

[![Build Status][badge-travis]][travis]
[![Coverage Status][badge-coveralls]][coveralls]

[![Dependency Status][badge-deps]][deps]
[![devDependency Status][badge-dev-deps]][dev-deps]
[![Greenkeeper badge][badge-greenkeeper]][greenkeeper]

A reporter for [karma-benchmark][karma-benchmark] outputting results to a JSON
file.

## Install

```bash
npm install karma-benchmark-json-reporter
```

## Setting up

After installing `karma`, [karma-benchmark][karma-benchmark] and your favorite
launcher, in your `karma.conf.js`:

```js
module.exports = function (config) {
  config.set({
    frameworks: ['benchmark'],
    reporters: ['benchmark-json'],

    // other karma options

    // options for 'karma-benchmark-json-reporter'
    benchmarkJsonReporter: {
      pathToJson: 'my-benchmark-results.json'
    }
  })
}
```

See complete examples in [example][example].

## API

The `benchmarkJsonReporter` option container has three settings

### `pathToJson`

String or array of strings corresponding to the path(s) from karma `basePath`
of the output JSON files.

Default: `results.json` from the karma `basePath`.

By setting `pathToJson` to an array of paths and customizing `formatOutput`, one
can generate multiple output files. See [example][example-02].

### `formatResults`

Function that takes in the compiled results array and is expected to return an
object that is passed to `formatOutput`.

Default: the identity function.

Each compiled results item has the following keys:

- `fullName`: full (and unique) run name concatenating `browser`, `suite` and
`name` velues
- `browser`: nbame of browser used
- `suite`: name of suite (as set in `suite('<>', function () {}`)
- `name`: name of benchmark (as set in `benchmark('<>', function () {}`)
- `count`: number of times the test was executed
- `cycles`: number of cycles performed while benchmarking
- `hz`: number of operations per sec
- `hzDeviation`: standard  deviation in hz
- `mean`: mean in secs benchmarkStats.mean,
- `deviation`: standard deviation in secs
- `variance`: variance in secs^2
- `moe`: margin of error
- `rme`: relative margin of error (in percentage of the mean)
- `sem`: standard error of the mean
- `sample`: list of sample points

Note that the compiled results are sorted from fastest to slowest `hz` values.

### `formatOutput`

Function that takes the output of `formatResults` and is expected to return a
JSON-serializable object that will be written in the output file(s).

Defaults: `function (results) { return { results: results } }`.

If `formatOutput` returns an array, then items in the array will written in
separate JSON files in the same order as the given `pathToJson` array setting.

Otherwise, the `formatOutput` return value gets JSON stringified into a single JSON file.

## Credits

2017 Étienne Tétreault-Pinard. MIT License

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[npm]: https://www.npmjs.com/package/karma-benchmark-json-reporter
[badge-version]: https://badge.fury.io/js/karma-benchmark-json-reporter.svg
[travis]: https://travis-ci.org/etpinard/karma-benchmark-json-reporter
[badge-travis]: https://travis-ci.org/etpinard/karma-benchmark-json-reporter.svg?branch=master
[coveralls]: https://coveralls.io/github/etpinard/karma-benchmark-json-reporter?branch=master
[badge-coveralls]: https://coveralls.io/repos/github/etpinard/karma-benchmark-json-reporter/badge.svg?branch=master
[badge-deps]: https://david-dm.org/etpinard/karma-benchmark-json-reporter.svg?style=flat-square
[deps]: https://david-dm.org/etpinard/karma-benchmark-json-reporter
[badge-dev-deps]: https://david-dm.org/etpinard/karma-benchmark-json-reporter/dev-status.svg?style=flat-square
[dev-deps]: https://david-dm.org/etpinard/karma-benchmark-json-reporter#info=devDependencies
[greenkeeper]: https://greenkeeper.io/
[badge-greenkeeper]: https://badges.greenkeeper.io/etpinard/karma-benchmark-json-reporter.svg
[karma-benchmark]: https://github.com/JamieMason/karma-benchmark
[example]: https://github.com/etpinard/karma-benchmark-json-reporter/tree/master/example
[example-02]: https://github.com/etpinard/karma-benchmark-json-reporter/blob/master/example/02-multiple-output-files/karma.conf.js
