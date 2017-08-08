const shelljs = require('shelljs/global');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const entry = require('../entry.config');

// 引入基本配置
var config = require('./webpack.config');
if(fs.existsSync(path.join(__dirname, `../${entry.output}`))){
    try{
        rm('-rf', path.join(__dirname, `../${entry.output}`));
        //fs.mkdirSync(config.output.path);
    }catch(e){
        console.log(e);
    }
}




config.plugins = [
    // 提取css
    new ExtractTextPlugin("../[name].[contenthash].css"),
    // 编译css
    new webpack.LoaderOptionsPlugin({
      test:/\.vue$/,
      options: {  
         vue: {
            loaders: {  
               css: ExtractTextPlugin.extract({  
               fallback:'vue-style-loader',   
               use: [{
                  loader: 'css-loader',
                  options: {
                    minimize: true
                  }
               }],  
               publicPath:"static/", 
             })
           }
         }  
      }  
    }),
    // 压缩
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true,
        warnings: false
      },
      comments: false
    }),
    //提取公共框架 如vue
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: 'vendors.js',
    }),
];

let routers = entry.app;
for(key in routers){
    config.plugins.push(new HtmlWebpackPlugin({
        chunks: ['vendors', routers[key]],
        filename: `../${routers[key]}.html`,
        template: path.resolve(__dirname, `../app/${routers[key]}/${routers[key]}.html`),
        inject: true,
    }))
}

module.exports = config;