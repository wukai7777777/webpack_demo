//单独修改开发配置 为了不影响webpack.config.js 执行构建的配置
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const entryconfig = require('../entry.config');
const config = require('./webpack.config');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

entryconfig.app.forEach((v)=>{
    config.entry[v] = [
        //'./build/dev-client',
        path.resolve(__dirname, `../app/${v}/${v}.js`)
    ];
})

//config.output.publicPath = '/' //修改成开发时候的公共路径 就是跟路径

// css happypack
config.module.rules.push({
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
      js: 'happypack/loader?id=js' // 将loader换成happypack
    }
  }
});


let plugins = [
    // 添加三个插件
    //new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    //提取公共框架 如vue
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: 'vendors.js',
    }),
];
// let routers = entryconfig.app;
// for (key in routers) {
//     plugins.push(new HtmlWebpackPlugin({
//         chunks: ['vendors', routers[key]],
//         filename: `app/${routers[key]}/${routers[key]}.html`,
//         template: path.resolve(__dirname, `../app/${routers[key]}/${routers[key]}.html`),
//         inject: true,
//         minify: {
//             removeComments: true,
//             removeScriptTypeAttributes: true,
//             removeStyleLinkTypeAttributes: true
//         }
//     }))
// }
if (entryconfig.analyzer) {
    config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8889,
        reportFilename: 'report.html',
        statsFilename: 'stats.json'
    }))
}
//config.plugins = plugins; //修改filename 开发配置 例如 app/index/index.html 读取一个在内存中的虚拟路径

//导出config模块

module.exports = Merge(config, {
  // devtool: '#cheap-module-eval-source-map',
  cache: true,
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // new ExtractTextPlugin("../[name].[contenthash].css"),
    new webpack.LoaderOptionsPlugin({
      test:/\.vue$/,
      loader: 'vue-loader',
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
               publicPath:"/", 
             })
           }
         }  
      }  
    }),
  ],
  devServer: {
    port: 3008,
    host: 'localhost',
    historyApiFallback: true,
    noInfo: false,
    stats: 'minimal',
    publicPath: '/'
  }
})