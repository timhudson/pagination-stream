#!/usr/bin/env node

var paginationStream = require('./')
var pick = require('lodash.pick')
var args = require('minimist')(process.argv.slice(2), {
  alias: {
    'url-format': 'u',
    'start': 's',
    'end': 'e',
    'retries': 'r',
    'H': ['header', 'headers']
  }
})

var usage = 'Usage: pagination-stream [options]\n' +
'\nOptions:' +
'\n-u, --url-format <required>  URL string with pagination placeholder' +
'\n-e, --end <required>         ending page number' +
'\n-s, --start                  starting page number, default is 0' +
'\n-r, --retries                amount of times to retry the operation, default is 10'
'\n-H, --header                 custom header to pass with request'

if (!args['url-format'] || !args.end)
  return console.error(usage)

var opts = pick(args, 'start', 'end', 'retries')
opts['urlFormat'] = args['url-format']

opts.headers = Array.isArray(args.headers) ? args.headers : [args.headers]
opts.headers = opts.headers.reduce(function(memo, header) {
  if (!header) return
  var pair = header.split(':')
  memo[pair[0]] = pair[1]
  return memo
}, {})

paginationStream(opts)
  .on('error', function(err) {
    console.error(err.stack)
  })
  .pipe(process.stdout)
