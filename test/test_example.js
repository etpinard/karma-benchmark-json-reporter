var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec
var tap = require('tap')

var PATH_TO_EXAMPLE = path.join(__dirname, '..', 'example')

function run (dirName, cb) {
  var cmd = 'npm run clean && npm start -- --browsers Firefox'
  var cwd = path.join(PATH_TO_EXAMPLE, dirName)

  exec('npm install', { cwd: cwd }, function (err) {
    if (err) throw err

    setTimeout(function () {
      exec(cmd, { cwd: cwd }, function (err) {
        if (err) throw err

        cb(cwd)
      })
      .stdout.pipe(process.stdout)
    }, 5000)
  })
  .stdout.pipe(process.stdout)
}

function read (cwd, fileName) {
  var pathToFile = path.join(cwd, fileName)
  return JSON.parse(fs.readFileSync(pathToFile, 'utf-8'))
}

tap.test('should return correct JSON - simple case', function (t) {
  run('01-simple', function (cwd) {
    var res = read(cwd, 'results.json')

    t.equal(res.results.length, 2)
    t.end()
  })
})

tap.test('should return correct JSON - multiple output files case', function (t) {
  run('02-multiple-output-files', function (cwd) {
    var resIteration = read(cwd, 'results-iteration.json')
    t.equal(resIteration.results.length, 2)
    t.type(resIteration.meta.title, 'string')

    var resFill = read(cwd, 'results-fill.json')
    t.equal(resFill.results.length, 2)
    t.type(resFill.meta.title, 'string')
    t.end()
  })
})

tap.test('should return correct JSON - custom output info case', function (t) {
  run('03-output-info', function (cwd) {
    var res = read(cwd, 'benchmarks.json')

    t.equal(res.results.length, 2)
    t.type(res.meta.title, 'string')
    t.type(res.meta.commit, 'string')
    t.type(res.meta.version, 'string')
    t.type(res.meta.date, 'string')
    t.end()
  })
})
