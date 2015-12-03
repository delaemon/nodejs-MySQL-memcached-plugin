var app   = require("koa")();
var route = require("koa-route")
var serve = require("koa-static")
var views = require("koa-views")
var mysql = require("mysql")

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

app.use(
    route.get('/', function *index(){
        var pool = mysql.createPool(config.db)
        pool.query('SELECT * FROM question WHERE id = 1',  function(err, rows, fields){
            if (err) throw err
            data = rows
        })
        yield this.render('index.ect', {
            question: data,
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
