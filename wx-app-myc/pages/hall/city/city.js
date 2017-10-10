const util = require('../../../utils/util.js');
const Pin = require('../../../utils/pinyin.js');
const City = require('../../../utils/class/city.js');

var APP = getApp();

const InitQuickLockHeight = 782;
const InitActCity = {
  local: "定位",
  index: "0",
};
const InitCitysLetter = ['定位','热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'];
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

// 定位条的当前索引位置索引
var touchBarMoveLocal = "";
// 偏移量
var touchMoveOffset = "";
// 延时定时器
var myClear = null;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 窗口高度
    scrollHeight: 0,
    // 滚动条高度
    scrollTop: 0,

    // 滚动到指定视口
    toView: 'v_dw',

    // 侧边快速定位条 高度
    quickLockHeight: InitQuickLockHeight,
    // 当前所选城市
    currCity: {
      'label': "定位中...",
      'value': "",
    },
    // 当前选中的快速定位索引条
    act_local: InitActCity.local,
    act_index: InitActCity.index,
    // 显示当前选中的定位索引
    act_show: false,
    act_show_text: "", 

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
    if (APP.globalData.cityInfo.citys.length>0){
      // 直接赋值（通过全局变量）
      this.directAssignment();
      return;
    }
    var url = "https://www.muyouche.com/action2/AllCity.ashx";
    // 使用工具方法中封装好的POST方法
    util.GET(url, that.getAllCityDatasuccess);
  },
  
  /**
   * 直接赋值（通过全局变量）
   */
  directAssignment(){
    var theCitysList = APP.globalData.cityInfo.citys;
    var citysLetter = APP.globalData.cityInfo.citysLetter;
    var currCity = APP.globalData.cityInfo.currCity;
    this.setData({
      'citys': theCitysList,
      'citysLetter': citysLetter,
      'quickLockHeight': citysLetter.length > 0 ? (citysLetter.length) * 34 : InitQuickLockHeight,
      'currCity.label': currCity,
      'currCity.value': currCity,
    });
  },

  /**
   * 获取全部城市数据成功的回调
   */
  getAllCityDatasuccess(res) {
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
      var citysLetter = ['定位','热门'];
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
   * 城市快速定位条的 开始触摸 事件
   */
  touchIndexesStart(e){
    // 如果定时器在走，那么直接清了它
    if (!!myClear) {
      clearTimeout(myClear);
      myClear = null;
    }
    var curr_act_index = e.currentTarget.dataset.indexes;
    var index = e.currentTarget.dataset.index;
    touchBarMoveLocal = e.touches[0].pageY;
    // 跳转到指定视口
    this.scrollIntoView(curr_act_index);
    this.setData({
      'act_local': curr_act_index,
      'act_index': index,
      'act_show': true,
      'act_show_text': curr_act_index.substr(0,1), 
    })
  },

  /**
   * 城市快速定位条的 触摸滑动 事件
   */
  touchIndexesMove(e) {
    return;
    // 如果定时器在走，那么直接清了它
    if (!!myClear) {
      clearTimeout(myClear);
      myClear = null;
    }

    var theActIndex = this.data.act_index;
    var citysLetter = this.data.citysLetter;

    touchMoveOffset = e.touches[0].pageY - touchBarMoveLocal;
    var offsetIndex = Math.round(touchMoveOffset / 17);
    
    // 计算出当前索引值所在的位置
    var theIndex = "";
    if (offsetIndex + theActIndex <= 0){
      theIndex = 0;
    } else if (offsetIndex + theActIndex >= citysLetter.length - 1){
      theIndex = citysLetter.length - 1;
    }else{
      theIndex = offsetIndex + theActIndex;
    }
    // 跳转到指定视口
    this.scrollIntoView(citysLetter[theIndex]);
    if (this.data.act_local != citysLetter[theIndex]){
      this.setData({
        'act_local': citysLetter[theIndex],
        'act_show': true,
        'act_show_text': citysLetter[theIndex].substr(0, 1),
      })
    }
    
  },
  
  /**
   * 城市快速定位条的 停止触摸 事件
   */
  touchIndexesEnd(){
    touchBarMoveLocal = "";
    touchMoveOffset = "";
    // 延时执行
    myClear = setTimeout(() => {
      this.setData({
        'act_show': false,
      })
      myClear = null;
    }, 500)
  },
  
  /**
   * 滚动到指定视口
   */
  scrollIntoView(parmas){
    var toView = "";
    if (parmas=="定位"){
      toView = "v_dw";
    } else if (parmas == "热门"){
      toView = "v_rm";
    } else {
      toView = "v_" + parmas;
    }
    this.setData({
      'toView': toView
    })
  },

})