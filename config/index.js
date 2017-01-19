// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/wechat/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    //assetsSubDirectory: 'static',// 打包目录
    assetsSubDirectory: 'wechat/static', // sit/本地/qa 打包目录
    assetsPublicPath: '/',
    productionSourceMap: false, // todo true
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css', 'scss']
  },
  dev: {
    env: require('./dev.env'),
    port: 3030,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      "/mapi":{
        target: 'http://192.168.2.36:3030', // target host http://www.example.org
        changeOrigin: true, // needed for virtual hosted sites
        wx: false, // proxy websockets
        pathRewrite: {
          //'^/api/old-path' : '/api/new-path',     // rewrite path
          //'^/api/remove/path' : '/path'           // remove base path
          '^/mapi': 'mapi'
        },
        router: {
          // when request.headers.host == 'dev.localhost:3000',
          // override target 'http://www.example.org' to 'http://localhost:8000'
          //'dev.localhost:3000' : 'http://localhost:8000'
        }
      },
      "/wechat":{
        target: 'http://192.168.2.36:3030', // target host http://www.example.org
        changeOrigin: true, // needed for virtual hosted sites
        wx: false, // proxy websockets
        pathRewrite: {
          //'^/api/old-path' : '/api/new-path',     // rewrite path
          //'^/api/remove/path' : '/path'           // remove base path
          '^/wechat': 'wechat'
        },
        router: {
          // when request.headers.host == 'dev.localhost:3000',
          // override target 'http://www.example.org' to 'http://localhost:8000'
          //'dev.localhost:3000' : 'http://localhost:8000'
        }
      },
      "/lehome-web-mapi":{
        target: 'http://192.168.2.36:3030', // target host http://www.example.org
        changeOrigin: true, // needed for virtual hosted sites
        wx: false, // proxy websockets
        pathRewrite: {
          //'^/api/old-path' : '/api/new-path',     // rewrite path
          //'^/api/remove/path' : '/path'           // remove base path
          '^/lehome-web-mapi': 'lehome-web-mapi'
        },
        router: {
          // when request.headers.host == 'dev.localhost:3000',
          // override target 'http://www.example.org' to 'http://localhost:8000'
          //'dev.localhost:3000' : 'http://localhost:8000'
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
