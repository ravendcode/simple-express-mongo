const {
  ObjectID
} = require('mongodb')
const Todo = require('../../models/todo')
// const debug = require('debug')('app:seed')

const todosSeeds = [{
  _id: new ObjectID(),
  text: 'Create your owe game RPG'
}, {
  _id: new ObjectID(),
  text: 'Create site chat',
  isComplated: true,
  complatedAt: 333
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
