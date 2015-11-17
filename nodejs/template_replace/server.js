/**
 * Created by dennis on 11/15/15.
 */
var http = require("http");
var fs = require("fs");

http.createServer(function(req, res) {
    // Load template on root access
    getTitles(res);
}).listen(8000, function() {
    console.log('Server listening on port 8000');
});
function getTitles(res) {
    fs.readFile("./titles.json", function(err, data) {
        if (err) return hadError(err, res);
        // Parse json
        getTemplate(JSON.parse(data.toString()), res);
    });
}
function getTemplate(titles, res) {
    fs.readFile("./template.html", function(err, data) {
        if (err) return hadError(err, res);
        formatHTML(titles, data.toString(), res);
    });

}
// Replace % and end response
function formatHTML(titles, tmpl, res) {
    var html = tmpl.replace("%", titles.join("</li><li>"));
    res.writeHead(200, { "Content-Type": "text/html"});
    res.end(html);
}

function hadError(err, res) {
    console.error(err);
    res.end('Server error');
}