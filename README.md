# pagination-stream

Combine paginated requests in to a single stream

[![build status](http://img.shields.io/travis/timhudson/pagination-stream.svg?style=flat)](http://travis-ci.org/timhudson/pagination-stream)

## Example

``` js
var paginationStream = require('pagination-stream')
var JSONStream = require('JSONStream')

var options = {
  urlFormat: 'https://api.github.com/repos/joyent/node/events?page=%d',
  headers: {'user-agent': 'pug'},
  start: 0,
  end: 5,
  retries: 2
}

paginationStream(options)
  .pipe(JSONStream.parse('*'))
  .on('data', function(data) {
    console.log(data)
  })
```

## paginationStream(opts={})

pagination-stream passes `opts` on to [request][1] and [retry][2].
See their documentation for all possible options.

- `opts.urlFormat` - **required** url string with pagination placeholder
- `opts.end` - **required** end page
- `opts.start` - start page, defaults to `1`


[1]: https://www.npmjs.org/package/request
[2]: https://www.npmjs.org/package/retry

## License

MIT
