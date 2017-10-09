const util = require('../../../utils/util.js');
const Pin = require('../../../utils/pinyin.js');
const City = require('../../../utils/class/city.js');

const InitQuickLockHeight = 782;
const InitCitysLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'];
const InitHotCity = [
    { 'label': '全国', 'value': "" },
    { 'label': '北京', 'value': "北京市" },
    { 'label': '深圳', 'value': "深圳市" },
    { 'label': '上海', 'value': "上海市" },
    { 'label': '宁波', 'value': "宁波市" },
    { 'label': '武汉', 'value': "武汉市" },
    { 'label': '杭州', 'value': "杭州市" },
    { 'label': '长沙', 'value': "长沙市" },
    { 'label': '厦门', 'value': "厦门市" }
  ]

// pages/hall/city/city.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 窗口高度
    scrollHeight: 0,
    // 滚动条高度
    scrollTop: 0,

    // 侧边快速定位条 高度
    quickLockHeight: InitQuickLockHeight,

    // 热门城市
    hotCity: InitHotCity,
    // 城市信息
    citys: [],
    // 城市首拼集合
    citysLetter: InitCitysLetter,
    //所有城市列表
    allCityList: [],
    //仅仅所有城市列表
    onlyCityList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取城市信息数据
    this.getAllCityData();

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 获取城市信息数据
   */
  getAllCityData() {
    var that = this;

    var url = "https://www.muyouche.com/action2/AllCity.ashx";
    // 使用工具方法中封装好的POST方法
    util.GET(url, that.getAllCityDatasuccess);
  },

  /**
   * 获取全部城市数据成功的回调
   */
  getAllCityDatasuccess(res) {
    console.log("成功", res);
    this.setData({
      'allCityList': res.data
    })
    //更改城市list
    this.updateCityList();
  },

  /**
   * 格式化城市列表
   */
  normalizeCity(list) {
    var map = {}
    list.forEach((item, index) => {

      const key = item.key
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(new (City.cityInfo)({
        item: item
      }));
    })
    // 为了得到有序列表，我们需要处理 map
    var nature = []
    //循环map分别得到两个数组
    for (let key in map) {
      var val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        nature.push(val)
      }
    }
    //根据字母A-Za-z规则顺序排序
    nature.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0);
    })
    //将nature数据连接在around数据背后一起返回出去
    return nature;
  },

  /**
   * 更改城市list
   */
  updateCityList() {
    var newCityList = [];
    if (this.data.allCityList.length) {
      this.data.allCityList.forEach((value, index) => {
        if (this.isNotStreet(value.Code)) {
          newCityList.push(value)
        }
      })
      this.setData({
        'onlyCityList': newCityList
      })
      // 城市转拼音
      this.getCityToSpellList();
    }
  },

  /**
   * 不是街道(并且不是省)
   */
  isNotStreet(num) {
    return /^\d{4}(0)(0)$/.test(num) && !/^\d{2}(0){4}$/.test(num)
  },

  /**
   * 城市转拼音键首字母
   */
  getCityToSpellList() {
    var spellCityList = [];
    if (this.data.onlyCityList.length) {
      this.data.onlyCityList.forEach((value, index) => {
        var obj = {};
        obj.word = Pin.pinyin.getCamelChars(value.Name);
        obj.key = obj.word.substr(0, 1);
        Object.assign(value, obj);
        spellCityList.push(value)
      })
      var theCitysList = this.normalizeCity(spellCityList);
      // 循环获取城市索引首拼
      var citysLetter = [];
      for (let key in theCitysList) {
        var val = theCitysList[key]
        citysLetter.push(val.title)
      }

      // 赋值最终的城市数据
      this.setData({
        'citys': theCitysList,
        'citysLetter': citysLetter,
        'quickLockHeight': theCitysList.length > 0 ? (theCitysList.length + 2) * 34 : InitQuickLockHeight
      })

    }
  },

  /**
   * 确认选择城市
   */
  chooseCity(e){
    console.log(e);
    wx.setStorageSync('filter_data', {
      'city': e.currentTarget.dataset.city,
    })
    // 使用js动态导航跳转
    // wx.navigateTo({
    //   url: "/pages/hall/index"
    // })
    // 返回上一页
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 监听scroll-view的滚动 事件
   */
  scroll: function (event) {
    //  console.log("e",event)
  }


})