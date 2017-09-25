import KCpage from './KCpage.js'

class KCnearbyListPage extends KCpage{

	   /**
     * 通知客户端列表加载完成，滚动到指定位置
     * @method listDataLoadFinished
     * @public
     * @return {Null} void
     * @example
     *      indexApi.listDataLoadFinished();
     * @since 1.0.0
     */
    listDataLoadFinished(){
        this.sendData({
            method: "listDataLoadFinished",
            param: {
               info:"listDataLoadFinished"
            }
        });
    }
}

export default new KCnearbyListPage({
    name: "kerkee nearbyListPage",
    author: "gulp",
    version: "1.0",
    jsbc: jsBridgeClient,
    nativeCls: "nearbyListPage"
})