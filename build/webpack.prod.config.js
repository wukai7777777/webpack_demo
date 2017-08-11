const shelljs = require('shelljs/global');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const Merge = require('webpack-merge');
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

config.output.publicPath = 'static/'

config.output.filename = '[name].[hash].js'

// css happypack
config.module.rules.push({
  test: /\.vue$/,
  use: {
    loader: 'vue-loader'
  }
});

let htmls = [];
entry.app.map((v) => {
    htmls.push(new HtmlWebpackPlugin({
        chunks: ['bundle', v],
        filename: `../${v}.html`,
        template: path.resolve(__dirname, `../app/${v}/${v}.html`),
        chunksSortMode: 'dependency',
        minify: { removeComments: true, collapseWhitespace: true },
        inject: true,
    }))
});

module.exports = Merge(config, {
  devtool: false,
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    // pro
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    // 提取
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
    ...htmls,
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
    })
  ]
});