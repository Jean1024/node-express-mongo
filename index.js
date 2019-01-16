const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')(session)
const routes = require('./routes')
const config = require('./config/default')
const pkg = require('./package')
const app = express()
// 添加json解析
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))
// 允许所有的请求形式
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(express.static(path.join(__dirname, './public')))
app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true, // 强制更新
  saveUninitialized: false, // 强制创建一个session
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({
    url: config.mongodb
  })
}))

routes(app)

if (module.parent) {
  // 被 require，则导出 app
  module.exports = app
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`)
  })
}
