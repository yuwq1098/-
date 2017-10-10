const util = require('../../../utils/util.js');
// 车系的构造类
const SERIES = require('../../../utils/class/series.js');

var brandId = 0;
// pages/hall/series/series.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    brandId = options.brandId||1;
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
    console.log(seriesList);
  },

})