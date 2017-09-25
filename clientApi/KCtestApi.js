import KCcore from './KCcore'

class KCtestApi extends KCcore{
	/**
     * 获取测试信息
     * @method getTestInfo
     * @public
     * @param {Function} callBack 回调函数
     * @param {String} testInfo 测试信息
     * @return {Object}
     * @example
     *      testApi.getTestInfo(function(data){
     *          console.log(data);
     *      },"test");
     * @since 1.0.0
     */
    getTestInfo (callBack, testInfo) {
        this.sendData({
            method: "testInfo",
            param: {
                "testInfo": "I'm testInfo"
            },
            callBack: callBack
        });
    }
	
}

export default new KCtestApi({
    name: "testModules",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "testModules"
})