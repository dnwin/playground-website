/**
 * Created by dennis on 11/17/15.
 */
var fs = require('fs');
var request = require('request'); // Simplified html client to fetch RSS data.
var htmlparser = require('htmlparser'); // Turns RSS data to JS objects

var configFileName = './rss_feeds.txt';

// (1) Make sure file containing RSS feed urls exists.
function checkForRSSFile() {
    fs.exists(configFileName, function(exists) {
        if (!exists) {
            return next(new Error('Missing RSS file'))
        }
        next(null, configFileName);
    });
}

// (2) Read the file
function readRSSFile(configFileName) {
    fs.readFile(configFileName, function(err, feedList) {
        if (err) return next(err);
        // Convert to strings, replace whitespace, then convert arrays
        feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split('\n');
        // Get a random url
        var random = Math.floor((Math.random() * feedList.length));
        next(null, feedList[random]);
    })
}
// (3) Do http request with url and get data for selected feed.
function downloadRSSFeed (feedUrl) {
    request({url: feedUrl}, function(err, res, body) {
        if (err) return next(err);
        if (res.statusCode != 200) {
            return next(new Error('Abnormal response status code'));
        }
        next(null, body);
    });
}
// (4) Parse the rss feed into an array of items
function parseRSSFeed(rss) {
    // Config htmlparser
    var handler = new htmlparser.RssHandler();
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rss);
    if (!handler.dom.items.length) {
        return next(new Error('No RSS Items found'));
    }

    //
    //var item = handler.dom.items.shift();
    //console.log(item.title);
    //console.log(item.link);

    var items = handler.dom.items;
    items.forEach(function(item) {

        console.log(item.title);
        console.log(item.link);
    });
}



// This function will execute each task in tasks one at a time everytime it is called.
// Functions in tasks will call next to execute the next item in tasks.
var tasks = [checkForRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed];
function next(error, result) {
    if (error) throw error;
    // Get next task
    var currentTask = tasks.shift();
    currentTask(result);
}
// Execute first task.
next();