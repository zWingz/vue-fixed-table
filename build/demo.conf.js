/* eslint-disable */
var path = require('path')
var config = require('./config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var isProduction = process.env.NODE_ENV === 'production';
// 直接将manifest写入到html中
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// webpack内置的不支持压缩es6,所以使用最原始的plugin压缩
const UglifyEsPlugin = require('uglifyjs-webpack-plugin');

var env = !isProduction ?
    config.test.env :
    config.build.env
    // console.log('now env is --->', env)
const entries = {};
const devRules = utils.styleLoaders({
    sourceMap: config.dev.cssSourceMap,
    extract: config.dev.extract
});
Object.keys(config.entry).forEach(each => {
    const opt = config.entry[each]
    entries[each] = opt.path;
})
var webpackConfig = merge(baseWebpackConfig, {
    entry: entries,
    // 注入styleLoaders
    module: {
        rules: utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: config.build.extract })
    },
    output: {
        path: isProduction ? config.build.assetsRoot : config.test.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js'),
    },
    plugins: [
        // 定义变量
        new webpack.DefinePlugin({
            'process.env': env
        }),
        /**
         * 自动加载模块,而不必到处import或者require
         * 按需使用
         * 任何时候，当 identifier 被当作未赋值的变量时，module 就会自动被加载，并且 identifier 会被这个 module 输出的内容所赋值。（模块的 property 用于支持命名导出(named export)）。
         */
        // new webpack.ProvidePlugin({
        //     identifier: 'module1',
        // // ...
        // }),
        new UglifyEsPlugin({
            uglifyOptions: {
                ecma: 8,
                compress: {
                    // 在UglifyJs删除没有用到的代码时不输出警告  
                    warnings: false,
                    // 删除所有的 `console` 语句
                    // 还可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                }
            }
        }),
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
        }),
        // 使用cssnano来压缩以及优化css
        new OptimizeCSSPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true }, safe: true }, // 删除注释
            canPrint: true
        }),
        // 配置htmlWebpackPlugin
        ...(function() {
            return Object.keys(config.entry).map(each => {
                return utils.HtmlCreator({
                    title: config.entry[each].title,
                    chunkName: each
                })
            })
        })(),
        // webpack3.0新增, 
        // 因为webpack2处理后的每个模块都被一个函数包裹,会导致闭包函数增多降低代码效率
        // 用于减少打包后的闭包函数数量从而加快js执行速度
        new webpack.optimize.ModuleConcatenationPlugin(),
        // hash管理
        new webpack.HashedModuleIdsPlugin(),
        // 抽取nodeModule中的模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            // chunks: 'vendor'
            minChunks: function(module, count) {
                return (
                    module.resource && // 当前引用的资源
                    /\.js$/.test(module.resource) && // 只找js的
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0 // 同存在于node_modules中的
                )
            }
        }),
        // 提取manifest
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor'] // 只将这些打包进manifest中
        }),
        // 引入dll, 如有有需要的话.请先执行dll.conf.js完成dll的打包
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require("../dll/bundel.manifest.json"), // 务必与dll.conf.js中一致
        // })
    ]
})

module.exports = webpackConfig