const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackHtmlPlugin = require('webpack-html-plugin');
const path = require('path');
const webpack = require('webpack');

// 引入基本配置
var config = require('./webpack.config');

config.vue = {
    loaders: {
        css: ExtractTextPlugin.extract("css")
    }
};

config.plugins.push(
     // 提取css为单文件
    new ExtractTextPlugin("../[name].[contenthash].css")
)

console.log(config.plugins);

module.exports = config;