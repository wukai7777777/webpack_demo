import KCpage from './KCpage.js'

class msgOnlinePage extends KCpage{
	/**
     * 获取特工通知的列表数据
     * @method searchKey
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *      msgOnlinePage.getOnlineList(function(data){
     *          console.log(data);
     *      });
     * @since 2.2.0
     */
    getOnlineList (page,pageSize,callBack) {
        callBack
        this.sendData({
            method: "getOnlineList",
            param: {
                "page": page,
                "pageSize": pageSize
            },
            callBack: callBack
        });
    }
	
}

export default new msgOnlinePage({
    name: "msgOnlinePage",
    author: "liyong",
    version: "1.0",
    jsbc: jsBridgeClient,
    nativeCls: "msgOnlinePage"
})