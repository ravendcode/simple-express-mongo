const path = require('path')
const http = require('http')
const express = require('express')
const hbs = require('hbs')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const i18n = require('i18n')
const config = require('./config')
const db = require('./databases/connections/mongoose')

const app = express()

app.all('*', function (req, res, next) {
  if (req.secure) {
    return next()
  }
  res.redirect('https://' + req.hostname + ':' + config.httpsPort + req.url)
})

http.createServer(app).listen(config.httpPort)

i18n.configure({
  locales: ['en', 'ru'],
  defaultLocale: config.locale,
  directory: path.join(__dirname, 'locales'),
  queryParameter: 'lang',
  register: global
})

if (config.env === 'development') {
  app.use(morgan('dev'))
}
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(i18n.init)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'hbs')
app.set('view options', {
  layout: 'layouts/base'
})

// Handlebars
hbs.registerPartials(path.join(__dirname, 'views/partials'))
require('./utils/hbs.util')(hbs)
hbs.localsAsTemplateData(app)

// Seeds
if (config.env === 'development') {
  // require('./databases/seeds/users.seeder').usersSeeder(() => {
  //   require('./databases/seeds/todos.seeder').todosSeeder(() => {})
  // })
}

// Middlewares
app.use((req, res, next) => {
  req.db = db

  app.locals.app = {
    env: config.env,
    httpPort: config.httpPort,
    httpsPort: config.httpsPort,
    host: config.host,
    locale: res.getLocale()
  }

  next()
})

// app.use(require('./middlewares/log.middleware'))

// Routes
require('./routes')(app)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error(req.__('error.not found'))
  err.status = 404
  next(err)
})

// Error handler
app.use(function (err, req, res, next) {
  let message = err.message
  let status = err.status || 500
  let error = {
    message,
    status
  }
  if (config.env === 'development' && status !== 404) {
    error.stack = err.stack
  }
  res.status(status).send({
    error
  })
})

module.exports = app
