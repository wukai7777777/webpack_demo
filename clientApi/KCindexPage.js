import KCpage from './KCpage.js'

class KCindex extends KCpage{
	// constructor() {
	// 	super();
	// }

	/**
     * 设置FilterMenu距离顶部的高度
     * @method setFilterMenuOffset
     * @param {Number} height 设置filterMenu 的高度
     * @param {Number} opacityHeight 设置渐变的高度
     * @public
     * @return {Null} void
     * @example
     *      indexApi.setFilterMenuOffset(height);
     * @since 1.0.0
     */
    setFilterMenu(height, opacityHeight, sex, identity) {
    	// callBack();
        this.sendData({
            method: "setFilterMenu",
            param: {
               "height":height,
               "opacityHeight":opacityHeight,
               "sex" : sex,
               "identity" : identity
            }
        });
    }

    /**
     * 设置FilterMenu的性别和身份
     * @method setFilterMenuForExplore
     * @param {Number} sex 性别
     * @param {Number} identity 身份
     * @public
     * @return {Null} void
     * @example
     *      indexApi.setFilterMenuOffset(height);
     * @since 1.0.0
     */
    setFilterMenuForExplore(sex, identity) {
        this.sendData({
            method: "setFilterMenuForExplore",
            param: {
               "sex" : sex,
               "identity" : identity
            }
        });
    }

    /**
     * 通知客户端用户点击H5FilterMenu
     * @method clickFilterMenu
     * @public
     * @return {Null} void
     * @example
     *      indexApi.clickFilterMenu(index);
     * @since 1.0.0
     */
    clickFilterMenu(index){
        this.sendData({
            method: "clickFilterMenu",
            param: {
               index:index
            }
        });
    }

     /**
     * 设置搜索热词
     * @param  {[Array]} data [description]
        斗米直聘：跳转直聘页面，链接： https http ://m.doumi.com/zhipin /index/
        职位订阅：app内职位订阅链接
        每日任务：做任务赚积分页面链接
        展会­­协助：点击出现职位list
        学生专享：跳转学生专区
        临时工：点击后搜索页面出现职位list
        服务员：点击后搜索页面出现职位list
        传单派发：点击后搜索页面出现职位list
        家教助教：点击后搜索页面出现职位list
     * @return {[type]}      [description]
     */
    hotKeyWords(data) {
        this.sendData({
            method: "hotKeyWords",
            param: {
               data: data
            }
        });
    }

    /**
     * 获取定位
     * @return {[type]} [description]
     */
    getLocation (callBack){
        this.sendData({
            method:"getLocation",
            param:{
                info:'getLocation'
            },
            callBack:callBack
        });
    }
}

export default new KCindex({
    name: "kerkee indexApi",
    author: "gulp",
    version: "1.0",
    jsbc: jsBridgeClient,
    nativeCls: "indexPage"
})