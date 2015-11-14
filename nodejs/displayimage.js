/**
 * Created by dennis on 11/9/15.
 */
var http = require('http');
var fs = require('fs');

var server = http.createServer();

server.on('request', function(req, res) {
    res.writeHead(200, {'Content-Type':'image/jpg'});

    var fstream = fs.createReadStream('./img/dog.jpg');
    fstream.on('data', function(chunk) {
        console.log(chunk);
    });
    fstream.pipe(res)
});

server.listen(3000);
console.log("server on");
