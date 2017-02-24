const express = require('express')
const {
  ObjectID
} = require('mongodb')
const _ = require('lodash')
const Todo = require('../../models/todo')
const router = express.Router()

router.get('/', (req, res, next) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({
      todos
    })
  }).catch((e) => next(e))
})

router.post('/', (req, res, next) => {
  new Todo({
    text: req.body.text,
    _creator: req.user._id
  }).save().then((todo) => {
    res.status(201).send({
      todo
    })
  }).catch((e) => res.status(400).send(e))
})

router.get('/:id', (req, res, next) => {
  res.send({
    todo: req.todo
  })

  // Todo.findById(req.params.id).then((todo) => {
  //   if (!todo) {
  //     return res.status(404).send({
  //       error: 'Todo not found'
  //     })
  //   }
  //   res.send({
  //     todo
  //   })
  // }).catch((e) => {
  //   res.status(500).send()
  // })
})

router.patch('/:id', (req, res, next) => {
  let body = _.pick(req.body, ['text', 'isCompleted'])
  if (_.isBoolean(body.isCompleted) && body.isCompleted) {
    body.completedAt = new Date().getTime()
  } else {
    body.isCompleted = false
    body.completedAt = null
  }
  _.extend(req.todo, body)

  req.todo.save().then((todo) => {
    res.send({
      todo
    })
  }).catch((e) => next(e))

  // Todo.findByIdAndUpdate(req.params.id, {
  //   $set: body
  // }, {
  //   new: true
  // }).then((todo) => {
  //   if (!todo) {
  //     return res.status(404).send({
  //       error: 'Todo not found'
  //     })
  //   }
  //   res.send({
  //     todo
  //   })
  // }).catch((e) => {
  //   res.status(500).send()
  // })
})

router.delete('/:id', (req, res, next) => {
  req.todo.remove().then((todo) => {
    res.send({
      todo
    })
  }).catch((e) => next(e))
  // Todo.findByIdAndRemove(req.params.id).then((todo) => {
  //   if (!todo) {
  //     return res.status(404).send({
  //       error: 'Todo not found'
  //     })
  //   }
  //   res.send({
  //     todo
  //   })
  // }).catch((e) => {
  //   res.status(500).send()
  // })
})

router.param('id', function (req, res, next, id) {
  let error = new Error('Todo not found')
  error.status = 404
  if (!ObjectID.isValid(id)) {
    return next(error)
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return next(error)
    }
    req.todo = todo
    next()
  }).catch((e) => next(e))
})

module.exports = router
