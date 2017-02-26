const express = require('express')
const {
  ObjectID
} = require('mongodb')
const _ = require('lodash')
const Book = require('../../models/book')
const Validation = require('../../utils/validation.util')
const router = express.Router()

router.get('/', (req, res, next) => {
  Book.find().then((books) => {
    res.send({
      books
    })
  }).catch((e) => next(e))
})

router.post('/', (req, res, next) => {
  let body = _.pick(req.body, ['title', 'price', 'count'])

  let rules = {
    title: {
      required: true,
      // email: true,
      minlength: 3,
      unique: Book,
      // match: '^lo',
      // maxlength: 6
      // notIn: ['admin', 'root', undefined]
    },
    price: {
      required: true,
      // numeric: true,
      decimal: true,
      min: 2.2,
      max: 5.5
    },
    count: {
      required: true
    }
  }

  new Validation(body, rules).validate().then(() => {
    return new Book(body).save()
  }).then((book) => {
    res.status(201).send({book})
  }).catch((e) => res.status(400).send(e))
})

router.get('/:id', (req, res, next) => {
  res.send({
    book: req.book
  })
})

router.patch('/:id', (req, res, next) => {
  if (req.book.title === req.body.title) {
    req.book.$ignore('title')
  }
  let body = _.pick(req.body, ['title', 'price', 'count'])

  _.extend(req.book, body)

  req.book.save().then((book) => {
    res.send({
      book
    })
  }).catch((e) => res.status(400).send(e))
})

router.delete('/:id', (req, res, next) => {
  req.book.remove().then((book) => {
    res.send({
      book
    })
  }).catch((e) => next(e))
})

router.param('id', function (req, res, next, id) {
  let error = new Error(req.__('error.book not found'))
  error.status = 404
  if (!ObjectID.isValid(id)) {
    return next(error)
  }

  Book.findById(id).then((book) => {
    if (!book) {
      return next(error)
    }
    req.book = book
    next()
  }).catch((e) => next(e))
})

module.exports = router
