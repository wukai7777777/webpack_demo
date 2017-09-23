import KCpage from './KCpage.js'

class KCsearchPage extends KCpage{
	/**
     * 去客户端获取搜索关键字
     * @method searchKey
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *      KCsearchPage.searchKey(function(data){
     *          console.log(data);
     *      });
     * @since 2.2.0
     */
    searchKey (callBack) {
        this.sendData({
            method: "searchKey",
            param: {
                "info": "searchKey"
            },
            callBack: callBack
        });
    }
	
}

export default new KCsearchPage({
    name: "searchPage",
    author: "liyong",
    version: "1.0",
    jsbc: jsBridgeClient,
    nativeCls: "searchPage"
})