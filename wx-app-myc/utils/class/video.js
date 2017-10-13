
// 视频构造类
class videosInfo {
  constructor(data) {
    this.title = data.Title
    this.author = "南昌小目标车网"
    this.url = data.VideoUrl
    this.poster = "https://www.muyouche.com/pc/b2b/static/img/u-video-ditu.39d8c91.png"
    this.isPlaying = false

  }
}

// 导出
module.exports = {
  videosInfo
};