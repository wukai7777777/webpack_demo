import KCpage from './KCpage.js'
class KCdetailPage extends KCpage{
	/*
     * 获取发帖公司数据
     * @method getCompanyData
     * @public
     * @param {Function} callBack 回调函数
     * @param {String} string jobId
     * @return {Object}
     * @example
     *      detailPage.getCompanyData(function(data){
     *          console.log(data);
     *      });
     * @since 2.4.0
     */
    getCompanyData (id,callBack){
        this.sendData({
            method: "getCompanyData",
            param: {
                "jobId": id
            },
            callBack: callBack
        });
    }
    /*
     * 向客户端请求急速报名的所有限制信息
     * @method getLayoutParam
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *      detailPage.getLayoutParam(function(data){
     *          console.log(data);
     *      });
     * @since 2.6.5
    */
    getLayoutParam(callBack){
        this.sendData({
            method: "getLayoutParam",
            param:{
                info:'getLayoutParam'
            },
            callBack: callBack
        });
    }
    /*
     * 获取发帖公司数据
     * @method submit
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *      detailPage.submit(data);
     * @since 2.6.5
    */
    submit(data){
        this.sendData({
            method: "submit",
            param:{
                data:data
            }
        });
    }
	
}

export default new KCdetailPage({
    name: "detailPage",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "detailPage"
})