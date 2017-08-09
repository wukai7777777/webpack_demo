module.exports = {
    //配置入口文件
    app: [
        "index",
        "login",
        "reg"
    ],
    //输出文件
    output: "output",
    //外链接库
    dll: [
        './node_modules/vue/dist/vue.esm.js',
		'./node_modules/es6-promise/dist/es6-promise.auto.js',
		'vuex',
    ]
}