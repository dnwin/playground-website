/**
 * Created by dennis on 11/9/15.
 */

var http = require('http');

var server = http.createServer();
// Set on request listener
server.on('request', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello world');
});

server.listen(4000);
console.log('Server running');