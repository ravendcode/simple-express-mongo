const utils = require('./utils')

const env = process.env.NODE_ENV || 'development'
// const env = 'production'
const httpPort = 80
const httpsPort = utils.normalizePort(process.env.PORT || 443)

let mongoDbName = process.env.MONGODB_NAME || 'startexpress'
// const mongoDbHost = process.env.MONGODB_HOST || 'localhost'
// const mongoDbPort = utils.normalizePort(process.env.MONGODB_PORT || 27017)
// const mongoDbUser = process.env.MONGODB_USER
// const mongoDbPassword = process.env.MONGODB_PASSWORD

if (process.env.NODE_ENV === 'test') {
  mongoDbName += '_test'
  console.log(`env is ${env}`)
}

// const mongoDbUri = process.env.MONGODB_URI || `mongodb://${mongoDbUser}:${mongoDbPassword}@${mongoDbHost}:${mongoDbPort}/${mongoDbName}`
const mongoDbUri = process.env.MONGODB_URI || `mongodb://localhost/${mongoDbName}`
const salt = process.env.SALT || '$2a$10$gK5iJIrl2/drnIpSOLdWpO'
const host = process.env.HOST || 'app.dev'
const locale = 'ru'

module.exports = {
  env,
  httpPort,
  httpsPort,
  mongoDbUri,
  salt,
  host,
  locale
}
