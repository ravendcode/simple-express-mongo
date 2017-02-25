const express = require('express')
const _ = require('lodash')
const authMiddleware = require('../../middlewares/auth.middleware')
// const {
//   ObjectID
// } = require('mongodb')
const User = require('../../models/user')
const Validation = require('../../utils/validation.util')
const router = express.Router()

// router.get('/', (req, res, next) => {
//   console.log(req.aaa)
//   Todo.find().then((todos) => {
//     res.send({
//       todos
//     })
//   }).catch((e) => next(e))
// })

router.get('/me', authMiddleware, (req, res, next) => {
  res.send({
    user: req.user
  })
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

router.post('/login', (req, res, next) => {
  let body = _.pick(req.body, ['email', 'password'])
  let rules = {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minlength: 6
    }
  }

  let v = new Validation(body, rules)
  if (!v.validate()) {
    return res.status(400).send({errors: v.errors})
  }
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({
        user
      })
    })
  }).catch((e) => next(e))
})

router.delete('/me/token', authMiddleware, (req, res, next) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }).catch((e) => next(e))
})

module.exports = router
