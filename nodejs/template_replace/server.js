/**
 * Created by dennis on 11/15/15.
 */
var http = require("http");
var fs = require("fs");

http.createServer(function(req, res) {
    // Load template on root access
    if (req.url == "/") {
        fs.readFile("./titles.json", function(err, data){
            if (err) {
                console.error(err);
                res.end("Server error");
            } else {
                // Parse json
                var titles = JSON.parse(data.toString());
                // Replace template
                fs.readFile("./template.html", function (err, data) {
                    if (err) {
                        console.error(err);
                        res.end("Server error");
                    } else {
                        var tmpl = data.toString();
                        var html = tmpl.replace('%', titles.join('</li><li>'));
                        res.writeHead(200, { "Content-Type": "text/html"});
                        res.end(html);
                    }
                });
            }
        });
    }
}).listen(8000, function() {
    console.log('Server listening on port 8000');
});