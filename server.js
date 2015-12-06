var exec = require('child_process').exec
var throng = require('throng')

function start() {
  this.startTime = Date.now()
  exec("node --optimize_for_size --max_old_space_size=920 --gc_interval=100 test.js", function(err, stdout, stderr) {
    this.stdout = stdout
    this.endTime = Date.now()
  }.bind(this))
}

throng(start, {
  workers: require('os').cpus().length - 1,
  lifetime: Infinity,
  grace: 4000
})
