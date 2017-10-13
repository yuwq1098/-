const carDetails = require('../../utils/class/carDetails.js')
const carInfo = require('../../utils/class/carInfo.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播数据
    slideData: {
      vertical: false, // 是否纵向
      indicatorDots: false, // 是否显示指示点
      current: 0,          // 当前所在页面的 index
      indicatorColor: "#d0cdd1", // 指示点颜色
      indicatorActiveColor: "#04be02", // 指代当前轮播图片的指示点颜色
      autoplay: true, // 是否启用自动播放
      interval: 5000, // 定时播放时间间隔
      duration: 1000, // 轮播图片滑动的时间
      circular: true, // 是否衔接处理
    },
    // 车辆ID
    carId: "",
    // 车辆基本信息
    basicInfo: "",
    // 车况补充
    carDetails: [],
    // 获取车辆图片图片列表信息
    fileInfoList: "",
    // 车辆基本信息
    basicInfo: "",
    // 店铺在售车源
    onSaleCarList: [],  // 部分
    onSaleCarAllInfo: [],  // 全部
    theOnSaleCarList: [],  // 在售车源展示实体
    // 在售车源数
    onSaleCarCount: 0,
    // 其他信息
    otherInfo: {},
    // 车辆图片信息
    carImgData: {
      merchantName: "暂无数据",
      imgItems: []
    },

    // 当前轮播图所在页数
    currSlideIndex: 1,
    // 轮播图总页数
    slidePageSize: 0,
    
    // 是否已显示全部
    isShowAllView: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加入测试数据，完成详情页后删除
    // var theCarId = options.id || '1709261428008565531575357521';
    var theCarId = options.id;
    // 获取车辆详情数据
    this.getCarDetailsData(theCarId);
    // 接收carId 数据
    this.setData({
      'carId': theCarId,
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
   * 格式化车辆基本信息
   */
  normalizeBasicInfo(data) {
    return new (carDetails.basicInfo)(data);
  },
  
  /**
   * 格式化车况补充
   */
  normalizeCarOtherInfo(list){
    let arr = [];
    list.forEach((item, index) => {
      arr.push(new (carDetails.carOtherDetails)(item));
    })
    return arr;
  },

  /**
   * 格式化车辆文件列表
   */
  normalizeFileList(list) {
    let arr = [];
    list.forEach((item, index) => {
      arr.push(new (carDetails.fileInfoList)(item));
    })
    return arr;
  },

  /**
   * 格式化车辆其他信息
   */
  normalizeOtherInfo(data){
    return new (carDetails.otherInfo)(data);
  },

  /**
   * 格式化车辆图片文件
   */
  normalizeCarImgs(list, otherInfo) {
    let map = {
      merchantName: "",
      imgItems: []
    }
    map.merchantName = otherInfo.cdgName;
    if (list.length <= 0) return map;
    list.forEach((item, index) => {
      if (item.type == "img" && item.groupName == "车辆照片") {
        map.imgItems.push(item)
      }
    });
    return map;
  },
  
  /**
   * 格式化车行车辆信息列表
   */
  normalizeCarList(list, params) {
    let arr = [];
    if (params=='all'){
      list.forEach((item, index) => {
        arr.push(new (carInfo.onSaleCarInfo)(item));
      })
    }else{
      var _params = params||3;
      list.forEach((item, index) => {
        if (index < _params) {
        arr.push(new (carInfo.onSaleCarInfo)(item));
        }
      })
    }
    
    return arr;
  },

  /**
   * 获取车辆详情数据
   */
  getCarDetailsData(cid){
    var that = this;
    var data = {
      'CarId': cid,
    }
    wx.request({
      url: 'https://www.muyouche.com/action2/B2BCarDetail.ashx',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        var theData = res.data.data;
        // 获取车辆详情基本信息
        var basicInfo = that.normalizeBasicInfo(theData.CarInfo)
        // 车辆信息补充
        if (theData.CarDetails.length == 0) {
          that.setData({
            'carDetails': []
          })
        } else {
          that.setData({
            'carDetails': that.normalizeCarOtherInfo(theData.CarDetails)
          })
        }

        // 获取文件列表
        var fileInfoList = that.normalizeFileList(theData.CarFiles);
        // 获取车辆其他相关信息
        var otherInfo = that.normalizeOtherInfo(theData.OtherInfo);

        that.setData({ 
          'fileInfoList': fileInfoList,
          'basicInfo': basicInfo,
          'otherInfo': otherInfo,
        })

        //获取车辆图片数据
        setTimeout(function(){
          // 获取在售车辆列表
          that.getOnSaleCar(that.data.basicInfo.mid);
          // 获取车辆详情图列表
          var carImgData = that.normalizeCarImgs(that.data.fileInfoList, that.data.otherInfo)
          that.setData({
            'carImgData': carImgData,
            'slidePageSize': carImgData.imgItems.length,
          });
        });
      }
    });
  },
  
  /**
   * 获取卖家店铺在售车源信息列表
   */
  getOnSaleCar(id) {
    var that = this;
    let data = {
      SellerId: id,
    }
    wx.request({
      url: 'https://www.muyouche.com/action2/CDGStore.ashx',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var theData = res.data.data;
        var onSaleCarList = that.normalizeCarList(theData.CarList,5);
        var onSaleCarAllInfo = that.normalizeCarList(theData.CarList, 'all');
        that.setData({
          'onSaleCarList': onSaleCarList,
          'onSaleCarAllInfo': onSaleCarAllInfo,
          'theOnSaleCarList': onSaleCarList,
          'onSaleCarCount': theData.CarCount,
        });
      }
    });
  },

  // 当页面索引到了最后一个时
  dotsChange: function (e) {
    var currSlideIndex = e.detail.current;
    var that = this;
    that.setData({
      'currSlideIndex': currSlideIndex+1,
    })
    // 小程序不可操作DOM
    // var swiperDOM = document.getElementById("index-swiper"); 
    var theInterval = that.data.slideData.interval;
    if (currSlideIndex >= that.data.carImgData.imgItems.length) {
      setTimeout(function () {
        that.setData({ "slideData.current": 0 })
      }, theInterval)
    }
  },

  /**
   * 进入车辆详情页, catchtap 禁止事件向上冒泡，bindtap则不禁止事件向上冒泡
   */
  enterCarDetails(e) {
    var carId = e.currentTarget.dataset.carid;
    // 使用js动态导航跳转
    wx.navigateTo({
      url: "/pages/details/details?id=" + carId
    })
  },
  
  /**
   * 查看全部车辆信息，初始化显示5条
   */
  lookAllInfo(){
    this.setData({
      'theOnSaleCarList': this.data.onSaleCarAllInfo,
      'isShowAllView': true,
    });
  },
  
  // 了解平台规则
  knowRules(){
    // 使用js动态导航跳转
    wx.navigateTo({
      url: "/pages/video/video"
    })
  },
  
  /**
   * 拨打热线
   */
  toCallHotLine(){
    wx.makePhoneCall({
      phoneNumber: '4009009936' //仅为示例，并非真实的电话号码
    })
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