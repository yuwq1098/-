var webpack = require('webpack')

module.exports = {
    entry: './entry.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.css$/,loader: 'style-loader!css-loader'}
        ]
    },
    // 载入插件（配置及运行）
    plugins: [
        new webpack.BannerPlugin("这是我写的一段注释，怎么样")
    ]
}

/**
 * package.json 可以执行npm init创建
 * 配置了webpack后，执行webpack时，不需要 webpack entry.js bundle.js
 * 只需要 webpack 即可
 */

 /**
  * 可以看见webpack打包的信息（包括打包进度和有色内容提示）
  */
// $ webpack --progress --colors