/**
 * Created by Dennis on 11/11/2015.
 */
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');



var cache = {};

// Create http server
var server = http.createServer(function(req, res) {
    var filePath = false;
    // Determine html file to be served by default
   if (req.url == '/') {
       filePath =  'public/index.html';
   } else {
       filePath = 'public' + req.url;
   }

    // translate URL path to relative file path
    var absPath = './' + filePath;


    // Serve a file from cache
   serveStatic(res, cache, absPath);



    //// Don't use cache and reload everytime
    //fs.readFile(absPath, function(e, data) {
    //    if (e) {
    //        send404(res);
    //    } else {
    //        sendFile(res, absPath, data);
    //    }
    //});

});

server.listen(4000, function() {
    console.log("Server listening on port 4000.");
});


// Chat server
var chatServer = require('./lib/chat_server.js');
chatServer.listen(server);









function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(200,
        {'content-type':mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    // Check if file is cached in memory
    if (cache[absPath]) {
        // serve file from memory
        sendFile(response, absPath, cache[absPath]);
    } else {
        // Check if file exists
        fs.exists(absPath, function(exists) {
            if (exists) {
                // Read file from disk
                fs.readFile(absPath, function(err, data) {
                  if (err) {
                      send404(response)
                  } else {
                      cache[absPath] = data;
                      sendFile(response, absPath, data);
                  }
                })
            } else {
                send404(response);
            }
        });
    }
}