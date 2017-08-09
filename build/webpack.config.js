// nodejs 中的path模块
const path = require('path');
const webpack = require('webpack');
const entryConfig = require('../entry.config');
const WebpackHtmlPlugin = require('webpack-html-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const os = require('os');
const HappyPack  = require('happypack');
const happThreadPool = HappyPack.ThreadPool({size: os.cpus().length}); // 采用多进程，进程数由CPU核数决定
// 配置入口文件
let entry = {
    bundle: [
            'Vue'
        ]
}; 
entryConfig.app.forEach((v)=>{
    entry[v] = path.resolve(__dirname, `../app/${v}/${v}.js`);
})


console.log(require.resolve(`${__dirname}/../dll/vendor.dll.js`));
//插件配置
let routers = entryConfig.app;
let plugins = [
    new webpack.DllReferencePlugin({
        context: path.join(__dirname, '..／'), // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
        manifest: require('../dll/vendor-manifest.json'),
    }),
    //提取公共框架 如vue 抽取出所有通用的部分
    new webpack.optimize.CommonsChunkPlugin({
        name: 'bundle',
        filename: 'bundle.js',
        //minChunks: Math.ceil(grainConfig.app.length / 2)  //抽取出一半以上引用的模块
    }),
    /* 插入Dll文件 */
    new AddAssetHtmlPlugin({ filepath: require.resolve(`${__dirname}/../dll/vendor.dll.js`), includeSourcemap: false }),
    /* 使用happypack */
    new HappyPack({
        id: 'js',
        // cache: true,
        loaders: ['babel-loader?cacheDirectory=true'],
        threadPool: happThreadPool
    })
];


// for(key in routers){
//     plugins.push(new WebpackHtmlPlugin({
//         chunks: ['vendors', routers[key]],
//         filename: `../${routers[key]}.html`,
//         template: path.resolve(__dirname, `../app/${routers[key]}/${routers[key]}.html`),
//         inject: true,
//     }))
// }

console.log(path.join(__dirname, '../output/static'));
console.log(path.join(__dirname, '../node_modules/vue/dist/vue.esm.js'));
module.exports = {
    // 入口文件，path.resolve()方法，可以结合我们给定的两个参数最后生成绝对路径，最终指向的就是我们的index.js文件
    entry,
    // 输出配置
    output: {
        // 输出路径是 myProject/output/static
        path: path.join(__dirname, '../output/static'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        sourceMapFilename: '[name].map',
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': path.join(__dirname, '../node_modules/vue/dist/vue.esm.js')
        },
        modules: [`${__dirname}/../node_modules`]
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
                loader: ['happypack/loader?id=js'],
                include: [`${__dirname}/../app`]
            }
        ]
    },
    plugins
}