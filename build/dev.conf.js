const config = require('./config')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const utils = require('./utils')
const baseWebpackConfig = require('./base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const hljs = require('highlight')
// var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const path = require('path')
const entries = {}
const devRules = [
    ...utils.styleLoaders({
        sourceMap: config.dev.cssSourceMap,
        extract: config.dev.extract
    }),
    {
        test: /\.md$/,
        loader: 'vue-markdown-loader',
        options: {
            preprocess: function(markdownIt, source) {
                return source
            },
            use: [
                [
                    require('markdown-it'),
                    {
                        highlight: function(str, lang) {
                            if(lang && hljs.getLanguage(lang)) {
                                try {
                                    return hljs.highlight(lang, str).value
                                } catch (__) {}
                            }
                            return '' // use external default escaping
                        }
                    }
                ]
            ]
        }
    }
]
Object.keys(config.entry).forEach(each => {
    const opt = config.entry[each]
    entries[each] = opt.path
})
module.exports = merge(baseWebpackConfig, {
    entry: entries,
    module: {
        rules: devRules
    },
    devtool: '#cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin({'process.env': config.dev.env}),
        new webpack.NoEmitOnErrorsPlugin(),
        // 配置多页
        ...(function() {
            return Object.keys(config.entry).map(
                each =>
                    new HtmlWebpackPlugin({
                        template: './index.html',
                        filename: `${each}.html`,
                        inject: true,
                        chunks: ['vendors', each]
                    })
            )
        })(),
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            allChunks: false
        })
    ],
    devServer: {
        // 如果使用history模式.则需要配置重定向.
        historyApiFallback: {
            rewrites: [
                // 可以手动配置重定向
                // { from: /\//, to: '/app.html' },
                // 也可以根据entry自动生成
                // 规则是将 entryKey下的路由重定向到 entryKey.html
                ...(function() {
                    return Object.keys(config.entry).map(each => ({
                        from: new RegExp(each + '/'),
                        to: `/${each}.html`
                    }))
                })()
            ]
        },
        // 跨域代理
        proxy: {
            '/mock': {
                target: '',
                secure: false,
                pathRewrite: {
                    '^/mock':
                        'https://www.easy-mock.com/mock/59e8918c21a50c465d91d78f/tableMock'
                }
            }
        }
    }
})
