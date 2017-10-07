const getters = require('../getter.js');

// b2b车辆信息构造类
class b2bCarInfo {
  constructor(data) {
    this.id = data.CarId || ""                          // 车辆ID
    // 首图
    this.imgUrl = data.FileUri ? data.FileUri + "?imageView2/3/w/400/h/300" : ""
    // ?imageMogr2/auto-orient
    this.name = data.Title || ""                        // 标题
    this.inCity = data.CarInCity || ""                  // 车辆所在城市
    this.plateDate = data.OnLicensePlateDate || ""      // 上牌时间
    this.mileage = data.Mileage || 0                    // 里程
    this.price = data.B2BPrice || 0                     // b2b价格
    this.retailPrice = data.RetailPrice || ""            // 普通价格
    this.shelveTime = data.ShelveTime || ""             // 上架时间或刷新上架时间

    this.cName = data.CDGName || ""                     // 车行名
    this.authType = data.AuthType || ""                 // 车行认证类别： 个人车行、企业车行
    this.hasInCart = data.HasInCart || ""               // 是否加入购物车
    this.isPartner = data.IsB2BPartner||false           // 是否为合作商身份
    this.isNewCar = data.IsNewCar||false                // 是否为新车

    /**
     * 在构造类中做字段过滤器
     */
    this.inCity = getters.cityFn(this.inCity);
    this.retailPrice = getters.priceToFixed(this.retailPrice, 2);
    this.shelveTime = getters.beforeFormatTime(this.shelveTime);
    // 当前商家身份
    this.theCDGType = this.isPartner ? "合作商" : this.authType;
    // 上牌年份
    this.plateDate = getters.dateFnToYear(this.plateDate);
    // 行驶里程
    this.mileage = getters.mileFn(this.mileage);

  }
}

// 在售车源信息的构造类
class onSaleCarInfo {
  constructor(data) {
    this.id = data.CarId || ""                        // 车辆id
    this.imgUrl = data.TitlePhoto ? data.TitlePhoto + "?imageView2/3/w/400/h/300" : ""               // 首图链接
    this.name = data.Title || ""                     // 标题
    this.inCity = data.CarInCity || ""                // 所在城市
    this.plateDate = data.OnLicensePlateDate || ""    // 上牌时间
    this.mileage = data.Mileage || ""                 // 里程
    this.price = data.B2BPrice || ""                  // 批发价
    this.retailPrice = data.RetailPrice || ""         // 普通市场价
    this.favorite = data.CarFavorite || false         // 是否收藏

    /**
     * 在构造类中做字段过滤器
     */
    this.inCity = getters.cityFn(this.inCity);
    this.retailPrice = getters.priceToFixed(this.retailPrice, 2);
    // 上牌年份
    this.plateDate = getters.dateFnToYear(this.plateDate);
    // 行驶里程
    this.mileage = getters.mileFn(this.mileage);
  }
}

// 导出
module.exports = {
  b2bCarInfo,
  onSaleCarInfo,
};