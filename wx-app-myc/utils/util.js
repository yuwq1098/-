const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * http POST请求
 */
const POST = (url,data,callBack) => {
  wx.request({
    url: url,
    data: data,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    // 微信小程序请求数据成功/ 成功失败状态只受本机网络影响
    success: function (res) {
      callBack && callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

/**
 * http GET请求
 */
const GET = (url, callBack) => {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      callBack && callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

module.exports = {
  formatTime,
  POST,
  GET,
}
