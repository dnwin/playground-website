/**
 * Created by Dennis on 11/22/2015.
 */
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// Required for POST request bodies (Updates)
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Test datan
var articles = [
  {title: 'Example1'},
  {title: 'Example2'}
];

// Routes
// RESTFul API

// GET /articles - Get all articles
app.get('/articles', function(req, res, next) {
  res.send(articles);
});

// GET /articles/:id - Get a single article
app.get('/articles/:id', function(req, res, next) {
  var id = req.params.id;
  console.log("Fetching:", id);
  res.send(articles[id]);

});

// POST /articles - Create an article
app.post('/articles', urlencodedParser, function (req, res, next) {
  console.log(req.body.title);

  var article = { title: req.body.title };
  articles.push(article);
  res.send(article);
});

// DELETE /articles/:id - Delete an article
app.delete('/articles/:id', function(req, res, next) {
  var id = req.params.id;
  console.log('Deleting:' + id);
  delete articles[id];
  res.send({message: 'Deleted'});
});


app.listen(process.env.PORT || 3000);

module.exports = app;