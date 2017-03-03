const moment = require('moment')

const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  }
}

const generateLocationMessage = (from, coords) => {
  return {
    from,
    url: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
    createdAt: moment().valueOf()
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage
}
