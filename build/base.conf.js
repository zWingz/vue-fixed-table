const path = require('path')
const config = require('./config')
const utils = require('./utils')
const projectRoot = path.resolve(__dirname, '../')
const isProduction = process.env.NODE_ENV !== 'development'
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const hljs = require('highlight')

module.exports = {
  output: {
    path: isProduction ? config.build.assetsRoot : config.test.assetsRoot,
    publicPath: isProduction
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    filename: '[name].js',
    chunkFilename: '[name].js', // so that import('module') creates module.js
    sourceMapFilename: '[file].map'
  },
  // require 解析
  resolve: {
    extensions: ['.js', '.vue', '.scss', '.css'], // 当require找不到模块添加后缀
    modules: [path.join(__dirname, '../src'), 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      assets: 'src/assets',
      components: path.resolve(__dirname, '../src/components'),
      js: path.resolve(__dirname, '../src/js'),
      sass: path.resolve(__dirname, '../src/sass')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'vue-loader'
          },
          {
            loader: 'vue-md-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ],
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
          }
        ]
      }
    ]
  },
  node: {
    Buffer: false
  },
  plugins: [new VueLoaderPlugin()]
}
