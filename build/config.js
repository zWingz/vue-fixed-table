// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

module.exports = {
    entry: {
        demo: {
            path: './src/demo/index',
            title: 'demo'
        }
    },
    build: {
        env: {
            // NODE_ENV: '"development"'
            NODE_ENV: '"production"'
        },
        // index: path.resolve(__dirname, '../dist/'),
        index: path.resolve(__dirname, '../release/'),
        // 编译输出的静态资源根路径
        // assetsRoot: path.resolve(__dirname, '../dist'),
        assetsRoot: path.resolve(__dirname, '../release'),
        // 编译输出的二级目录
        assetsSubDirectory: 'assets',
        // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
        assetsPublicPath: '',
        // 是否开启 cssSourceMap
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        // 是否开启 gzip
        productionGzip: false,
        // 需要使用 gzip 压缩的文件扩展名
        productionGzipExtensions: ['js', 'css'],
        extract: true
    },
    test: {
        env: {
            // NODE_ENV: '"development"'
            NODE_ENV: '"testing"'
        },
        index: path.resolve(__dirname, '../test-build/'),
        // 编译输出的静态资源根路径
        assetsRoot: path.resolve(__dirname, '../test-build'),
        // 编译输出的二级目录
        assetsSubDirectory: 'assets',
        // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
        assetsPublicPath: '/',
        // 是否开启 cssSourceMap
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        // 是否开启 gzip
        productionGzip: false,
        // 需要使用 gzip 压缩的文件扩展名
        productionGzipExtensions: ['js', 'css'],
        extract: true
    },
    dev: {
        env: {
            NODE_ENV: '"development"'
        },
        port: 8089,
        // 编译输出的二级目录
        assetsSubDirectory: 'assets',
        // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
        assetsPublicPath: '/',
        cssSourceMap: true,
        extract: false
    }
};