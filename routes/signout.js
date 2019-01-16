const express = require('express')
const router = express.Router()

const checkLogin = require('../middleware/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
  // 清空 session 中用户信息
  req.session.user = null
  // 登出成功后跳转到主页
  res.redirect('/lognin.html')
})

module.exports = router
