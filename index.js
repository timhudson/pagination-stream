var continueStream = require('continue-stream')
var retryMe = require('retry-me')
var xtend = require('xtend')
var request = require('request')
var util = require('util')

module.exports = function(opts) {
  if (!opts) opts = {}
  if (!opts.urlFormat) throw new Error('opts.urlFormat is required')
  if (!opts.end) throw new Error('opts.end is required')

  var options = xtend({
    start: 1,
  }, opts)

  var retryOptions = [
    'retries',
    'factor',
    'minTimeout',
    'maxTimeout',
    'randomize'
  ].reduce(function(memo, key) {
    if (options[key] !== undefined) memo[key] = options[key]
      return memo
  }, {})

  var currentPage = options.start

  function getStream(callback) {
    var opts = xtend({
      url: util.format(options.urlFormat, currentPage),
    }, options)

    var s = request(opts)
      .on('response', function(res) {
        if (res.statusCode >= 300) {
          return callback(new Error('Received status code ' + res.statusCode))
        }
        callback(null, s)
      })
      .on('error', function(err) {
        callback(err)
      })
  }

  var stream = continueStream(function(callback) {
    if (currentPage > options.end) return callback()

    retryMe(getStream, retryOptions, function(err, s) {
      callback(err, s)
      currentPage++
    })
  })

  return stream
}
