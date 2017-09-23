import KCpage from './KCpage.js'

class KCtbkIndex extends KCpage {
	/**
     * 设置FilterMenu距离顶部的高度
     * @method setFilterMenu
     * @param {Number} opacityHeight 设置渐变的高度
     * @param {Boolean} isHide 是否显示
     * @public
     * @return {Null} void
     * @example
     *      indexApi.setFilterMenu(opacityHeight, isHide);
     * @since 1.0.0
     */
    setFilterMenu(opacityHeight, data, isHide) {
        this.sendData({
            method: "setFilterMenu",
            param: {
               "opacityHeight": opacityHeight,
               "data": data,
               "isHide": isHide
            }
        });
    }
}

export default new KCtbkIndex({
    name: "kerkee tbkIndexApi",
    author: "gulp",
    version: "1.0",
    jsbc: jsBridgeClient,
    nativeCls: "tbkIndexPage"
})