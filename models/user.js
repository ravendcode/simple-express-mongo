const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const config = require('../config')

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value)
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
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
  let token = jwt.sign({_id: user._id, access}, config.salt)
  user.tokens.push({access, token})
  return user.save().then(() => {
    return token
  })
}

UserSchema.statics.findByToken = function (token) {
  let User = this
  let decoded
  try {
    decoded = jwt.verify(token, config.salt)
  } catch (e) {
    let error = new Error('Bad Token')
    error.status = 401
    return Promise.reject(error)
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

let User = mongoose.model('User', UserSchema)

module.exports = User
