
const path = require('path');
const webpack = require('webpack');
const entryconfig = require('../entry.config');


module.exports = {
    output: {
        path: path.join(__dirname, '../dll'),
        filename: '[name].dll.js',
        library: '[name]',// 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
    },
    entry:{
        vendor: entryconfig.dll
    },
    plugins: [
        new webpack.DllPlugin({
        path: path.join(__dirname, '../dll', '[name]-manifest.json'), // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
        name: '[name]',  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
        context: path.join(__dirname, '..／'), // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
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
        })
    ],
}