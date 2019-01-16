
const multer = require('multer')
const path = require('path')
const uploadFolder = path.join(__dirname, '../public/img')
const sha1 = require('sha1')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder) // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, sha1(file.fieldname + '-' + Date.now() + Math.random()) + ext)
  }
})
const upload = multer({ storage })
module.exports = exports = upload
