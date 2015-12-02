var app   = require("koa")();
var route = require("koa-route")
var serve = require("koa-static")
var views = require("koa-views")

app.use(views(__dirname + '/views', {
    map: {
        html: 'ect'
    }
}))

app.use(
    route.get('/', function *index(){
        yield this.render('index.ect', {
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
