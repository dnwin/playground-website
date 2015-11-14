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


var data = {};
connection.query('SELECT * from test_table LIMIT 2', function(err, rows, fields) {
    connection.end();
    if (!err) {
        console.log('The solution is: ', data.records = rows);
    }
    else {
    console.log('Error while performing Query.');
    }
});




app.get("/",function(req,res){
        res.sendFile(__dirname + '/public/index.html');
});

app.get("/test", function(req,res) {
    res.sendFile(__dirname + '/public/index.html');
});


app.listen(3000);