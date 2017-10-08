const system = require('../system.js')

//b2c大厅数据筛选构造类
class filterDataClass {
  constructor(data) {
    this.series = data.series || ""                               // 车系
    this.carInCity = data.carInCity || "",                        // 车辆所在市
    this.price = data.price || ""                                 // 价格
    this.dischargeStandard = data.dischargeStandard || ""         // 排放标准
    this.color = data.color || ""                                 // 颜色
    this.sortType = data.sortType || ""                           // 搜索结果排序
  }
}

//用户向后台发起api请求的数据的构造类
class searchFilterClass {
  constructor(data) {
    // pageSize页面规格
    this.PageSize = data.PageSize || system.hall_list_page_size,
    this.PageIndex = data.PageIndex || "1",                                 // pageIndex当前页序 默认第1页
    this.CarSeriesId = data.CarSeriesId || "",                              // 车系id
    this.CarInCity = data.CarInCity || "",                                  // 车辆所在市
    this.DischargeStandard = data.DischargeStandard || "",                  // 排放标准, 国1, 国2, ...
    this.Color = data.Color || "",                                          // 颜色
    this.B2BPriceFrom = data.B2BPriceFrom || "",                            // 最低价格  0   (单位万元)
    this.B2BPriceTo = data.B2BPriceTo || "",                                // 最高价格  10  (单位万元)
    // 排序方式： string 价格最低、价格最高、车龄最短、里程最少、最近更新
    this.SortType = data.SortType || "",
    this.LikeKey = this.LikeKey || "",                                      // 模糊匹配关键字 车行、品牌、车型
    this.TS = this.data.TS||""                                              // 时间戳          
  }
}

module.exports = {
  filterDataClass,
  searchFilterClass
}