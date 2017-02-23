module.exports = (app) => {
  app.use('/', require('./routes/index.route'))
  app.use('/admin', require('./routes/admin/index.route'))
  app.use('/api/users', require('./routes/api/users.route'))
  app.use('/api/todos', require('./routes/api/todos.route'))
}
