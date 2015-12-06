var http = require('http');

http.createServer(function (request, response) {
  var wait = new Date().getTime() + 5 * 1000
  while (new Date().getTime() <= wait) {
      // waiting
  }
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(3000);
console.log("start");
