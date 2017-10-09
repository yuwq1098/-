// 城市构造类
class cityInfo {
  constructor({ item }) {
    this.code = item.Code;
    this.name = item.Name;
    this.key = item.key;
    this.word = item.word;
  }
}

// 导出
module.exports = {
  cityInfo
};