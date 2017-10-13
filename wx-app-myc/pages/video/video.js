const util = require('../../utils/util.js');
const video = require('../../utils/class/video.js')


var videoObjs = [];
var InitVideoPlaying = [false,false,false,false];

// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 视频信息
    videos: [],
    // 正在播放信息
    playingList: InitVideoPlaying,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    var url = "https://www.muyouche.com/action2/AdvertisementVideo.ashx";
    // 使用工具方法中封装好的GET方法
    util.POST(url,{}, that.getVideoDataSuccess);
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
   * 格式化视频文件列表
   */
  normalizeVideosList(list) {
    let arr = [];
    list.forEach((item, index) => {
      arr.push(new (video.videosInfo)(item));
    })
    return arr;
  },
  
  /**
   * 获取视频广告信息
   */
  getVideoDataSuccess(res){
    var theVideoList = this.normalizeVideosList(res.data.AdvertisementVideo);
    this.setData({
      'videos': theVideoList,
    })
    console.log(theVideoList)
    // 获取播放中信息
    var playingList = [];
    for (let i = 0; i < theVideoList.length; i++){
      playingList.push(false);
    }
    InitVideoPlaying = playingList;
    this.setData({
      'playingList': playingList,
    })
  },
  
  /**
   * 进入播放器
   */
  enterPlayer(e){
    var theIndex = e.currentTarget.dataset.vindex;
    this.setPlayerInfo(theIndex);
  },
  
  /**
   * 设置播放器
   */
  setPlayerInfo(index){
    var playingList = this.data.playingList;
    this.setData({
      'playingList': InitVideoPlaying,
    })
    var thePlayingList = [];
    for (let i = 0; i < InitVideoPlaying.length; i++) {
      if (i == index && playingList[i]) continue;
      if (playingList[i]) {
        var thePlayer = wx.createVideoContext('v_0' + (i + 1));
        thePlayer.pause();
      }
      if (index == i) {
        thePlayingList.push(true);
      } else {
        thePlayingList.push(false);
      }
    }
    this.setData({
      'playingList': thePlayingList,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setPlayerInfo(-1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})