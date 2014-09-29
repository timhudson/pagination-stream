# pagination-stream

Combine paginated requests in to a single stream

```
npm install pagination-stream -g
```

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

## CLI

```
Usage: pagination-stream [options]

Options:
-u, --url-format <required>  URL string with pagination placeholder
-e, --end <required>         ending page number
-s, --start                  starting page number, default is 0
-r, --retries                amount of times to retry the operation, default is 10
```

Example:

```
$ pagination-stream -u "https://api.github.com/repos/joyent/node/events?page=%d" -s 1 -e 5 -H 'User-Agent: pug' | jsonfilter "*.actor.login"
```

## License

MIT
