var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        // 配置热刷新模块后  ， pageage.json 的 dev 中，--hot 要去除
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8080',
        path.resolve(__dirname, 'app/main.js')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    // 加载热刷新插件
    plugins: [new HtmlWebpackPlugin(), new webpack.HotModuleReplacementPlugin()]
};