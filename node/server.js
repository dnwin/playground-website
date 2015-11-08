var express    = require("express");
var mysql      = require('mysql');
var path       = require('path');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'testing'
});
var app = express();

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});

// Configure public directory
app.use("/", express.static(__dirname + '/public'));

app.get("/",function(req,res){
    connection.query('SELECT * from test_table LIMIT 2', function(err, rows, fields) {
        connection.end();
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query.');

        //response.writeHead(200, {"Content-Type": "text/plain"});
        //
        //response.write("Hello World\n" + rows[0].name);
        //response.end();
        //
        //
    });
});

app.get("/test", function(req,res) {
    res.sendFile(__dirname + '/index.html');
});


app.listen(80);