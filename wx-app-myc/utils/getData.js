const util = require('./util.js');
const Pin = require('./pinyin.js');
const City = require('./class/city.js');

const cityData = {
  'citys': [],
  'citysLetter':  [],
  'currCity': "",
}

var allCityList = [],
    onlyCityList = [];

// var url_home = "https://www.muyouche.com/action2/HomePageInfo.ashx";
// // 获取当前城市
// util.GET(url_home,getCurrCitySuccess);
// // 获取定位城市数据成功的回调
// function getCurrCitySuccess(res){
//   cityData.currCity = res.data.UserInCity.Name;
// }

var url = "https://www.muyouche.com/action2/AllCity.ashx";
// 使用工具方法中封装好的POST方法
util.GET(url, getAllCityDatasuccess);



// 获取全部城市数据成功的回调
function getAllCityDatasuccess(res) {
  allCityList = res.data;
  //更改城市list
  updateCityList();
}

// 更改城市list   
function updateCityList() {
  var newCityList = [];
  if (allCityList.length) {
    allCityList.forEach((value, index) => {
      if (isNotStreet(value.Code)) {
        newCityList.push(value)
      }
    })
    onlyCityList = newCityList;
    // 城市转拼音
    getCityToSpellList();
  }
}

// 不是街道(并且不是省)
function isNotStreet(num) {
  return /^\d{4}(0)(0)$/.test(num) && !/^\d{2}(0){4}$/.test(num)
}

// 格式化城市列表
function normalizeCity(list) {
  var map = {}
  list.forEach((item, index) => {

    const key = item.key
    if (!map[key]) {
      map[key] = {
        title: key,
        items: []
      }
    }
    map[key].items.push(new (City.cityInfo)({
      item: item
    }));
  })
  // 为了得到有序列表，我们需要处理 map
  var nature = []
  //循环map分别得到两个数组
  for (let key in map) {
    var val = map[key]
    if (val.title.match(/[a-zA-Z]/)) {
      nature.push(val)
    }
  }
  //根据字母A-Za-z规则顺序排序
  nature.sort((a, b) => {
    return a.title.charCodeAt(0) - b.title.charCodeAt(0);
  })
  //将nature数据连接在around数据背后一起返回出去
  return nature;
}

// 城市转拼音键首字母
function getCityToSpellList() {
  var spellCityList = [];
  if (onlyCityList.length) {
    onlyCityList.forEach((value, index) => {
      var obj = {};
      obj.word = Pin.pinyin.getCamelChars(value.Name);
      obj.key = obj.word.substr(0, 1);
      Object.assign(value, obj);
      spellCityList.push(value)
    })
    var theCitysList = normalizeCity(spellCityList);
    // 循环获取城市索引首拼
    var theCitysLetter = ['定位', '热门'];
    for (let key in theCitysList) {
      var val = theCitysList[key]
      theCitysLetter.push(val.title)
    }

    // 赋值最终的城市数据
    cityData.citys = theCitysList;
    cityData.citysLetter = theCitysLetter;;
  }
}

module.exports = {
  cityData,
}
