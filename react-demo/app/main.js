'use strict';

// import React from 'react';
// import { render } from 'react-dom'
// import Hello from './components/reactTest.jsx';


// var root = document.getElementById('app');

// render('< Hello />', root);

// import './components/App.js';

var component = require('./component.js');
document.body.appendChild(component());

var moduleA = require("./modules/moduleA.js");
document.writeln(moduleA() + "\n")

// var moduleB = require("./modules/moduleB.js");
// document.writeln(moduleB() + "\n")

// import moduleB from './modules/moduleB.js';
// document.writeln(moduleB() + "\n")

define(['./modules/moduleB.js'], function(moduleB) {
    console.log(moduleB())
    console.log("完成了定义")
    document.writeln(moduleB())
        // document.writeln("\n" + moduleB())
        // console.log(moduleB)
});