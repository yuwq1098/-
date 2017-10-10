const DATA = require('./utils/getData.js');

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var that = this;
    wx.getLocation({
      success: function (res) {
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&callback=renderReverse&location=' + res.latitude + ',' + res.longitude + '&output=json&pois=1', data: {},
          header: { 'Content-Type': 'application/json' },
          success: function (ops) {
            // 处理百度返回的数据
            var dataString = ops.data;
            dataString = dataString.replace(/.*renderReverse/, '');
            dataString = dataString.substr(1, dataString.length-2);
            // String 转成 JSON
            var cityData = JSON.parse(dataString);
            // 获取当前城市
            var currCity = cityData.result.addressComponent.city;
            that.globalData.currCityName = currCity;
            
          }
        })
      }
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    cityInfo: DATA.cityData,
    currCityName: '',
  }
})