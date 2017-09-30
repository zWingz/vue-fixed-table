var path = require('path')
var config = require('./config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
var isProduction = process.env.NODE_ENV !== 'development';

// console.log('base conf', process.env.NODE_ENV, 'isProduction :', isProduction)
const entries = {};
Object.keys(config.entry).forEach(each => {
    const opt = config.entry[each]
    entries[each] = opt.path;
})
module.exports = {
    entry: entries,
    output: {
        path: isProduction ? config.build.assetsRoot : config.test.assetsRoot,
        publicPath: isProduction ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js',
        chunkFilename: '[name].js', // so that import('module') creates module.js
        sourceMapFilename: '[file].map'
    },
    // require 解析
    resolve: {
        extensions: ['.js', '.vue', '.scss', '.css'], // 当require找不到模块添加后缀
        modules: [
            path.join(__dirname, '../src'),
            'node_modules'
        ],
        alias: {
            '@': path.resolve(__dirname, '../src'),
            'assets': 'src/assets',
            'components': path.resolve(__dirname, '../src/components'),
            'js': path.resolve(__dirname, '../src/js'),
            'sass': path.resolve(__dirname, '../src/sass'),
            // 'vue': 'vue/dist/vue.runtime.esm.js',
            'vue': 'vue/dist/vue.esm.js',
            'router': 'src/router',
            'vue-router': 'vue-router/dist/vue-router.esm.js',
            'vuex': 'vuex/dist/vuex.esm.js',
            'view': 'src/view',
            'http': 'src/http',
            'store': 'src/store'
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: utils.cssLoaders({
                        sourceMap: isProduction ? config.build.productionSourceMap : config.dev.cssSourceMap,
                        extract: isProduction ? config.build.extract : config.dev.extract
                    }),
                    preserveWhitespace: false,
                    transformToRequire: {
                        video: 'src',
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            },
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }],
                include: projectRoot,
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: utils.assetsPath('img/[name].[hash:7].[ext]')
                    }
                }]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                    }
                }]
            }
        ]
    },
    node: {
        Buffer: false
    }

}