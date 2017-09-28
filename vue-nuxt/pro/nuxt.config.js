var webpack = require("webpack")

const vueLoader = webpackConfig.module.rules.find((rule) => rule.loader === 'vue-loader')
vueLoader.options.loaders.sass = 'vue-style-loader!css-loader!sass-loader';

module.exports = {
    /*
     ** Headers of the page
     */
    head: {
        title: 'pro',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
        /**
         * 引入你的插件
         */
        plugins: [
            new webpack.ProvidePlugin({
                '$': 'jquery',
                '_': 'lodash'
                    // ...etc.
            })
        ],

    }

}