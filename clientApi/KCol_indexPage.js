import KCpage from './KCpage.js'

class KCol_indexPage extends KCpage{
	// constructor() {
	// 	super();
	// }

	/**
     * 设置FilterMenu距离顶部的高度和menu数据
     * @method setFilterMenu
     * @param {Number} height 设置filterMenu 的高度
     * @param {Number} opacityHeight 设置渐变的高度
     * @param {Array} menuData 设置menu数据
     * @public
     * @return {Null} void
     * @example
     *      indexApi.setFilterMenu(height, opacityHeight, menuData);
     * @since 1.0.0
     */
    setFilterMenu(height, opacityHeight, menuData) {
    	// callBack();
        this.sendData({
            method: "setFilterMenu",
            param: {
               "height":height,
               "opacityHeight":opacityHeight,
               "menuData":menuData
            }
        });
    }

    /**
     * 通知客户端列表加载完成，滚动到指定位置
     * @method listDataLoadFinished
     * @public
     * @return {Null} void
     * @example
     *      indexApi.listDataLoadFinished();
     * @since 1.0.0
     */
    // listDataLoadFinished(){
    //     this.sendData({
    //         method: "listDataLoadFinished",
    //         param: {
    //            info:"listDataLoadFinished"
    //         }
    //     });
    // }

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
     * 获取客户端是否是首次启动
     * @method readOlStartupState
     * @public
     * return {json}
     * @example
     *        ol_indexPage.readOlStartupState(function(data){
     *            data.state==1 //首次启动
     *        });
     * @since 2.5.0
     */
    readOlStartupState(callBack) {
        this.sendData({
            method: "readOlStartupState",
            param: {
                "info": "readOlStartupState"
            },
            callBack:callBack
        });
    }
    /**
     * 设置广告位banner距离顶部的距离
     * @method setAdvertisementPos
     * @public
     * return {json}
     * @example
     *        ol_indexPage.setAdvertisementPos(pos);
     * @since 2.9.5
     */
    setAdvertisementPos(pos, type){
        this.sendData({
            method: "setAdvertisementPos",
            param: {
                "pos": pos,
                "type": type
            }
        });
    }
}

export default new KCol_indexPage({
    name: "kerkee ol_indexPage",
    author: "gulp",
    version: "1.0",
    jsbc: jsBridgeClient,
    nativeCls: "ol_indexPage"
})