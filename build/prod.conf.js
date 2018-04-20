/* eslint-disable */
const path = require('path')

const config = require('./config')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// webpack内置的不支持压缩es6,所以使用最原始的plugin压缩
const UglifyEsPlugin = require('uglifyjs-webpack-plugin')
const webpackConfig = merge(baseWebpackConfig, {
    entry: {
        // 首页
        main: './src/index.js'
    },
    module: {
        rules: utils.styleLoaders({
            sourceMap: false,
            extract: true
        })
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: 'vue-fixed-table.min.js',
        library: 'vue-fixed-table',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: 'cheap-source-map',
    externals: {
        vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.build.env
        }),
        new UglifyEsPlugin({
            parallel: true,
            cache: true,
            sourceMap: false,
            uglifyOptions: {
                ecma: 8,
                // 详细规则
                // https://github.com/mishoo/UglifyJS2/tree/harmony#minify-options
                compress: {
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有的 `console` 语句
                    drop_console: true,
                    // 将()=>{return x} 转成 ()=>x
                    // 关闭.eslint有做检查
                    arrows: false,
                    // 转换类似!!a ? b : c → a ? b : c
                    // 关闭.eslint做检查
                    booleans: false,
                    // 转换由计算得来的属性名 {["computed"]: 1} is converted to {computed: 1}.
                    // 关闭,eslint做检查
                    computed_props: false,
                    // 自动转换判断
                    // e.g. a = !b && !c && !d && !e → a=!(b||c||d||e) etc.
                    // 关闭,请自行做规范
                    comparisons: false,
                    // 去掉死代码
                    // 关闭.eslint做检查
                    dead_code: false,
                    // 关闭debugger
                    // eslint做检查
                    drop_debugger: false,
                    // 自动进行静态算术计算
                    // 开启
                    evaluate: true,
                    // 函数声明提升
                    // 默认就是关闭,不需要开启
                    hoist_funs: false,
                    // For example: var o={p:1, q:2}; f(o.p, o.q); is converted to f(1, 2);
                    // 不需要咯
                    hoist_props: false,
                    // 变量提升
                    // 不需要咯
                    hoist_vars: false,
                    //  optimizations for if/return and if/continue
                    // 不需要, eslint做检查
                    if_return: false,
                    /**
                     * 无法用言语表达,自行理解
                     * inline (default: true) -- inline calls to function with simple/return statement:
                        false -- same as 0
                        0 -- disabled inlining
                        1 -- inline simple functions
                        2 -- inline functions with arguments
                        3 -- inline functions with arguments and variables
                        true -- same as 3
                     */
                    inline: false,
                    // join consecutive var statements
                    // 就是将变量声明合并到一个var中
                    // 关闭, eslin做检查
                    join_vars: false,
                    // 自动去除无用的function参数
                    // 关闭. eslint做检查
                    keep_fargs: false,
                    //  Pass true to prevent Infinity from being compressed into 1/0
                    // 禁止将infinity转成1/0
                    keep_infinity: true,
                    // optimizations for do, while and for loops when we can statically determine the condition.
                    // 优化循环
                    // 此处关闭,应该由开发者自行优化
                    loops: false,
                    // negate "Immediately-Called Function Expressions" where the return value is discarded, to avoid the parens that the code generator would insert.
                    // 自行体会
                    negate_iife: true,
                    //  rewrite property access using the dot notation, for example foo["bar"] → foo.bar
                    // 关闭.eslint检查
                    properties: false,
                    // 将只用到一次的function,通过inline方式插入
                    // 关闭.开发者自行把控
                    reduce_funcs: false,
                    // 将静态变量直接lnline紧代码里
                    // 可以开启
                    reduce_vars: true,
                    // 使用逗号运算符连接连续的简单语句
                    // 自行把控
                    sequences: false,
                    /**
                     *  Pass false to disable potentially dropping functions marked as "pure". 
                     * A function call is marked as "pure" if a comment annotation \/*@__PURE__*\/ or \/*#__PURE__*\/ immediately precedes the call. 
                     * For example: \/*@__PURE__*\/foo();
                     * 就是关闭标注纯函数的注释了
                     */
                    side_effects: false,
                    // 去掉重复和无法到达的switch分支
                    // eslint做检查, 以及开发者把控
                    switches: false,
                    // Transforms typeof foo == "undefined" into foo === void 0
                    typeofs: false,
                }
            }
        }),
        new ExtractTextPlugin({
            // filename: utils.assetsPath('css/[name].[contenthash].css'),
            filename: utils.assetsPath('css/vue-fixed-table.min.css'),
            allChunks: false
        }),
        new OptimizeCSSPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {removeAll: true},
                safe: true
            },
            canPrint: true
        })
    ]
})

module.exports = webpackConfig
