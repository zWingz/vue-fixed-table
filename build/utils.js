var HtmlWebpackPlugin = require('html-webpack-plugin')

const path = require('path')
const config = require('./config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')


// 资源路径
exports.assetsPath = function(_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
        config.build.assetsSubDirectory :
        process.env.NODE_ENV === 'testing' ?
        config.test.assetsSubDirectory :
        config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
}

// 生成css的loader配置
exports.cssLoaders = function(options = {}) {
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
        };
    // resolveUrlLoade = { loader: 'resolve-url-loader' };
    // console.log('style-loader is -->  ', options)
    function generateLoaders(loader, loaderOptions) {
        var loaders = [cssLoader, postcssLoader]
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, { sourceMap: options.sourceMap })
            })
        }
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            })
        }
        return ['vue-style-loader'].concat(loaders)
    }
    return {
        css: generateLoaders(),
        // sass: generateLoaders(),
        // scss: generateLoaders(),
        // includePaths指明在scss文件中使用@import时候搜索的路径
        sass: generateLoaders('sass', { includePaths: [path.resolve(__dirname, '../src/sass')] }),
        scss: generateLoaders('sass', { includePaths: [path.resolve(__dirname, '../src/sass')] })
            // 如果需要其他loader,请在下面添加或者替换上面的scss
    }
}

// 用于生产webpack的rules
exports.styleLoaders = function(options) {
    var output = []
    var loaders = exports.cssLoaders(options)
    for (var extension in loaders) {
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
exports.HtmlCreator = function(options) {
    return new HtmlWebpackPlugin({
        title: options.title || '',
        filename: (isProduction ? config.build.index : config.test.index) + `/${options.chunkName}.html`,
        template: options.tmpl || './index.html',
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        chunksSortMode: (c1, c2) => {
            let orders = ['manifest', 'vendor', 'common', options.chunkName];
            let o1 = orders.indexOf(c1.names[0]);
            let o2 = orders.indexOf(c2.names[0]);
            return o1 - o2;
        },
        // favicon: './favicon.ico',
        chunks: ['manifest', 'vendor', 'common', options.chunkName]
    })
}