/* eslint-disable */
var path = require('path')
var config = require('./config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./base.conf')
// 直接将manifest写入到html中
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// webpack内置的不支持压缩es6,所以使用最原始的plugin压缩
const hljs = require('highlight')

var isProduction = process.env.NODE_ENV === 'production'
var env = !isProduction ? config.test.env : config.build.env
// console.log('now env is --->', env)
const entries = {}
const rules = [
  ...utils.styleLoaders({
    sourceMap: false,
    extract: true
  })
]
Object.keys(config.entry).forEach(each => {
  const opt = config.entry[each]
  entries[each] = opt.path
})
var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: entries,
  // 注入styleLoaders
  module: {
    rules: rules
  },
  output: {
    path: isProduction ? config.build.assetsRoot : config.test.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          parser: require('postcss-safe-parser')
        }, // 删除注释
        canPrint: true
      })
    ],
    /**
     *
     * 通过判断splitChunks.chunks的值来确定哪些模块会提取公共模块，该配置一共有三个选项，initial、async、 all。
     * 默认为async，表示只会提取异步加载模块的公共代码
     * initial表示只会提取初始入口模块的公共代码
     * all表示同时提取前两者的代码。
     */

    splitChunks: {
      chunks: 'initial',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      // name: false,
      name: false,
      cacheGroups: {
        commons: {
          name: 'commons',
          // chunks: 'initial',
          chunks: 'all',
          minChunks: 2,
          priority: 10,
          // enforce: true,
          reuseExistingChunk: true
        },
        vendor: {
          name: 'vendor',
          // chunks: 'initial',
          chunks: 'all',
          priority: 20,
          reuseExistingChunk: false,
          // enforce: true,
          test: /node_modules\/(.*)(\.js|\.css)$/
        }
      }
    }
  },
  plugins: [
    // 定义变量
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // 配置
    ...(function() {
      return Object.keys(config.entry).map(each => {
        return utils.HtmlCreator({
          title: config.entry[each].title,
          chunkName: each
        })
      })
    })(),
    // hash管理
    new webpack.HashedModuleIdsPlugin()
  ]
})

module.exports = webpackConfig
