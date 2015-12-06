var cluster = require('cluster');
var http = require('http');

if (cluster.isMaster) {
    var numCPUs = require('os').cpus().length
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
} else {
    console.log("cluster pid: " + process.pid)
    require('./app')
}
