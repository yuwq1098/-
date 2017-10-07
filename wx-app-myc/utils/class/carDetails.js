const getters = require('../getter.js');

// 车辆基本信息的构造类
class basicInfo {
  constructor(data) {

    this.id = data.CarId || ""                          // 车辆id
    this.mid = data.MemberId || ""                      // 会员id
    this.vin = data.Vin || ""                           // 车架号
    this.title = data.Title || ""                       // 标题
    this.brandId = data.CarBrandId || ""                // 车品牌id
    this.seriesId = data.CarSeriesId || ""              // 车系id
    this.modelId = data.CarModelId || ""                // 车型id
    this.inProvince = data.CarInProvince || ""          // 车辆所在省
    this.inCity = data.CarInCity || ""                  // 车辆所在市
    // 车牌所在省
    this.plateInProvince = data.LicensePlateInProvince || ""
    // 车牌所在市
    this.plateInCity = data.LicensePlateInCity || ""
    // 排放标准
    this.dischargeStandard = data.DischargeStandard || ""
    // 排量
    this.liter = data.Liter || ""
    this.color = data.Color || "暂无数据"                   // 颜色
    this.plateDate = data.OnLicensePlateDate || ""       // 上牌日期
    this.outFactoryDate = data.OutFactoryDate || ""      // 出厂日期

    this.mileage = data.Mileage || 0                     // 里程
    this.price = data.B2BPrice || ""                     // B2b平台价格
    this.retailPrice = data.RetailPrice || ""            // 普通二手车价格

    // 营运性质
    this.serviceType = data.ServiceCharacteristics || ""
    // 年检过期日期
    this.annualDate = data.CarInspectionExpirationDate || ""
    // 强险过期日期
    this.compulsoryData = data.CompulsoryInsuranceExpiration || ""
    // 配置信息
    this.configuration = data.VehicleConfiguration || ""
    this.transferTimes = data.TransferTimes || 0          // 过户次数
    this.canTransfer = data.CanTransfer || true           // 能否过户
    this.keyCount = data.KeyCount || ""                   // 车钥匙数

    this.desc = data.CarDescription || ""                 // 车辆描述
    this.gearType = data.GearType || ""                   // 手、自动挡
    this.submitTime = data.SubmitTime || ""               // 提交时间
    this.status = data.Status || ""                       // 当前状态-2审核失败·-1下架·0待审核·1审核成功·2交易中·3交易完成
    this.checkTime = data.CheckTime || ""                 // 审核时间未审核则为null,有审核为“2017-01-01 00：00：00”
    this.checkMan = data.CheckMan || ""                   // 审核人员，未审核为null
    this.checkRemark = data.CheckRemark || ""             // 审核备注
    this.isPostToRetail = data.PostToRetailMarket || ""   // 是否发布到普通二手车市场
    this.shelveTime = data.ShelveTime || ""               // 上架或刷新上架时间

    /**
     * 在构造类中做字段过滤器
     */
    this.retailPrice = getters.priceToFixed(this.retailPrice, 2);
    // 上牌日期
    this.plateDate = getters.dateDayFormat(this.plateDate);
    // 行驶里程
    this.mileage = getters.mileFn(this.mileage);
    // 有否交强险
    this.compulsoryDataIsOut = getters.compulsoryDataIsOut(this.compulsoryData);
    // 综合油耗
    this.liter = getters.literFn(0);

  }
}

// 车况信息列表的构造类
class carOtherDetails {
  constructor(data) {
    this.id = data.DetailId || ""                         // 补充id
    this.cid = data.CarId || ""                           // 车辆id
    this.label = data.Label || ""                         // 补充对应的车况项目名：内饰、轮胎、钣金
    this.desc = data.Content || ""                        // 车况项目名对应的实际车况
    this.groupName = data.GroupName || ""                 // 所属分组
  }
}

// 文件列表的构造类
class fileInfoList {
  constructor(data) {

    this.id = data.FileId || ""                           // 文件id
    this.mid = data.MemberId || ""                        // 客户id
    this.type = data.FileType || ""                       // 文件类型img,sound
    this.title = data.Title || ""                         // 文件标题
    this.filePath = data.FilePath || ""                   // 文件路径(忽略）
    // 文件uri
    this.fileUrl = data.FileUri ? data.FileUri + "?imageView2/3/w/1200/h/900" : ""
    this.groupName = data.GroupName || ""                 // 分组名（车辆照片，录音描述、出厂铭牌）
    this.orderId = data.OrderId || ""                     // carID
    this.submitTime = data.SubmitTime || ""               // 提交时间
  }
}

// 其他信息的构造类
class otherInfo {
  constructor(data) {

    // 卖家头像
    // this.faceImgUrl = data.SellerPhotoUrl ? data.SellerPhotoUrl + "?imageView2/3/w/200/h/200" : require('/static/images/none-face.png')
    this.faceImgUrl = data.SellerPhotoUrl ? data.SellerPhotoUrl + "?imageView2/3/w/200/h/200" : ''
    this.tel = data.Mobile || ""                           // 联系电话
    this.browseCount = data.CountBrowse || ""              // 浏览量
    this.authType = data.AuthType || ""                    // 企业车行，个人车行（认证类别）
    this.contacter = data.ContactMan || ""                 // 联系人
    this.cdgName = data.CdgName || ""                      // 车行名
    this.address = data.CdgAddress || ""                   // 车行地址
    // 车行描述
    this.desc = data.CdgDescription || "该车行比较高冷，啥也没有说。"
    this.type = data.CdgType || ""                         // 车行类别（4S店，企业车行，批发市场等）
    this.isInCart = data.HasInCart || ""                   // 购物车：0=未收藏，1=已收藏
    this.isInFavorite = data.HasInFavorite || ""           // 收藏夹：0=未收藏，1=已收藏
    this.onSellCount = data.SellCarCount || ""             // 卖家在售车辆数，建议如果为0时，不要在ui展示

    this.theAuthType = this.authType=='个人车行'?'个人车商':'企业车商'
  }
}


// 导出
module.exports = {
  basicInfo,
  carOtherDetails,
  fileInfoList,
  otherInfo,
};