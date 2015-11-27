/**
 * Created by dennis on 11/27/15.
 */

var connect = require('connect');
var router = require('.middleware/router');
var path = url.parse(req.url).pathname;


var routes = {
    GET: {
        '/users': function (req, res) {
            res.end('tobi, loki, ferret')
        },
        '/user/:id': function (req, res, id) {
            res.end('user ' + id);
        }
    },
    DELETE: {
        '/user/:id': function (req, res, id) {
            res.end('deleted user ' + id)
        }
    }
};


// Basic logger middleware
// Outputs: "GET /user/1
function logger(req, res, next) {
    console.log('%s %s', req.method, req.url)
    next();
}

function setup(format) {
    var regexp = /:(\w+)/g;


    return logger(req, res, next) {
        // Replace all ":word" with
        var str = format.replace(regexp, function(match, property){
            console.log("match" + match + " " + 'property' + property);
            return req[property];
        });
        console.log(str);
        next();
    }
}

// Performs basic http authentication
function restrict(req, res, next) {
    var authorization = req.headers.authorization;
    if (!authorization) return next(new Error('Unauthorized'));

    var parts = authorization.split(' ');
    var scheme = parts[0];
    var auth = new Buffer(parts[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    authenticateWithDatabase(user, pass, function(err) {
        if (err) return next(err);
        next();
    });
}

// Primitive router
function admin(req, res, next) {
    switch(req.url) {
        case '/':
            res.end('try /users');
            break;
        case '/users':
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(['dennis', 'nguyen', 'jello']));
            break;
    }

}

function hello(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello middleware');
}

// When connect encounters an error, it will only invoike the error handler.
//var api = connect()
//    .use(users)
//    .use(pets)
//    .use(errorHandler);
//var app = connect()
//    .use(hello)
//    .use('/api', api)
//    .use(errorPage)
//    .listen(3000);

// App -> hello ->
// If '/api' -> users -> pets -> errorHandler
// Else -> errorPage

function errorHandler() {
    // Get dev/production state
    var env = process.env.NODE_ENV || 'development';

    return function(err, req, res, next) {
        res.statusCode = 500;
        switch(env) {
            case 'development':
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(err));
                break;
            default:
                res.end('Server Error');
        }

    }

}
var app = connect();
app
    .use(logger)
    .use('/admin', restrict)
    .use('/admin', admin)
    .use(hello)
    .listen(3000);

