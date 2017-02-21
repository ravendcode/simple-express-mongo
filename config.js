const utils = require('./utils')

var env = process.env.NODE_ENV || 'development'
// var env = 'production'
var port = utils.normalizePort(process.env.PORT || '80')

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

module.exports = {
  env,
  port,
  mongoDbUri,
}
