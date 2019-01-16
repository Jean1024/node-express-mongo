module.exports = function (app) {
  app.use('/posts', require('./posts'))
  app.use('/signin', require('./signin'))
  app.use('/signup', require('./signup'))
  app.use('/signout', require('./signout'))
  app.use('/comments', require('./comments'))
}
