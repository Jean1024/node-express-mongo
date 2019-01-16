const fs = require('fs')
const sha1 = require('sha1')
const express = require('express')
const UserModel = require('../models/users')
const checkNotLogin = require('../middleware/check').checkNotLogin
const upload = require('../lib/upload')
const router = express.Router()

router.get('/', checkNotLogin, function (req, res, next) {
  res.send('注册')
})

router.post('/', upload.single('avatar'), function (req, res, next) {
  const name = req.body.name
  const gender = req.body.gender
  const bio = req.body.bio
  const avatar = req.file
  let password = req.body.password
  const repassword = req.body.repassword

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }
    if (!avatar.filename) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致')
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    fs.unlink(avatar.path)
    let info = {
      msg: e.message
    }
    return res.send(info)
  }
  // 明文密码加密
  password = sha1(password)
  // 待写入数据库的用户信息
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar.filename
  }
  UserModel.create(user)
    .then(function (result) {
      user = result.ops[0]
      delete user.password
      req.session.user = user
      res.send({
        code: 200,
        msg: '注册成功!',
        userInfo: user
      })
    })
    .catch(function (e) {
      // 注册失败，异步删除上传的头像
      fs.unlink(avatar.path)
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('duplicate key')) {
        let info = {
          msg: '用户名已被占用!'
        }
        return res.send(info)
      }
      next(e)
    })
})

module.exports = router
