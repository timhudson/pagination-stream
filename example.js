var paginationStream = require('./')
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
