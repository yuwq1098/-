const carInfo = require('../../utils/class/carInfo.js')

// pages/hall/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播数据
    slideData: {
      vertical: false, // 是否纵向
      indicatorDots: true, // 是否显示指示点
      current: 0,          // 当前所在页面的 index
      indicatorColor: "#d0cdd1", // 指示点颜色
      indicatorActiveColor: "#04be02", // 指代当前轮播图片的指示点颜色
      autoplay: true, // 是否启用自动播放
      interval: 5000, // 定时播放时间间隔
      duration: 1000, // 轮播图片滑动的时间
      circular: true, // 是否衔接处理
    },
    // 匹配信息结果条数
    resTotal: 0,
    // b2b大厅搜索结果 车辆列表
    b2bCarList: [],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getB2bCarListInfo();
  },

  /**
   * 使用b2b抽象类完成carInfo
   */
  normalizeB2bCarInfo(list) {
    var arr = [];
    list.forEach((item, index) => {
      arr.push(new (carInfo.b2bCarInfo)(item))
    });
    return arr;
  },



  /**
   * 获取b2b汽车信息列表
   */
  getB2bCarListInfo() {
    var that = this;
    var data = {
      // B2BPriceFrom: "",
      // B2BPriceTo: "",
      // CarBrandId: "",
      // CarInCity: "",
      // CarSeriesId: "",
      Color: "黑色",
      // DischargeStandard: "",
      // GearType: "",
      // KeyCountFrom: "",
      // KeyCountTo: "",
      // MileageFrom: "",
      // MileageTo: "",
      // OnLicensePlateDateFrom: "",
      // OnLicensePlateDateTo: "",
      PageIndex: 1,
      PageSize:25,
      LikeKey: '宝',
      // ServiceCharacteristics: "",
      // SortType: "",
      // TransferTimesFrom: "",
      // TransferTimesTo: "",
    }
    wx.request({
      url: 'https://www.muyouche.com/action2/B2BCarList.ashx',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        var b2bCarList = that.normalizeB2bCarInfo(res.data.data);

        that.setData({ 'b2bCarList': b2bCarList })
        that.setData({ "resTotal": res.data.total })
      }
    });

    // //B2B车辆大厅列表详情
    // getCarDetalis(params){
    //     return fetchSign('/action2/B2BCarDetail.ashx', dataToJson(params))
    // },
  },
  // 当页面索引到了最后一个时
  dotsChange: function (e) {
    var currSlideIndex = e.detail.current;
    var that = this;
    // 小程序不可操作DOM
    // var swiperDOM = document.getElementById("index-swiper"); 
    var theInterval = that.data.slideData.interval;
    if (currSlideIndex >= 4) {
      setTimeout(function () {
        that.setData({ "slideData.current": 0 })
      }, theInterval)
    }
  },

  /**
   * 进入车辆详情页, catchtap 禁止事件向上冒泡，bindtap则不禁止事件向上冒泡
   */
  enterCarDetails(e){
     var carId = e.currentTarget.dataset.carid; 
     // 使用js动态导航跳转
     wx.navigateTo({
       url: "/pages/details/details?id=" + carId
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})