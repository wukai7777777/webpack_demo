import KCpage from './KCpage.js'

class KCprefecturePage extends KCpage{

	/**
     * 设置FilterMenu距离顶部的高度
     * @method setFilterMenuHeight
     * @param {Number} filterMenuOffset 设置filterMenu距顶部的高度
     * @public
     * @return {Null} void
     * @example
     *      indexApi.setFilterMenuHeight(filterMenuOffset);
     * @since 1.0.0
     */
    setFilterMenuOffset(filterMenuOffset) {
        this.sendData({
            method: "setFilterMenuOffset",
            param: {
               "height":filterMenuOffset
            }
        });
    }
}

export default new KCprefecturePage({
    name: "kerkee prefecturePage",
    author: "gulp",
    version: "1.0",
    jsbc: jsBridgeClient,
    nativeCls: "prefecturePage"
})