/**
 * Created by dennis on 11/27/15.
 */
var http = require('http');

// Num of pages views since last restart
var counter = 0;

var server = http.createServer(function(req, res) {
   counter++;
    res.write("i have been accessed" + counter + "times");
    res.end();




}).listen(8000);