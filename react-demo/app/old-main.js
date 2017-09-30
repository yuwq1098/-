'use strict';
var component = require('./component.js');
document.body.appendChild(component());

var moduleA = require("./modules/moduleA.js");
document.writeln(moduleA() + "\n")
document.writeln()

// import moduleB from './modules/moduleB.js';
define(['./modules/moduleB.js'], function(moduleB) {
    console.log(moduleB())
    console.log("完成了定义")
    document.writeln(moduleB())
        // document.writeln("\n" + moduleB())
        // console.log(moduleB)
});