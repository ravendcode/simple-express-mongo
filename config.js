const utils = require('./utils')

var env = process.env.NODE_ENV || 'development'
var host = 'app.dev'
var port = utils.normalizePort(process.env.PORT || '80')

const mongoHost = process.env.MONGO_HOST || 'localhost'
const mongoDb = process.env.MONGO_DB || 'startexpress'
const mongoPort = utils.normalizePort(process.env.MONGO_PORT || 27017)
const mongoUser = process.env.MONGO_USER
const mongoPassword = process.env.MONGO_PASSWORD
const mongoUri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}`

if (process.env.NODE_ENV === 'production') {
  env = 'production'
  host = 'localhost'
} else if (process.env.NODE_ENV === 'test') {
  env = 'test'
}

module.exports = {
  env,
  host,
  port,
  mongoUri,
}
