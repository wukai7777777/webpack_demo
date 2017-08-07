//单独修改开发配置 为了不影响webpack.config.js 执行构建的配置
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const entryconfig = require('./entry.config');
const config = require('./webpack.config');
const webpack = require('webpack');
const entryConfig = require('./entry.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

entryConfig.app.forEach((v)=>{
    config.entry[v] = [
        'webpack-hot-middleware/client',
        path.resolve(__dirname, `../app/${v}/${v}.js`)
    ];
})

config.output.publicPath = '/' //修改成开发时候的公共路径 就是跟路径


let plugins = [
    // 添加三个插件
    //new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
];
let routers = entryconfig.app;
for (key in routers) {
    plugins.push(new HtmlWebpackPlugin({
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
if (entryconfig.analyzer) {
    plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8889,
        reportFilename: 'report.html',
        statsFilename: 'stats.json'
    }))
}
config.plugins = plugins; //修改filename 开发配置 例如 app/index/index.html 读取一个在内存中的虚拟路径

//导出config模块

module.exports = config;