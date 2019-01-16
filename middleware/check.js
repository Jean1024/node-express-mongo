module.exports = {
  checkLogin: function checkLogin (req, res, next) {
    if (!req.session.user) {
      return res.json({
        code: 202,
        msg: '未登录'
      })
    }
    next()
  },
  checkNotLogin: function checkNotLogin (req, res, next) {
    if (req.session.user) {
      return res.redirect('back')
    }
    next()
  }
}
