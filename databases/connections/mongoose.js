const mongoose = require('mongoose')
const debug = require('debug')('app:mongodb')
const {
  env,
  mongoDbUri
} = require('../../config')

// mongoose.connect(mongoDbUri, {
//     auth: {
//         authdb: 'admin'
//     }
// })

mongoose.Promise = global.Promise
mongoose.connect(mongoDbUri)

if (env === 'development') {
  mongoose.set('debug', true)
}

const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongodb connection error:'))
db.once('open', function () {
  debug('connection success')
})

module.exports = db
