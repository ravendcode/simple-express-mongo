const mongoose = require('mongoose')
const i18n = require('i18n')

let BookSchema = new mongoose.Schema({
  // unique
  title: {
    type: String,
    required: [true, i18n.__('validation.required %s', i18n.__(`model.title`))],
    trim: true,
    unique: true,
    dropDups: true,
    minlength: [3, i18n.__('validation.minlength %s %s', i18n.__(`model.title`), 3)]
  },
  price: {
    type: Number,
    required: [true, i18n.__('validation.required %s', i18n.__(`model.price`))],
  },
  count: {
    type: Number,
    min: [1, i18n.__('validation.min %s %s', i18n.__(`model.count`), 1)],
    max: [10, i18n.__('validation.max %s %s', i18n.__(`model.count`), 10)],
  }
})

let Book = mongoose.model('Book', BookSchema)

BookSchema.path('title').validate(function (value, next) {
  Book.find({
    'title': value
  }, function (err, book) {
    next(err || book.length === 0)
  })
}, i18n.__('validation.unique %s', i18n.__('model.title')))

module.exports = Book




