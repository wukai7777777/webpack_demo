const express = require('express');
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.dev.conf');


//创建express 实例
const app = express();

//调用webpack 并把配置传递过去
const compiler = webpack(config);
let defaultStatsOptions = {
  colors: true,
  hash: false,
  timings: true,
  chunks: false,
  chunkModules: false,
  modules: false,
  children: true,
  version: true,
  cached: false,
  cachedAssets: false,
  reasons: false,
  source: false,
  errorDetails: false
};

//使用并注册 webpack－dev－middleware 中间件
app.use(WebpackDevMiddleware(compiler, {
     publicPath: config.output.publicPath,
     stats: defaultStatsOptions
}))

//使用 webpack－hot－middleware 中间件
var Hotmiddleware = require('webpack-hot-middleware')(compiler);

// webpack插件，监听html文件改变事件
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        // 发布事件
        Hotmiddleware.publish({ action: 'reload' })
        cb()
    })
})
//注册 webpack－hot－middleware 中间件
app.use(Hotmiddleware)

app.listen(8000, function(err){
    if(err){
        console.log(err);
        return false;
    }
    console.log('listening at http://localhost:8000');
})



