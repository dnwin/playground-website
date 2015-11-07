var http = require("http");

http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World\n");
    response.write("Testing this server.\n");
    response.write("Finally getting something to work.");
    response.end();
}).listen(80);
