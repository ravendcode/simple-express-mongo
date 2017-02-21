const path = require('path')
const express = require('express')
const hbs = require('hbs')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config')
const db = require('./databases/connections/mongoose')

const app = express()

if (config.env === 'development') {
  app.use(morgan('dev'))
}
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
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

app.locals.app = {
  env: config.env,
  port: config.port
}

// Seeds
if (config.env === 'development') {
  // require('./databases/seeds/todos.seeder').seed()
}

// Global middlewares
// app.use(require('./middlewares/log')())

// Routes
require('./routes')(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.title = err.status
  // res.locals.message = err.message
  // res.locals.error = req.app.get('env') === 'development' ? err : {}

  // // render the error page
  // res.status(err.status || 500)
  // res.render('error')

  // For API
  let error = {
    message: err.message,
  }
  if (config.env === 'development' && err.status !== 404) {
    error.stack = err.stack
  }
  res.status(err.status || 500).send({error})
})

module.exports = app
