const validator = require('validator')
const i18n = require('i18n')

class Validation {
  constructor(rawData, rules) {
    this.rawData = rawData
    this.rules = rules
    this.errors = {}
  }

  validate() {
    this.check()
    if (Object.keys(this.errors).length !== 0) {
      return false
    }
    return true
  }

  check() {
    for (let field in this.rules) {
      for (let rule in this.rules[field]) {
        switch (rule) {
          case 'required':
            this.required(field, this.rawData[field], this.rules[field][rule])
            break
          case 'type':
            break
          case 'email':
            this.email(field, this.rawData[field], this.rules[field][rule])
            break
          case 'minlength':
            this.minlength(field, this.rawData[field], this.rules[field][rule])
            break
          case 'maxlength':
            this.maxlength(field, this.rawData[field], this.rules[field][rule])
            break
          case 'min':
            this.min(field, this.rawData[field], this.rules[field][rule])
            break
          case 'max':
            this.max(field, this.rawData[field], this.rules[field][rule])
            break
          case 'notIn':
            this.notIn(field, this.rawData[field], this.rules[field][rule])
            break
          case 'enum':
            this.enum(field, this.rawData[field], this.rules[field][rule])
            break
          case 'unique':
            // this.unique(field, this.rawData[field], this.rules[field][rule])
            break
          case 'match':
            this.match(field, this.rawData[field], this.rules[field][rule])
            break
          case 'numeric':
            this.numeric(field, this.rawData[field], this.rules[field][rule])
            break
          default:
            throw new Error(`Rule ${rule} for ${field} no implements in validation`)
        }
      }
    }
  }

  required(field, data, ruleValues) {
    // let message = `The ${field} field is required.`
    let message = i18n.__('validation.required %s', i18n.__(`model.${field}`))
    if (Array.isArray(ruleValues)) {
      message = ruleValues.pop()
    } else {
      if (ruleValues !== true) {
        message = ruleValues
      }
    }

    if (data === undefined || data.length <= 0) {
      this.errors[field] = {
        message: message
      }
    }
  }

  minlength(field, data, ruleValues) {
    if (data !== undefined) {
      let message = i18n.__('validation.minlength %s %s', i18n.__(`model.${field}`), ruleValues)
      let values = ruleValues
      if (Array.isArray(ruleValues)) {
        message = ruleValues.pop()
        values = ruleValues
      }

      if (data.length < values) {
        this.errors[field] = {
          message: message
        }
      }
    }
  }

  maxlength(field, data, ruleValues) {
    if (data !== undefined) {
      let message = i18n.__('validation.maxlength %s %s', i18n.__(`model.${field}`), ruleValues)
      let values = ruleValues
      if (Array.isArray(ruleValues)) {
        message = ruleValues.pop()
        values = ruleValues
      }

      if (data.length > values) {
        this.errors[field] = {
          message: message
        }
      }
    }
  }

  email(field, data, ruleValues) {
    if (data !== undefined) {
      let message = i18n.__('validation.email %s', i18n.__(`model.${field}`))
      if (Array.isArray(ruleValues)) {
        message = ruleValues.pop()
      } else {
        if (ruleValues !== true) {
          message = ruleValues
        }
      }
      if (!validator.isEmail(data)) {
        this.errors[field] = {
          message: message
        }
      }
    }
  }

  min(field, data, ruleValues) {
    if (data !== undefined) {
      let message = i18n.__('validation.min %s %s', i18n.__(`model.${field}`), ruleValues)
      let values = ruleValues
      if (Array.isArray(ruleValues)) {
        message = ruleValues.pop()
        values = ruleValues
      }
      let parseData = parseInt(data, 10)
      if (parseData && parseData < values) {
        this.errors[field] = {
          message: message
        }
      }
    }
  }

  max(field, data, ruleValues) {
    if (data !== undefined) {
      let message = i18n.__('validation.max %s %s', i18n.__(`model.${field}`), ruleValues)
      let values = ruleValues
      if (Array.isArray(ruleValues)) {
        message = ruleValues.pop()
        values = ruleValues
      }
      let parseData = parseInt(data, 10)
      if (parseData && parseData > values) {
        this.errors[field] = {
          message: message
        }
      }
    }
  }

  notIn(field, data, ruleValues) {
    if (data !== undefined) {
      let message = i18n.__('validation.notIn %s', i18n.__(`model.${field}`))
      let values = ruleValues
      if (Array.isArray(ruleValues)) {
        if (ruleValues[ruleValues.length - 1]) {
          message = ruleValues.pop()
        }
        values = ruleValues.slice(0, ruleValues.length - 1)
        if (values.some((element, index, array) => element === data)) {
          this.errors[field] = {
            message: message
          }
        }
      } else {
        if (data === values) {
          this.errors[field] = {
            message: message
          }
        }
      }
    }
  }

  enum(field, data, ruleValues) {
    if (data !== undefined) {
      let message = i18n.__('validation.enums %s', i18n.__(`model.${field}`))
      let values = ruleValues
      if (Array.isArray(ruleValues)) {
        if (ruleValues[ruleValues.length - 1]) {
          message = ruleValues.pop()
        }
        values = ruleValues.slice(0, ruleValues.length - 1)
        if (!values.includes(data)) {
          this.errors[field] = {
            message: message
          }
        }
      } else {
        if (data !== values) {
          this.errors[field] = {
            message: message
          }
        }
      }
    }
  }

  numeric(field, data, ruleValues) {
    if (data !== undefined) {
      let message = i18n.__('validation.numeric %s', i18n.__(`model.${field}`))
      if (Array.isArray(ruleValues)) {
        message = ruleValues.pop()
      } else {
        if (ruleValues !== true) {
          message = ruleValues
        }
      }
      if (!validator.isNumeric(data)) {
        this.errors[field] = {
          message: message
        }
      }
    }
  }

  match(field, data, ruleValues) {
    if (data !== undefined) {
      let message = i18n.__('validation.matches %s', i18n.__(`model.${field}`))
      let values = ruleValues
      if (Array.isArray(ruleValues)) {
        message = ruleValues.pop()
      }
      if (!validator.matches(data, values)) {
        this.errors[field] = {
          message: message
        }
      }
    }
  }
}

module.exports = Validation
// let rawData = {
//   username: '',
//   email: 'john@email.com',
//   age: '',
//   category: '',
//   skill: ''
// }
// let rules = {
//   username: {
//     required: true,
//     // minlength: 1,
//     maxlength: 10,
//     notIn: ['admin', 'root', undefined],
//   },
//   email: {
//     required: true,
//     email: true,
//     minlength: [5, 'Email min length must be 5']
//   },
//   age: {
//     required: 'Age is required',
//     numeric: true,
//     min: 20,
//     max: 100
//   },
//   category: {
//     required: true,
//     enum: ['food', 'sport', undefined]
//   },
//   skill: {
//     required: true,
//     match: '^lo'
//   }
// }
// let v = new Validation(rawData, rules)
// if (!v.validate()) {
//   console.log(v.errors)
// }
