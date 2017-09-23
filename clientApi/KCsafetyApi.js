import KCcore from './KCcore'

class KCsafetyApi extends KCcore{
	/**
     * 加密
     * @method dekEncrypt
     * @public
     * @param {String} data 需要加密的字段
     * @param {Function} callBack 回调函数
     * @return {Object}
     * {data:信息}
     * @example
     *        KCsafetyApi.dekEncrypt(function(data){
     *          console.log(data);//返回字符串
     *      });
     * @since 2.7.5
     */
    dekEncrypt (info,callBack){
        this.sendData({
            method: "dekEncrypt",
            param: {
                "data": info
            },
            callBack: callBack
        });
    }

    /**
     * 解密
     * @method dekDecrypt
     * @public
     * @param {String} data 需要解密的字段
     * @param {Function} callBack 回调函数
     * @return {Object}
     * {data:信息}
     * @example
     *        KCsafetyApi.dekDecrypt(function(data){
     *          console.log(data);//返回字符串
     *      });
     * @since 2.7.5
     */
    dekDecrypt (info,callBack){
        this.sendData({
            method: "dekDecrypt",
            param: {
                "data": info
            },
            callBack: callBack
        });
    }
}

export default new KCsafetyApi({
    name: "safetyApi",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "safetyApi"
})