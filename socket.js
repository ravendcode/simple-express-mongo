const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message')

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New user connected')

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

    socket.on('createMessage', (message, cb) => {
      console.log('createMessage', message)
      io.emit('newMessage', generateMessage(message.from, message.text))
      cb()
      // socket.broadcast.emit('newMessage', {
      //   from: message.from,
      //   text: message.text,
      //   createdAt: new Date().getTime()
      // })
    })

    socket.on('createLocationMessage', (coords) => {
      io.emit('newLocationMessage', generateLocationMessage('Admin', coords))
    })

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })
}
