const {
  ObjectID
} = require('mongodb')
const Todo = require('../../models/todo')
const {userId, userId1} = require('./users.seeder')
// const debug = require('debug')('app:seed')

const todosSeeds = [{
  _id: new ObjectID(),
  text: 'Create your owe game RPG',
  _creator: userId
}, {
  _id: new ObjectID(),
  text: 'Create site chat',
  isComplated: true,
  complatedAt: 333,
  _creator: userId1
}]

const todosSeeder = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todosSeeds)
  }).then(() => done())
}

module.exports = {
  todosSeeder,
  todosSeeds
}
