//单独修改开发配置 为了不影响webpack.config.js 执行构建的配置
const WebpackHtmlPlugin = require('webpack-html-plugin');
const path = require('path');
const entryconfig = require('./entry.config');
const config = require('./webpack.config');
const webpack = require('webpack');


config.output.publicPath = '/' //修改成开发时候的公共路径 就是跟路径


let plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
];
let routers = entryconfig.app;
for( key in routers){
    plugins.push(new WebpackHtmlPlugin({
            chunks: ['vendors', routers[key]],
            filename: `app/${routers[key]}/${routers[key]}.html`,
            template: path.resolve(__dirname, `../app/${routers[key]}/${routers[key]}.html`),
            inject: true,
            minify: {
                removeComments: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }))
}

config.plugins = plugins; //修改filename 开发配置 例如 app/index/index.html 读取一个在内存中的虚拟路径

//导出config模块

module.exports = config;