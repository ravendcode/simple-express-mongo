const {
  ObjectID
} = require('mongodb')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
// const debug = require('debug')('app:seed')

const config = require('../../config')

const userId = new ObjectID()
const userId1 = new ObjectID()

const usersSeeds = [{
  _id: userId,
  email: 'john@email.com',
  password: 'qwerty',
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: userId,
      access: 'auth'
    }, config.salt)
  }]
}, {
  _id: userId1,
  email: 'vova@email.com',
  password: 'qwerty',
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: userId,
      access: 'auth'
    }, config.salt)
  }]
}]

const usersSeeder = (done) => {
  User.remove({}).then(() => {
    let user = new User(usersSeeds[0]).save()
    let user1 = new User(usersSeeds[1]).save()

    return Promise.all([user, user1])
  }).then(() => done())
}

module.exports = {
  usersSeeder,
  usersSeeds
}
