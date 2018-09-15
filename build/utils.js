var HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')
const config = require('./config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


// 资源路径
exports.assetsPath = function (_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
        config.build.assetsSubDirectory :
        process.env.NODE_ENV === 'testing' ?
        config.test.assetsSubDirectory :
        config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
}

// 生成css的loader配置
exports.cssLoaders = function (options = {}) {
    /**
     * 官方的
     */
    options = options || {}

    const cssLoader = {
            loader: 'css-loader',
            options: {
                minimize: true,
                sourceMap: options.sourceMap
            }
        },
        postcssLoader = {
            loader: 'postcss-loader',
            options: {
                sourceMap: options.sourceMap
            }
        }
    function generateLoaders(loader, loaderOptions) {
        var loaders = [cssLoader, postcssLoader]
        if(loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, { sourceMap: options.sourceMap })
            })
        }
        if(options.extract) {
          loaders.unshift(MiniCssExtractPlugin.loader)
          return loaders
        }
        return ['vue-style-loader'].concat(loaders)
    }
    const sassLoader = generateLoaders('sass', { includePaths: [path.resolve(__dirname, '../src/sass')] })
    return {
        css: generateLoaders(),
        // sass: generateLoaders(),
        // scss: generateLoaders(),
        // includePaths指明在scss文件中使用@import时候搜索的路径
        sass: sassLoader,
        scss: sassLoader
            // 如果需要其他loader,请在下面添加或者替换上面的scss
    }
}

// 用于生产webpack的rules
exports.styleLoaders = function (options) {
    var output = []
    var loaders = exports.cssLoaders(options)
    for(var extension in loaders) {
        var loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}

var isProduction = process.env.NODE_ENV === 'production';

// 生成多页
exports.HtmlCreator = function (options) {
    return new HtmlWebpackPlugin({
        title: options.title || '',
        filename: (isProduction ? config.build.index : config.test.index) + `/${options.chunkName}.html`,
        template: options.tmpl || './index.html',
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        }
    })
}
