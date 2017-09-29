var webpack = require("webpack")
    // 提取 CSS 到单独的文件中
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    /*
     ** Headers of the page
     */
    head: {
        title: '这是喻文强尝试写的nuxt',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'keywords', name: 'keywords', content: 'geekyu、Geek.Yu、my project' },
            { hid: 'description', name: 'description', content: 'Nuxt.js project' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    /*
     ** Customize the progress bar color
     */
    css: [
        'assets/css/main.css'
    ],
    loading: { color: '#3B8070' },
    router: {
        middleware: 'stats'
    },
    postcss: [
        require('postcss-nested')(),
        require('postcss-responsive-type')(),
        require('postcss-hexrgba')(),
    ],

    /*
     ** Build configuration
     */
    build: {
        /*
         ** Run ESLint on save
         */
        extend(config, ctx) {
            if (ctx.dev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        },

        module: {
            loaders: [
                { test: /\.sass$/, loader: 'vue-style-loader!css-loader!sass-loader' },
                { test: /\.jade$/, loader: 'pug-loader' },
                { test: /\.coffee$/, loader: "coffee-loader" },
            ]
        },

        /**
         * 引入你的插件
         */
        plugins: [
            new webpack.ProvidePlugin({
                '$': 'jquery',
                '_': 'lodash'
                    // ...etc.
            }),
            // 提取 CSS 到单独的文件中
            new ExtractTextPlugin('app.bundle.css')
        ],

    }

}