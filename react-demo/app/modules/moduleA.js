var speakText = "我想说什么我说了算";

// import utils from "/utils.js"

// // ES6 相对路径
// import utils from './../utils.js';

// // ES6 绝对路径
// import utils from '/utils.js';

// CommonJS 相对路径
var utils = require('./../utils.js');

// CommonJS 绝对路径
// var utils = require('/utils.js');

module.exports = function() {
    return utils.addString(speakText)
}