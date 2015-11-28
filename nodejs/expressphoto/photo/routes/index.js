var express = require('express');
var router = express.Router();
var photos = require('./photos');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// display photos page
//router.get('/', photos.index);



module.exports = router;
