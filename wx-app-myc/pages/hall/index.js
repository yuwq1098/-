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
            indicatorColor: "#d0cdd1", // 指示点颜色
            indicatorActiveColor: "#04be02", // 指代当前轮播图片的指示点颜色
            autoplay: false, // 是否启用自动播放
            interval: 5000, // 定时播放时间间隔
            duration: 1000, // 轮播图片滑动的时间
            circular: true, // 是否衔接处理
        },
        // 匹配信息结果条数
        resTotal: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getB2bCarListInfo();
    },
    /**
     * 获取b2b汽车信息列表
     */
    getB2bCarListInfo(){
        var that = this;
        var data = {

        }
        wx.request({
          url: 'https://www.muyouche.com/action2/B2BCarList.ashx', 
          data: data,
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            that.setData({ "resTotal": res.data.total })
          }
        });
        //B2B车辆大厅列表
    // getB2BCarList(params){
    //     return fetchSign('/action2/B2BCarList.ashx', dataToJson(params))
    // },

    // //B2B车辆大厅列表详情
    // getCarDetalis(params){
    //     return fetchSign('/action2/B2BCarDetail.ashx', dataToJson(params))
    // },
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})