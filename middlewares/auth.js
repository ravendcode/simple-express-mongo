const User = require('../models/user')

module.exports = (req, res, next) => {
  let token = req.header('x-auth')
  User.findByToken(token).then((user) => {
    if (!user) {
      let error = new Error('Bad Token')
      error.status = 401
      return Promise.reject(error)
    }
    req.user = user
    req.token = token
    next()
  }).catch((e) => next(e))
}
