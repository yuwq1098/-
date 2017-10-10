const util = require('../../../utils/util.js');
// 汽车品牌的构造类
const BRAND = require('../../../utils/class/brand.js');

const InitQuickLockHeight = 782;
const InitActBrand = {
  local: "热门",
  index: "0",
};
const InitBrandsLetter = ['热门', '*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'];
// 初始化热门品牌
const InitHotBrand = [
  { 'brand_name': '大众', 'brand_id': "36", 'img_path': "https://www.muyouche.com/carbrandimg/36.png"},
  { 'brand_name': '本田', 'brand_id': "7", 'img_path': "https://www.muyouche.com/carbrandimg/7.png"},
  { 'brand_name': '奥迪', 'brand_id': "1", 'img_path': "https://www.muyouche.com/carbrandimg/1.png"},
  { 'brand_name': '众泰', 'brand_id': "208", 'img_path': "https://www.muyouche.com/carbrandimg/208.png"},
  { 'brand_name': '一汽', 'brand_id': "196", 'img_path': "https://www.muyouche.com/carbrandimg/196.png"},
  { 'brand_name': '雪铁龙', 'brand_id': "189", 'img_path': "https://www.muyouche.com/carbrandimg/189.png"},
  { 'brand_name': '雪佛兰', 'brand_id': "188", 'img_path': "https://www.muyouche.com/carbrandimg/188.png"},
  { 'brand_name': '现代', 'brand_id': "187", 'img_path': "https://www.muyouche.com/carbrandimg/187.png"},
  { 'brand_name': '荣威', 'brand_id': "155", 'img_path': "https://www.muyouche.com/carbrandimg/155.png" },
  { 'brand_name': '日产', 'brand_id': "154", 'img_path': "https://www.muyouche.com/carbrandimg/154.png"},
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
    // 热门品牌
    hotBrand: InitHotBrand,
    // 全部车辆品牌
    brands: [], 
    // 品牌首拼集合
    brandsLetter: InitBrandsLetter,
    
    // 滚动到指定视口
    toView: 'v_rm',

    // 侧边快速定位条 高度
    quickLockHeight: InitQuickLockHeight,
    // 当前选中的快速定位索引条
    act_local: InitActBrand.local,
    act_index: InitActBrand.index,
    // 显示当前选中的定位索引
    act_show: false,
    act_show_text: "", 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取车品牌信息
    this.getB2BCarBrandList();
    var that = this;
    // 获取本机信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });
  },
  
  /**
   * 使用b2c抽象类完成brandInfo
   */
  normalizeBrandInfo(list) {
    let map = {}
    list.forEach((item, index) => {
      const key = item.key_word
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(new (BRAND.brandInfo)(item));
    })
    // 为了得到有序列表，我们需要处理 map
    let nature = []
    //循环map分别得到两个数组
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        nature.push(val)
      }
    }

    //根据字母A-Za-z规则顺序排序
    nature.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0);
    })
    return nature;
  },
  
  /**
   * 获取B2B车辆品牌列表
   */
  getB2BCarBrandList() {
    
    var that = this;
    var url = "https://www.muyouche.com/action2/CarBrand.ashx";
    // 使用工具方法中封装好的POST方法
    util.GET(url, that.getAllBrandDatasuccess);

  },
  
  /**
   * 获取全部汽车品牌成功的回调
   */
  getAllBrandDatasuccess(res){
    var brandList = this.normalizeBrandInfo(res.data);
    // 循环获取品牌索引首拼
    var brandsLetter = ['热门', '*'];
    for (let key in brandList) {
      var val = brandList[key]
      brandsLetter.push(val.title)
    }
    this.setData({
      'brands': brandList,
      'brandsLetter': brandsLetter,
      'quickLockHeight': brandList.length > 0 ? (brandList.length + 2) * 34 : InitQuickLockHeight
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
   * 城市快速定位条的 开始触摸 事件
   */
  touchIndexesStart(e) {
    // 如果定时器在走，那么直接清了它
    if (!!myClear){
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
      'act_show_text': curr_act_index.substr(0, 1),
    })
  },

  /**
   * 城市快速定位条的 停止触摸 事件
   */
  touchIndexesEnd() {
    touchBarMoveLocal = "";
    touchMoveOffset = "";
    // 延时执行
    myClear = setTimeout(()=>{
      this.setData({
        'act_show': false,
      })
      myClear = null;
    },500)
    
  },

  /**
   * 滚动到指定视口
   */
  scrollIntoView(parmas) {
    var toView = "";
    if (parmas == "热门") {
      toView = "v_rm";
    } else if (parmas == "*") {
      toView = "v_bx";
    } else {
      toView = "v_" + parmas;
    }
    this.setData({
      'toView': toView
    })
  },

  // 选择车辆品牌
  chooseBrand(e){
    var theBrandId = e.currentTarget.dataset.brandId;
    var filter_data = wx.getStorageSync('filter_data') || {}
    // 当选择不限时，直接返回，车品牌和filter_data中的 品牌和车系 置空
    if(theBrandId=='all'){
      wx.setStorageSync('filter_data', {
        'city': filter_data.city||"",
        'brandId': "",
        'seriesId': "",
      })
      // 返回上一页
      wx.navigateBack({
        delta: 1
      })
    }else{
      // 使用js动态导航跳转
      wx.navigateTo({
        url: "/pages/hall/series/series?brandId=" + theBrandId
      })
    }
  },

})