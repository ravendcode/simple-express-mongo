const {generateMessage} = require('./utils/message')

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New user connected')

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

    socket.on('createMessage', (message, cb) => {
      console.log('createMessage', message)
      io.emit('newMessage', {
        from: message.from,
        text: message.text,
        createdAt: new Date().getTime()
      })
      cb('From server.')
      // socket.broadcast.emit('newMessage', {
      //   from: message.from,
      //   text: message.text,
      //   createdAt: new Date().getTime()
      // })
    })

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })
}
