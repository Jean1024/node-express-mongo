const express = require('express')
const router = express.Router()
const checkLogin = require('../middleware/check').checkLogin
router.get('/', checkLogin, function (req, res) {
  res.send(req.session)
})

module.exports = router
