
// 车品牌构造类
class brandInfo {
  constructor(data) {
    this.id = data.brand_id
    this.name = data.brand_name
    this.key = data.key_word
    this.imgUrl = `https://www.muyouche.com/carbrandimg/${data.brand_id}.png`
  }
}

// 导出
module.exports = {
  brandInfo
};