var test = require('tape')
var paginationStream = require('./')
var nock = require('nock')
var concat = require('concat-stream')

test('pagination', function(t) {
  t.plan(2)

  var options = {
    urlFormat: 'http://test.com/?page=%d',
    start: 1,
    end: 5
  }

  var pages = []

  nock('http://test.com')
    .filteringPath(function(path) {
      return path.replace(/\?.+/, '')
    })
    .get('/')
    .times(5)
    .reply(200, function(path) {
      pages.push(path.match(/page=(\d)/)[1])
      return pages[pages.length-1]
    })

  paginationStream(options)
    .pipe(concat(function(data) {
      t.equal(pages.length, 5)
      t.equal(pages.join(''), '12345')
    }))
})

test('retry', function(t) {
  t.plan(1)

  mock(2, 500)
  mock(1, 200, '1')
  mock(1, 200, '2')
  mock(2, 500)
  mock(1, 200, '3')
  mock(1, 200, '4')
  mock(1, 200, '5')

  var options = {
    urlFormat: 'http://test.com/?page=%d',
    start: 1,
    end: 5,
    retries: 2,
    minTimeout: 0, maxTimeout: 0 // Used to speed up tests
  }

  paginationStream(options)
    .pipe(concat(function(data) {
      t.equal(data.toString(), '12345')
    }))

  function mock(times, statusCode, res) {
    return nock('http://test.com')
      .filteringPath(/\?.+/, '')
      .get('/')
      .times(times)
      .reply(statusCode, res)
  }
})
