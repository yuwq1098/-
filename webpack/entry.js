

var container = document.createElement("div")
container.className="container"
console.log(container.classList);
container.classList.add("class_bad");
container.innerHTML = "欢迎来到喻文强的webpack，换了一下，他会重新打包";
document.body.appendChild(container);

// 1. require("!style-loader!css-loader!./style.css") // 载入 style.css
// loader可省略
// 2. require("!style!css!./style.css") // 载入 style.css

// 3. 打包时 => $ webpack entry.js bundle.js --module-bind 'css=style-loader!css-loader'
require("./style.css") // 载入 style.css
document.writeln("It yuwq works.\n");
document.writeln(require("./module.js"));

// 打印模块B输出的内容
document.writeln("打印moduleB.js输出的结果" + require("./moduleB.js"));
// 这是 CommonJS 同步加载模块




/**
 * $ webpack --progress --colors --watch
 * 监听代码变化，避免重新编译
 */

 /**
 * # 安装
 * $ npm install webpack-dev-server -g
 * # 运行
 * $ webpack-dev-server --progress --colors
 * 监听代码变化，避免重新编译，并且它将在 localhost:8080 启动一个 express 静态资源 web 服务器
 */

