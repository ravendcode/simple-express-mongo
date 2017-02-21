const {ObjectID} = require('mongodb')
const Todo = require('../../models/todo')
const debug = require('debug')('app:seed')

const todosSeeder = [{
  _id: new ObjectID(),
  text: 'Create your owe game RPG'
}, {
  _id: new ObjectID(),
  text: 'Create site chat',
  isComplated: true,
  complatedAt: 333
}]

module.exports.todosSeeder = todosSeeder

module.exports.seed = () => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todosSeeder)
  }).then((todos) => {
    // debug(todos)
  }).catch((e) => {
    debug(e)
  })
}
