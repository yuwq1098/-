const util = require('../../../utils/util.js');
// 车系的构造类
const SERIES = require('../../../utils/class/series.js');

var brandId = 0;
var brandName = "";

// pages/hall/series/series.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 车系列表 
    seriesList: [],
    brandId: 0,
    brandName: "",
    brandImgUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // brandId = options.brandId || 1;
    // brandName = options.brandName || '奥迪';
    brandId = options.brandId;
    brandName = options.brandName;
    this.setData({
      'brandId': brandId,
      'brandName': brandName,
      'brandImgUrl': `https://www.muyouche.com/carbrandimg/${brandId}.png`
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var data = {
      brandid: brandId,
    }
    var url = "https://www.muyouche.com/action2/CarSeries.ashx";
    // 使用工具方法中封装好的POST方法
    util.POST(url, data,that.getAllSeriesDatasuccess);
  },
  

  /**
   * 使用b2c抽象类完成seriesInfo
   */
  normalizeSeriesInfo(list) {
    var map = {}
    list.forEach((item, index) => {
      const group = item.series_group_name
      if (!map[group]) {
        map[group] = {
          title: group,
          items: []
        }
      }
      map[group].items.push(new (SERIES.seriesInfo)(item));
    })
    return map;
  },

  /**
   * 获取全部车系信息成功的回调
   */
  getAllSeriesDatasuccess(res){
    var seriesList = this.normalizeSeriesInfo(res.data);
    this.setData({
      'seriesList': seriesList,
    })
  },

  // 选择车辆品牌
  chooseSeries(e) {
    var theSeriesId = e.currentTarget.dataset.seriesId;
    var theSeriesName = e.currentTarget.dataset.seriesName;
    var filter_data = wx.getStorageSync('filter_data') || {}
    // 当选择不限时，直接返回，车品牌和filter_data中的 品牌和车系 置空
    if (theSeriesId == 'all') {
      wx.setStorageSync('filter_data', {
        'city': filter_data.city || "",
        'brandId': brandId,
        'brandName': brandName,
        'seriesId': "",
        'seriesName': "",
      })
    } else {
      // 使用js动态导航跳转
      wx.setStorageSync('filter_data', {
        'city': filter_data.city || "",
        'brandId': brandId,
        'brandName': brandName,
        'seriesId': theSeriesId,
        'seriesName': theSeriesName,
      })
    }
    // 返回上一页
    wx.navigateBack({
      delta: 2
    })
  },

})