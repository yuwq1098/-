/**
 * 计算已过去的时间
 */
const beforeFormatTime = (str) => {
  if (!str) return ''
  var date = new Date(str.replace(/[-]/g, '/'));
  var time = new Date().getTime() - date.getTime();

  if (time < 0) {
    return '刚刚'
  } else if ((time / 1000 < 30)) {
    return '刚刚'
  } else if (time / 1000 < 60) {
    return parseInt((time / 1000)) + '秒前'
  } else if ((time / 60000) < 60) {
    return parseInt((time / 60000)) + '分钟前'
  } else if ((time / 3600000) < 24) {
    return parseInt(time / 3600000) + '小时前'
  } else if ((time / 86400000) < 31) {
    return parseInt(time / 86400000) + '天前'
  } else if ((time / 2592000000) < 12) {
    return parseInt(time / 2592000000) + '月前'
  } else {
    return parseInt(time / 31536000000) + '年前'
  }
}

/**
 * 价格小数加零,单位万
 */
const priceToFixed = (data, num = 1) => {
  var number = data || 0;
  return parseFloat(number).toFixed(num) + "万"
}

/**
 * 城市单位去空，江西省=>江西
 */
const cityFn = (str) => {
  if (!str && str != 0) return;
  return str.replace(/['省'|'市']/g, '')
}

/**
 * 转换成 year no + '年'
 */
const dateFnToYear = (data) => {
  if (!data && data != 0) return;
  var data = data && data.substr(0, 4) + '年';
  return data.toString();
}

/**
 * 转换成 xx.xx 万公里
 */
export const mileFn = (data, num = 1) => {
  var number = data || 0;
  return parseInt(number).toFixed(num) + "万公里"
}

module.exports = {
  beforeFormatTime,
  priceToFixed,
  cityFn,
  dateFnToYear,
  mileFn
}

