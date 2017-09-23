import KCpage from './KCpage.js'
class KCearnScorePage extends KCpage{
	/*
     * 获取赚积分数据
     * @method getData
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *      earnScorePage.getData(function(data){
     *          console.log(data);
     *      });
     * @since 2.8.0
     */
    getData (callBack){
        this.sendData({
            method: "getData",
            param: {
                "info": 'getData'
            },
            callBack: callBack
        });
    }
    

    /*
     * 调用客户端签到
     * @method signIn
     * @example
     *      earnScorePage.signIn();
     * @since 2.8.0
     */
    signIn (callBack){
        this.sendData({
            method: "signIn",
            param: {
                "info": 'signIn'
            }
        });
    }

    /*
     * 调用客户端签到
     * @method pullData
     * @example
     *      earnScorePage.pullData();
     * @since 2.8.0
     */
    pullData (pullData){
        this.sendData({
            method: "pullData",
            param: {
                pullData: pullData
            }
        });
    }
	
}

export default new KCearnScorePage({
    name: "earnScorePage",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "earnScorePage"
})