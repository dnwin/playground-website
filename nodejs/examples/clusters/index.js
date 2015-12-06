var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var express = require('express');
if (cluster.isMaster) {
    console.log('Fork %s worker(s) from master', numCPUs);
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('online', function(worker) {
        console.log('Worker is running on %s pid', worker.process.pid);
    });
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker with %s is closed', worker.process.pid );
    });
} else if (cluster.isWorker) {
    var port = 8888;
    console.log('Worker (%s) is now listening to http://localhost:%s',
        cluster.worker.process.pid, port);
    var app = express();
    app.get('*', function(req, res) {
        res.send(200, 'cluster ' + cluster.worker.process.pid + ' responded \n');
    });
    app.listen(port);
}

//  162.243.185.185