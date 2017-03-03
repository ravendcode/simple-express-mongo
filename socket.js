const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message.util')
const {
  Users
} = require('./utils/users.utils')
const users = new Users()

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', (params, cb) => {
      if (!isRealString(params.name) || !isRealString(params.room)) {
        return cb('Name and room name are required.')
      }
      socket.join(params.room)
      users.removeUser(socket.id)
      users.addUser(socket.id, params.name, params.room)

      io.to(params.room).emit('updateUserList', users.getUserList(params.room))
      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`))
      cb()
    })

    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

    // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

    socket.on('createMessage', (message, cb) => {
      let user = users.getUser(socket.id)
      if (user && isRealString(message.text)) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text))
      }
      cb()
      // socket.broadcast.emit('newMessage', {
      //   from: message.from,
      //   text: message.text,
      //   createdAt: new Date().getTime()
      // })
    })

    socket.on('createLocationMessage', (coords) => {
      let user = users.getUser(socket.id)
      if (user) {
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords))
      }
    })

    socket.on('disconnect', () => {
      let user = users.removeUser(socket.id)
      if (user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room))
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`))
      }
    })
  })
}


const isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0
}
