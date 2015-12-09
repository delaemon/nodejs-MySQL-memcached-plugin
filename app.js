const app   = require("koa")();
const route = require("koa-route")
const serve = require("koa-static")
const views = require("koa-views")
const mysql = require("mysql-co")
const env = process.env

app.use(views(__dirname + '/views', {
    map: {
        html: 'ect'
    }
}))

var config = {}
config.db = {
    host: env.MYSQL_HOST || "localhost",
    port: env.MYSQL_PORT || "3306",
    user: env.MYSQL_USER || "root",
    password: env.MYSQL_PASS || "",
    database: env.MYSQL_DATABASE || "matching"
}

GLOBAL.connectionPool = mysql.createPool(config.db);

app.use(function* mysqlConnection(next) {
    this.db = GLOBAL.db = yield GLOBAL.connectionPool.getConnection();
    yield this.db.query(`SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES,NO_ZERO_DATE'`);

    yield next;

    this.db.release();
});

function wait(ms) {
  return function(done) {
    setTimeout(done, ms)
  }
}

app.use(
    route.get('/', function *index(){
        const sql = 'SELECT * FROM question WHERE id = ?'
        const res = yield this.db.query(sql, 1)
        const data = JSON.parse(res[0][0].data)
        //yield wait(3000)
        yield this.render('index.ect', {
            question: data.question,
            title: 'Matching',
            copyright: {
                url: 'http://takeshionodera.net',
                name: 'Takeshi.Onodera'
            }
        })
    })
)

app.use(
    serve(__dirname + '/public')
)

console.log("Starting Server. Pid", process.pid)
console.log("Listening to Port", env.PORT);
console.log("Listening to Address", env.BIND);
app.listen(env.PORT)
