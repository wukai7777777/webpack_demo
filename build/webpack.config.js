// nodejs 中的path模块
const path = require('path');
const webpack = require('webpack');
const entryConfig = require('./entry.config');
const WebpackHtmlPlugin = require('webpack-html-plugin');
let entry = {
        vendors: [
            'Vue'
        ]
    }; // 配置入口文件
entryConfig.app.forEach((v)=>{
    entry[v] = path.resolve(__dirname, `../app/${v}/${v}.js`);
})
let routers = entryConfig.app;
let plugins = [];
for(key in routers){
    plugins.push(new WebpackHtmlPlugin({
        chunks: ['vendors', routers[key]],
        filename: `../${routers[key]}.html`,
        template: path.resolve(__dirname, `../app/${routers[key]}/${routers[key]}.html`),
        inject: true,
    }))
}


module.exports = {
    // 入口文件，path.resolve()方法，可以结合我们给定的两个参数最后生成绝对路径，最终指向的就是我们的index.js文件
    entry,
    // 输出配置
    output: {
        // 输出路径是 myProject/output/static
        path: path.resolve(__dirname, '../output/static'),
        publicPath: 'static/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [
                    path.resolve(__dirname ,'../app/**')
                ],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname ,'../app/**'),
                ]
            }
        ]
    },
    plugins
}