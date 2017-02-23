const express = require('express')
const authMdw = require('../../middlewares/auth')
const {
  ObjectID
} = require('mongodb')
const _ = require('lodash')
const User = require('../../models/user')
const router = express.Router()

// router.get('/', (req, res, next) => {
//   console.log(req.aaa)
//   Todo.find().then((todos) => {
//     res.send({
//       todos
//     })
//   }).catch((e) => next(e))
// })

router.get('/me', authMdw, (req, res, next) => {
  res.send(req.user)
})

router.post('/', (req, res, next) => {
  let body = _.pick(req.body, ['email', 'password'])
  let user = new User(body)
  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).status(201).send({
      user
    })
  }).catch((e) => {
    res.status(400).send(e)
  })
})


// router.get('/:id', (req, res, next) => {
//   res.send({
//     todo: req.todo
//   })
//   // Todo.findById(req.params.id).then((todo) => {
//   //   if (!todo) {
//   //     return res.status(404).send({
//   //       error: 'Todo not found'
//   //     })
//   //   }
//   //   res.send({
//   //     todo
//   //   })
//   // }).catch((e) => {
//   //   res.status(500).send()
//   // })
// })

// router.patch('/:id', (req, res, next) => {
//   let body = _.pick(req.body, ['text', 'isCompleted'])
//   if (_.isBoolean(body.isCompleted) && body.isCompleted) {
//     body.completedAt = new Date().getTime()
//   } else {
//     body.isCompleted = false
//     body.completedAt = null
//   }
//   _.extend(req.todo, body)

//   req.todo.save().then((todo) => {
//     res.send({
//       todo
//     })
//   }).catch((e) => next(e))

//   // Todo.findByIdAndUpdate(req.params.id, {
//   //   $set: body
//   // }, {
//   //   new: true
//   // }).then((todo) => {
//   //   if (!todo) {
//   //     return res.status(404).send({
//   //       error: 'Todo not found'
//   //     })
//   //   }
//   //   res.send({
//   //     todo
//   //   })
//   // }).catch((e) => {
//   //   res.status(500).send()
//   // })
// })

// router.delete('/:id', (req, res, next) => {
//   req.todo.remove().then((todo) => {
//     res.send({
//       todo
//     })
//   }).catch((e) => next(e))
//   // Todo.findByIdAndRemove(req.params.id).then((todo) => {
//   //   if (!todo) {
//   //     return res.status(404).send({
//   //       error: 'Todo not found'
//   //     })
//   //   }
//   //   res.send({
//   //     todo
//   //   })
//   // }).catch((e) => {
//   //   res.status(500).send()
//   // })
// })

// router.param('id', function (req, res, next, id) {
//   let error = new Error('Todo Not Found')
//   error.status = 404
//   if (!ObjectID.isValid(id)) {
//     return next(error)
//   }

//   Todo.findById(id).then((todo) => {
//     if (!todo) {
//       return next(error)
//     }
//     req.todo = todo
//     next()
//   }).catch((e) => next(e))
// })

module.exports = router
