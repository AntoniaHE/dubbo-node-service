const fs = require('fs')
const path = require('path')
const exists = fs.existsSync || path.existsSync

module.exports = function(path) {
  // 路径不存在
  if (exists(path)) {
    return
  }

  // 创建上层目录
  path.split(/\//).reduce(function (prev, next) {
    if (prev && !exists(prev)) {
      fs.mkdirSync(prev)
    }

    return prev + '/' + next
  })

  // 最后一层
  if (!exists(path)) {
    fs.mkdirSync(path)
  }
}