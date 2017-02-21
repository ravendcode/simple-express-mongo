module.exports = (app) => {
  app.use('/', require('./routes/index.route'))
  app.use('/admin', require('./routes/admin/index.route'))
  app.use('/api/books', require('./routes/api/books.route'))
}
