const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
// const checkNotLogin = require('../middleware/check').checkLogin

router.get('/', function (req, res) {
  res.send('登录页')
})

router.post('/', function (req, res, next) {
  const name = req.body.name
  const password = req.body.password
  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    return res.json({
      msg: e.messsage
    })
  }

  UserModel.getUserByName(name)
    .then(function (user) {
      if (!user) {
        return res.json({
          msg: '用户不存在'
        })
      }
      if (sha1(password) !== user.password) {
        return res.json({
          msg: '用户名或密码错误'
        })
      }
      delete user.password
      req.session.user = user
      return res.json({
        code: 200,
        msg: '登录成功',
        userinfo: user
      })
    })
    .catch(next)
})

module.exports = router
