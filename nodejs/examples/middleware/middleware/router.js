/**
 * Created by Dennis on 11/27/2015.
 */
    // General use router middleware.

var parse = require('url').parse;
//
//var routes = {
//    GET: {
//        '/users': function (req, res) {
//            res.end('tobi, loki, ferret')
//        },
//        '/user/:id': function (req, res, id) {
//            res.end('user ' + id);
//        }
//    },
//    DELETE: {
//        '/user/:id': function (req, res, id) {
//            res.end('deleted user ' + id)
//        }
//    }
//};

module.exports = function route(obj) {
    // Middleware with routes configure in Obj.
    return function(req, res, next) {
        // Check to make sure req.method is defined, if not invoke next
        if (!obj[req.method]) {
            next();
            return;

        }
        // Lookup paths for req.method (GET, DELETE)
        var routes = obj[req.method];
        // Parse URL for matching against pathname
        var url = parse(req.url);
        // Store paths for req.method as array
        var paths = Object.keys(routes);

        // loop throug hpaths
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var fn = routes[path];
            path = path.replace(/\//g, '\\/')
                .replace(/:(\w+)/g, '([^\\/]+)');
            var re = new RegExp('^' + path + '$');

            // Attempt to match against pathname
            var captures = url.pathname.match(re)
            if (captures) {
                // Pass capture groups
                var args = [req, res].concat(captures.slice(1));
                fn.apply(null, args);
                return;
            }
        }
        next();

    }


};