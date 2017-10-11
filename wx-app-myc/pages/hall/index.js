const carInfo = require('../../utils/class/carInfo.js')
const util = require('../../utils/util.js')
const filter = require('../../data/localJson/filter.js')
const system = require('../../utils/system.js')

const InitCurrCity = "全国";
const InitCurrBrand = "不限品牌";

// pages/hall/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    // 当前选择城市
    currCity: InitCurrCity,
    // 当前选择车辆品牌
    currBrand: InitCurrBrand,
    // 显示loading组件
    isShowLoading: false,
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
    
    // 车辆品牌Id
    currBrandId: "",
    // 车系Id
    currSeriesId: "",

    // 当前加载的页数
    currPageIndex: 1,
    // 是否正在加载更多
    isLoadingMore: false,
    // 是否正在刷新
    isRefreshing: false,
    // 是否已加载过
    isLoadEnd: false,
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
    
    // 缺省容器高度
    nonoDataHeight: 400,

    // 搜索关键字
    searchKeywords: "",

    // 筛选信息
    filterData: {
      // 遮罩层是否显示
      theMaskIsShow: false,
      // 默认排序是否显示
      defaultSortIsShow: false,
      // 价格选择是否显示
      priceChoiceIsShow: false,
      // 排放方式选择是否显示
      standardChoiceIsShow: false,
    },

    // 当前打开的面板索引， 共3个，排序方式|价格选择|排放标准选择
    currPanelInde: "",

    // 当前所选筛选条件文本
    filterText: {
      'sort': "默认排序",
      'brand': "不限品牌",
      'price': "全部价格",
      'standard': "排放标准",
    },

    // 用户选择的筛选条件
    userFilterData: {},
    // 所选请求数据条件
    searchFilterData: {},

    // 选择数据
    choiceData: {
      sortSelect: filter.SortTypeList,
      standardSelect: filter.DischargeStandard,
      priceSelect: filter.SearchPriceRange,
    },

    // 用户当前选择的
    theCustomPrice: {
      priceText: "45万以下",
      currPrice_min: "",
      currPrice_max: "45",
      p_left: '0',
      p_width: '105',
      p_x1: 0,
      p_x2: 105,

    },

    // 滑块位置信息
    sliderPositionInfo: {
      slider_min: "48",
      slider_max: "328",
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    this.setData({
      'currCity': ''
    })
    wx.getSystemInfo({
      success: function (res) {
        // console.info("窗口高度（不包含头部）", res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight,
          nonoDataHeight: res.windowHeight - 271 + 14,
        });
      }
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // 关闭筛选面板
    this.closeAllPanelReal();

    var currCity = wx.getStorageSync('filter_data').city || InitCurrCity;
    var theBrandId = wx.getStorageSync('filter_data').brandId || "";
    var theBrandName = wx.getStorageSync('filter_data').brandName || "";
    var theSeriesId = wx.getStorageSync('filter_data').seriesId || "";
    var theSeriesName = wx.getStorageSync('filter_data').seriesName || "";
    
    // 设置所选城市展示文本
    var currCity = wx.getStorageSync('filter_data').city || InitCurrCity;
    var theCurrCity = this.data.currCity;
    
    // 设置所选品牌展示文本
    var currBrand = "";
    if (!!theBrandId == false){
      currBrand = InitCurrBrand;
    } else if (!!theBrandId && !!theSeriesId == false){
      currBrand = theBrandName;
    } else{
      currBrand = theSeriesName;
    }
    var theCurrCity = this.data.currBrand;

    // 如果（当前选择城市）&（当前选择品牌）未发生变化，则return
    if (theCurrCity == currCity && theCurrCity == currBrand) return;

    this.setData({
      'currCity': currCity,
      'currBrand': currBrand,
      'currBrandId': theBrandId,
      'currSeriesId': theSeriesId,
    })
    var that = this;
    // 显示加载数据动画
    wx.showLoading({
      title: '数据装载中...',
      mask: true,
      success: function () {
        that.setData({
          'isShowLoading': true,
        })
      }
    });
    
    this.getB2bCarListInfo(this.getHallCarListSuccess);

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

      CarInCity: this.data.currCity == "全国" ? "" : this.data.currCity,
      CarBrandId: this.data.currBrandId || "",
      CarSeriesId: this.data.currSeriesId ||"",
      // Color: "",
      DischargeStandard: this.data.searchFilterData.DischargeStandard || "",
      PageIndex: this.data.currPageIndex,
      PageSize: this.data.listPageSize,
      B2BPriceFrom: this.data.searchFilterData.B2BPriceFrom || "",
      B2BPriceTo: this.data.searchFilterData.B2BPriceTo || "",
      LikeKey: this.data.searchFilterData.LikeKey || "",
      TS: this.data.TS,
      SortType: this.data.searchFilterData.SortType || "",
    }
    var url = "https://www.muyouche.com/action2/B2BCarList.ashx";
    // 使用工具方法中封装好的POST方法
    util.POST(url, data, callBack);
  },

  /**
   * 成功获取数据的回调函数
   */
  getHallCarListSuccess(res) {
    
    var b2bCarList = this.normalizeB2bCarInfo(res.data);
    // 如果loading动画正在显示
    if (this.data.isShowLoading) {
      setTimeout(() => {
        wx.hideLoading();
        this.setData({
          'isShowLoading': false,
        })
      }, 100)
    }
    this.setData({
      "isLoadEnd": true,
      "b2bCarList": b2bCarList,
      "resTotal": res.total,
      "todayNewsCount": res.TodayCnt,
      'TS': res.TS,
      'isShowLoading': false,
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
      setTimeout(() => {
        this.setData({
          'isNoneMore': false,
          'onceAgainNoneMore': true,
        })
      }, 2500)
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

    var that = this;
    // 显示加载数据动画
    // wx.showLoading({
    //   title: '数据刷新中...',
    //   mask: true,
    //   success: function () {
    //     that.setData({
    //       'isShowLoading': true,
    //     })
    //   }
    // })

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
    // 关闭所有面板
    this.closeAllPanelReal();
    // 是否大于1.5的屏
    if (event.detail.scrollTop > Math.ceil(this.data.scrollHeight * 1.5)) {
      this.setData({
        "isShowBackToTop": true,
        'btt_active': 'active',
      });
    } else {
      this.setData({
        'btt_active': '',
      });
      setTimeout(() => {
        this.setData({
          "isShowBackToTop": false,
        });
      }, 300);

    }
  },
  /**
   * 返回顶部
   */
  backToTop() {
    // 防止触发刷新，所以比0大了1
    this.setData({
      "scrollTop": 1,
    });
  },

  /**
   * 部分数据重置
   */
  reset() {
    this.setData({
      "isNoneMore": false,
      "onceAgainNoneMore": false,
      "TS": ""
    });
  },

  /**
   * 城市选择(页面跳转)
   */
  citySelection() {
    // 使用js动态导航跳转
    wx.navigateTo({
      url: "/pages/hall/city/city"
    })
  },

  /**
   * 品牌选择（页面跳转）
   */
  brandSelection() {
    // 使用js动态导航跳转
    wx.navigateTo({
      url: "/pages/hall/brand/brand"
    })
  },

  /**
   * 关键词输入
   */
  keywordSrcInput(e) {
    var theValue = e.detail.value;
    this.setData({
      'searchKeywords': theValue,
    })
  },

  /**
   * 关键词搜索
   */
  keywordSearch() {
    var theKeywords = this.data.searchKeywords;
    this.setData({
      'searchFilterData.LikeKey': theKeywords,
    })
    // 重新拉取数据（带过滤条件）
    this.getNewB2bCarList();
  },

  /**
   * 打开/关闭 排序方式选择面板
   */
  openSortChoice() {
    this.closeAllPanel(1);
    if (this.data.filterData.defaultSortIsShow) {
      this.setData({
        'currPanelInde': "",
        'filterData.theMaskIsShow': false,
        'filterData.defaultSortIsShow': false,
      })
    } else {
      this.setData({
        'currPanelInde': 1,
        'filterData.theMaskIsShow': true,
        'filterData.defaultSortIsShow': true,
      })
    }
  },

  /**
   * 打开/关闭 价格选择面板
   */
  openPriceChoice() {
    this.closeAllPanel(2);
    if (this.data.filterData.priceChoiceIsShow) {
      this.setData({
        'currPanelInde': "",
        'filterData.theMaskIsShow': false,
        'filterData.priceChoiceIsShow': false,
      })
    } else {
      this.setData({
        'currPanelInde': 2,
        'filterData.theMaskIsShow': true,
        'filterData.priceChoiceIsShow': true,
      })
    }
  },

  /**
   * 打开/关闭 排放标准选择面板
   */
  openStandardChoice() {
    this.closeAllPanel(3);
    if (this.data.filterData.standardChoiceIsShow) {
      this.setData({
        'currPanelInde': "",
        'filterData.theMaskIsShow': false,
        'filterData.standardChoiceIsShow': false,
      })
    } else {
      this.setData({
        'currPanelInde': 3,
        'filterData.theMaskIsShow': true,
        'filterData.standardChoiceIsShow': true,
      })
    }
  },

  /**
   * 关闭所有面板(有条件的)
   */
  closeAllPanel(parmas) {
    // 利用 data-close-parmas 传参
    if (parmas.type == 'tap' && parmas.currentTarget.dataset.closeParmas == "all") {
      this.closeAllPanelReal();
      return;
    }
    // 当前面板被切换了后将会重置面板数据
    if (this.data.currPanelInde && this.data.currPanelInde != parmas) {
      this.setData({
        'currPanelInde': "",
        'filterData.defaultSortIsShow': false,
        'filterData.priceChoiceIsShow': false,
        'filterData.standardChoiceIsShow': false,
      })
    }
  },

  /**
   * 关闭所有面板(完全的)
   */
  closeAllPanelReal() {
    this.setData({
      'currPanelInde': "",
      'filterData.theMaskIsShow': false,
      'filterData.defaultSortIsShow': false,
      'filterData.priceChoiceIsShow': false,
      'filterData.standardChoiceIsShow': false,
    })
  },

  /**
   * 排序规则切换
   */
  changeSort(e) {
    var theKey = e.currentTarget.dataset.key;
    var theLabel = e.currentTarget.dataset.label;
    this.setData({
      'userFilterData.sortType': theLabel,
      'searchFilterData.SortType': theKey == '-1' ? '' : theKey,
      'filterText.sort': theLabel,
    });
    // 关闭所有面板(完全的)
    this.closeAllPanelReal();
    // 重新拉取数据（带过滤条件）
    this.getNewB2bCarList();
  },

  /**
   * 排放标准切换
   */
  changeStandard(e) {
    var theKey = e.currentTarget.dataset.key;
    var theLabel = e.currentTarget.dataset.label;
    // 显示在首页的文本
    var theShowText = "";
    switch (theLabel) {
      case '不限':
        theShowText = "排放标准";
        break;
      case this.data.choiceData.standardSelect[3].label:
        theShowText = "国3";
        break;
      default:
        theShowText = theLabel;
        break;
    }
    // 设置相关data
    this.setData({
      'userFilterData.dischargeStandard': theLabel,
      'searchFilterData.DischargeStandard': theLabel == '不限' ? '' : theLabel,
      'filterText.standard': theShowText,
    });
    // 关闭所有面板(完全的)
    this.closeAllPanelReal();
    // 重新拉取数据（带过滤条件）
    this.getNewB2bCarList();
  },

  /**
   * 价格区间选择
   */
  changePrice(e) {
    var theLabel = e.currentTarget.dataset.label;
    var max = e.currentTarget.dataset.max;
    var min = e.currentTarget.dataset.min;
    this.setData({
      'userFilterData.price': theLabel,
      'searchFilterData.B2BPriceFrom': min == '不限价格' ? '' : min,
      'searchFilterData.B2BPriceTo': max == '不限价格' ? '' : max,
      'filterText.price': theLabel == '不限价格' ? '全部价格' : theLabel,
    });
    // 关闭所有面板(完全的)
    this.closeAllPanelReal();
    // 重新拉取数据（带过滤条件）
    this.getNewB2bCarList();
  },

  s1TouchMove(e) {

    var sliderMin = this.data.sliderPositionInfo.slider_min;
    var pageX = e.touches[0].pageX;
    // 边界值判断
    if (pageX < sliderMin) {
      pageX = sliderMin;
    } else if (pageX >= this.data.sliderPositionInfo.slider_max * (205/240)) {
      pageX = this.data.sliderPositionInfo.slider_max * (205 / 240);
    }
    // 两个滑块边界碰撞
    if (pageX >= this.data.theCustomPrice.p_x2 + Number(sliderMin)) {
      pageX = this.data.theCustomPrice.p_x2 + Number(sliderMin);
    }

    // 滑块的left值
    var theBlockLeft = pageX - sliderMin;
    // 滑块区间  相关样式
    var theSliderLeft = theBlockLeft + 6;
    var theSliderWidth = this.data.theCustomPrice.p_x2 - theBlockLeft;

    this.setData({
      'theCustomPrice.p_x1': theBlockLeft,
      'theCustomPrice.p_left': theSliderLeft,
      'theCustomPrice.p_width': theSliderWidth,
    });
    // 设置自定义价格相关数据
    this.renderCustomPrice();
  },

  s2TouchMove(e) {

    var sliderMin = this.data.sliderPositionInfo.slider_min;
    var pageX = e.touches[0].pageX;
    // 边界值判断
    if (pageX < sliderMin) {
      pageX = sliderMin;
    } else if (pageX >= this.data.sliderPositionInfo.slider_max) {
      pageX = this.data.sliderPositionInfo.slider_max;
    }
    // 两个滑块边界碰撞
    if (pageX <= this.data.theCustomPrice.p_x1 + Number(sliderMin)) {
      pageX = this.data.theCustomPrice.p_x1 + Number(sliderMin);
    }

    // 滑块的left值
    var theBlockLeft = this.data.theCustomPrice.p_x1;
    // 滑块区间  相关样式
    var theSliderLeft = theBlockLeft + 6;
    var theSliderWidth = pageX - theBlockLeft - sliderMin;

    this.setData({
      'theCustomPrice.p_x2': pageX - sliderMin,
      'theCustomPrice.p_left': theSliderLeft,
      'theCustomPrice.p_width': theSliderWidth,
    });
    // 设置自定义价格相关数据
    this.renderCustomPrice();
  },

  /**
   * 设置自定义价格相关数据
   */
  renderCustomPrice() {
    var min = Math.ceil(this.data.theCustomPrice.p_x1 / (2.80 / 1.2));
    var max = Math.ceil(this.data.theCustomPrice.p_x2 / (2.80 / 1.2));
    var search_min = "";
    var search_max = "";
    // 设置自定义的文本
    var theCustomPriceText = "";
    if (min == 0 && max == "120") {
      theCustomPriceText = "不限价格"
    } else if (min == 0 && max != "120") {
      theCustomPriceText = max + "万以下";
      search_min = "";
      search_max = max;
    } else if (min != 0 && max == "120") {
      theCustomPriceText = min + "万以上";
      search_min = min;
      search_max = "";
    } else {
      theCustomPriceText = min + "-" + max + "万";
      search_min = min;
      search_max = max;
    }

    this.setData({
      'theCustomPrice.priceText': theCustomPriceText,
      'theCustomPrice.currPrice_min': search_min,
      'theCustomPrice.currPrice_max': search_max,
    })
  },

  /**
   * 确认自定义选择价格
   */
  confirmCustomPrice() {
    var min = this.data.theCustomPrice.currPrice_min;
    var max = this.data.theCustomPrice.currPrice_max;
    var theLabel = this.data.theCustomPrice.priceText;
    this.setData({
      'userFilterData.price': theLabel,
      'searchFilterData.B2BPriceFrom': min == '不限价格' ? '' : min,
      'searchFilterData.B2BPriceTo': max == '不限价格' ? '' : max,
      'filterText.price': theLabel == '不限价格' ? '全部价格' : theLabel,
    });
    // 关闭所有面板(完全的)
    this.closeAllPanelReal();
    // 重新拉取数据（带过滤条件）
    this.getNewB2bCarList();
  },


  /**
   * 重新拉取数据（带过滤条件）
   */
  getNewB2bCarList() {
    // 本地存储（同步）
    // try {
    //   wx.setStorageSync("userFilterData", this.data.userFilterData);
    // } catch (error) {
    //   console.log(error);
    // }
    // 设置本地存储（异步）
    // wx.setStorage({
    //   key: "searchFilterData",
    //   data: this.data.searchFilterData,
    //   success: callBack
    // });


    var that = this;
    callBack();
    // 回调
    function callBack() {
      // 显示加载数据动画
      wx.showLoading({
        title: '数据刷新中...',
        mask: true,
        success: function () {
          that.setData({
            'isShowLoading': true,
            'isLoadEnd': false,
          })
        }
      })

      that.setData({
        'currPageIndex': 1,
      })
      that.reset();
      that.getB2bCarListInfo(that.getHallCarListSuccess);
    }

  },

  /**
   * 价格选择移动
   */
  oppo(e) {
    console.log(e);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 如果loading动画正在显示
    if (this.data.isShowLoading) {
      setTimeout(() => {
        wx.hideLoading();
        this.setData({
          'isShowLoading': false,
        })
      }, 100)
    }
  },

})