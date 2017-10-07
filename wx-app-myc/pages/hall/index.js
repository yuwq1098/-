const carInfo = require('../../utils/class/carInfo.js')
const util = require('../../utils/util.js')
const system = require('../../utils/system.js')

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
    // 今日新增
    todayNewsCount: 0,
    // b2b大厅搜索结果 车辆列表
    b2bCarList: [],

    // 当前加载的页数
    currPageIndex: 1,
    // 是否正在加载更多
    isLoadingMore: false,
    // 是否正在刷新
    isRefreshing: false,
    // 没有更多，已经滑到底线
    isNoneMore: false,
    // 第二次过底线,不做提示
    onceAgainNoneMore: false,
    // 列表单页加载大小
    listPageSize: system.hall_list_page_size,

    // 时间戳，翻页防止数据变动冲突
    TS: "",
    

    // 是否显示返回顶部
    isShowBackToTop: false,
    btt_active: '',

    // 窗口高度
    scrollHeight: 0,
    // 滚动条高度
    scrollTop: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getB2bCarListInfo(this.getHallCarListSuccess);
    wx.getSystemInfo({
      success: function (res) {
        console.info("窗口高度（不包含头部）", res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
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
  getB2bCarListInfo(callBack) {
    var that = this;
    var data = {
      // B2BPriceFrom: "",
      // B2BPriceTo: "",
      // CarBrandId: "",
      // CarInCity: "",
      // CarSeriesId: "",
      Color: "",
      // DischargeStandard: "",
      // GearType: "",
      // KeyCountFrom: "",
      // KeyCountTo: "",
      // MileageFrom: "",
      // MileageTo: "",
      // OnLicensePlateDateFrom: "",
      // OnLicensePlateDateTo: "",
      PageIndex: this.data.currPageIndex,
      PageSize: this.data.listPageSize,
      LikeKey: "",
      TS: this.data.TS,
      // ServiceCharacteristics: "",
      // SortType: "",
      // TransferTimesFrom: "",
      // TransferTimesTo: "",
    }
    var url = "https://www.muyouche.com/action2/B2BCarList.ashx";
    // 使用工具方法中封装好的POST方法
    util.POST(url, data, callBack);
  },

  /**
   * 成功获取数据的回调函数
   */
  getHallCarListSuccess(res) {
    console.log(res)
    var b2bCarList = this.normalizeB2bCarInfo(res.data);
    this.setData({
      "b2bCarList": b2bCarList,
      "resTotal": res.total,
      "todayNewsCount": res.TodayCnt,
      'TS': res.TS,
    })
    // 如果正在刷新，那么停止刷新特效
    if (this.data.isRefreshing) {
      this.setData({
        'isRefreshing': false,
      })
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 上拉加载新增数据的回调
   */
  getMoreDataSuccess(res) {
    console.log(res)
    var addsCarList = this.normalizeB2bCarInfo(res.data);
    var agoCarList = this.data.b2bCarList;
    var b2bCarList = agoCarList.concat(addsCarList);
    this.setData({
      "b2bCarList": b2bCarList,
      "resTotal": res.total,
      "todayNewsCount": res.TodayCnt,
    })
    // 关闭加载状态
    if (this.data.isLoadingMore) {
      this.setData({
        'isLoadingMore': false,
      })
    }
  },

  /**
   * 当页面索引到了最后一个时
   */
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
  enterCarDetails(e) {
    var carId = e.currentTarget.dataset.carid;
    // 使用js动态导航跳转
    wx.navigateTo({
      url: "/pages/details/details?id=" + carId
    })
  },

  /**
   * 上拉加载更多
   */
  pullToLode() {
    // 如果正在加载，那么就return
    if (this.data.isLoadingMore) return;
    // 如果没有多余的数据可加载，那么也return
    if (this.data.resTotal <= this.data.listPageSize * this.data.currPageIndex) {
      // 不允许再次过载
      this.setData({
        'isNoneMore': true,
      })
      setTimeout(()=>{
        this.setData({
          'isNoneMore': false,
          'onceAgainNoneMore': true,
        })
      },2500)
      return;
    };

    this.setData({
      'isLoadingMore': true,
    })
    var nextPageIndex = ++this.data.currPageIndex;
    // 请求数据
    this.getB2bCarListInfo(this.getMoreDataSuccess);
  },

  /**
   * 下拉刷新
   */
  refresh: function (e) {
    // 如果正在刷新，那么return
    if (this.data.isRefreshing) return;

    this.setData({
      'isRefreshing': true,
      'currPageIndex': 1,
    })
    wx.startPullDownRefresh();
    this.reset();
    this.getB2bCarListInfo(this.getHallCarListSuccess);
  },

  /**
   * 监听scroll-view的滚动 事件
   */
  scroll: function (event) {
    // 是否大于1.5的屏
    if (event.detail.scrollTop > Math.ceil(this.data.scrollHeight * 1.5)) {
      this.setData({
        "isShowBackToTop": true,
        'btt_active': 'active',
      });
    }else{
      this.setData({
        'btt_active': '',
      });
      setTimeout(()=>{
        this.setData({
          "isShowBackToTop": false,
        });
      },300);
      
    }
  },
  /**
   * 返回顶部
   */
  backToTop(){
    // 防止触发刷新，所以比0大了1
    this.setData({
      "scrollTop": 1,
    });
  },

  /**
   * 部分数据重置
   */
  reset(){
    this.setData({
      "isNoneMore": false,
      "onceAgainNoneMore": false,
      "TS": ""
    });
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