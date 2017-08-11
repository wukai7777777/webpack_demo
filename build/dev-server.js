const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const webpack = require('webpack');
const portfinder = require('portfinder');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.dev.conf');
const entryconfig = require('../entry.config');


//调用webpack 并把配置传递过去
//const compiler = webpack(config);
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

/**
 * [genScipt 生成script]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function genScipt(arr) {
  let str = '';
  arr.forEach(function(v) {
    str+= `<script src="/${v}.js"></script>`;
  });
  return str;
}

/**
 * [genScipt 生成script]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function genLink(arr) {
  let str = '';
  arr.forEach(function(v) {
    str+= `<link href="/${v}.css" rel="stylesheet">`;
  });
  return str;
}

//创建express 实例
let app = express();
// log
app.use(morgan('dev'));
// static
app.use(express.static(path.join(__dirname, '../dll')));

app.use(function(req, res, next) {
    let regexp = req.originalUrl.match(/\/app\/([a-z-]+)\/([a-z-]+)\.html/);
    if (regexp instanceof Array && regexp[1] === regexp[2] && entryconfig.app.indexOf(regexp[2]) !== -1) {
    let str = fs.readFileSync(`${__dirname}/..${regexp[0]}`).toString();
    str = str.replace('</body>', `${genScipt(['vendor.dll', 'bundle' ,regexp[2]])}</body>`);

    //str = str.replace('</head>', `${genLink([regexp[2]])}</body>`);
    res.send(str);
    }
    next();
});

// compiler
let compiler = webpack(config);
// output
require('./oLog.js')(compiler);
// //使用并注册 webpack－dev－middleware 中间件
app.use(WebpackDevMiddleware(compiler, {
    publicPath: "/",
    // lazy: true,
    stats: defaultStatsOptions
}));

if(entryconfig.hot == true){
  //使用 webpack－hot－middleware 中间件
  var Hotmiddleware = require('webpack-hot-middleware')(compiler);

  // // webpack插件，监听html文件改变事件
  // compiler.plugin('compilation', function (compilation) {
  //     compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
  //         // 发布事件
  //         Hotmiddleware.publish({ action: 'reload' })
  //         cb()
  //     })
  // })
  //注册 webpack－hot－middleware 中间件
  app.use(Hotmiddleware)
}

app.listen(8000, function(err){
    if(err){
        console.log(err);
        return false;
    }
    console.log('listening at http://localhost:8000');
})



