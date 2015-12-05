var app   = require("koa")();
var route = require("koa-route")
var serve = require("koa-static")
var views = require("koa-views")
var mysql = require("mysql-co")

app.use(views(__dirname + '/views', {
    map: {
        html: 'ect'
    }
}))

var config = {}
config.db = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "matching"
}

GLOBAL.connectionPool = mysql.createPool(config.db);

app.use(function* mysqlConnection(next) {
    this.db = GLOBAL.db = yield GLOBAL.connectionPool.getConnection();
    yield this.db.query(`SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES,NO_ZERO_DATE'`);

    yield next;

    this.db.release();
});

app.use(
    route.get('/', function *index(){
        const sql = 'SELECT * FROM question WHERE id = ?'
        const res = yield this.db.query(sql, 1)
        const data = JSON.parse(res[0][0].data)
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

app.listen(3000)
