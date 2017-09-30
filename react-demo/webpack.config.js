var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
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
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                // 排除node_modules目录下的文件, npm安装的包不需要编译
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                // 匹配.css文件
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                ]
            },
            {
                // 匹配.less文件
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            }
        ]
    },

    // 加载热刷新插件
    plugins: [
        new HtmlWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;