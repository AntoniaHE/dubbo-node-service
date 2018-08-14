const fs = require('fs')
const path = require('path')
const mkdir = require('./mkdir')

module.exports = function (__dir, api) {
  // 对api进行遍历
  Object.keys(api).forEach(service => {
    const url = path.join(__dir, './service/' + service)
    // 在与之同级的目录下面生成对应的service文件夹
    mkdir(url)
    // 一个service了里面有多个方法的情况下。
    // 遍历。
    if (api[service].length) {
      api[service].forEach((apiObj) => {
        // 生成的js文件那么，由驼峰转 -
        const name = apiObj.apiName.replace(/([A-Z])/g, '-$1').toLowerCase()
        const apiName = name + '.js'
        // 生成的js文件放置的位置
        const pathUrl = path.join(__dir, './service/' + service, apiName)
        // 判断文件是否存在，存在则不进行操作，不存在，则生成对应的js文件
        fs.stat(pathUrl, function (err) {
          if (err && err.code === 'ENOENT') {
            fs.writeFileSync(pathUrl, formateMethod(service, apiObj))
          }
        })
      })
    }
  })
}
// 格式化生成的js文件
function formateMethod (service, serviceObj) {
  return `'use stict'
const client = require('${serviceObj.packageName}')
module.exports = function (data) {
  return new Promise(function (resolve, reject) {
    client.${service}.${serviceObj.apiName}.${serviceObj.method}({
      data: data
    }).then(rs => {
      if (rs.success) {
        resolve(rs.data)
      } else {
        console.warn(rs)
        reject(rs)
      }
    }).catch(e => {
      console.error(e)
      reject(e)
    })
  })
}
`
}