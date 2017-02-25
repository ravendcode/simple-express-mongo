const mongoose = require('mongoose')
const i18n = require('i18n')

let TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, i18n.__('validation.required %s', i18n.__(`model.text`))],
    trim: true,
    minlength: [3, i18n.__('validation.minlength %s %s', i18n.__(`model.text`), 3)],
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, i18n.__('validation.required %s', i18n.__(`model._creator`))],
  }
})

let Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo
