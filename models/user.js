const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const i18n = require('i18n')
const config = require('../config')

let UserSchema = new mongoose.Schema({
  // unique
  email: {
    type: String,
    required: [true, i18n.__('validation.required %s', i18n.__(`model.email`))],
    trim: true,
    lowercase: true,
    minlength: [3, i18n.__('validation.minlength %s %s', i18n.__(`model.email`), 3)],
    validate: {
      validator: (value) => {
        return validator.isEmail(value)
      },
      message: i18n.__('validation.email %s', i18n.__(`model.email`))
    }
  },
  password: {
    type: String,
    required: [true, i18n.__('validation.required %s', i18n.__(`model.password`))],
    minlength: [6, i18n.__('validation.minlength %s %s', i18n.__(`model.password`), 6)],
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()
  return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
  let user = this
  let access = 'auth'
  let token = jwt.sign({
    _id: user._id,
    access
  }, config.salt)
  user.tokens.push({
    access,
    token
  })
  return user.save().then(() => {
    return token
  })
}

UserSchema.methods.removeToken = function (token) {
  let user = this
  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  })
}

UserSchema.statics.findByToken = function (token) {
  let User = this
  let decoded
  try {
    decoded = jwt.verify(token, config.salt)
  } catch (e) {
    let error = new Error('Bad token')
    error.status = 401
    return Promise.reject(error)
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this

  return User.findOne({
    email
  }).then((user) => {
    let error = new Error('Incorrect email or password')
    error.status = 400
    if (!user) {
      return Promise.reject(error)
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          reject(err)
        }
        if (res) {
          resolve(user)
        } else {
          reject(error)
        }
      })
    })
  })
}

UserSchema.pre('save', function (next) {
  let user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err)
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

// UserSchema.post('save', function (doc) {
//   console.log('%s has been saved', doc._id)
// })

let User = mongoose.model('User', UserSchema)

UserSchema.path('email').validate(function (value, next) {
  if (!this.isModified('tokens')) {
    User.find({
      'email': value.toLowerCase()
    }, function (err, user) {
      next(err || user.length === 0)
    })
  } else {
    next()
  }
}, i18n.__('validation.unique %s', i18n.__('model.email')))

module.exports = User
