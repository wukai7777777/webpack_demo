const express = require('express');
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.dev.conf');
const Hotmiddleware = require('webpack-hot-middleware');


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

//使用并注册 webpack－hot－middleware 中间件
app.use(Hotmiddleware(compiler))

app.listen(8000, function(err){
    if(err){
        console.log(err);
        return false;
    }
    console.log('listening at http://localhost:8000');
})



