
// 车系构造类
class seriesInfo {
  constructor(data) {
    this.id = data.series_id
    this.bid = data.brand_id
    this.name = data.series_name
    this.gName = data.series_group_name
  }
}

// 导出
module.exports = {
  seriesInfo
};