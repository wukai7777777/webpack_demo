import KCcore from './KCcore'
class KCloggerApi extends KCcore{
	/**
     * h5调用native的log收集器
     * @method addLog
     * @public
     * @param {String} type 日志类型 0:tokenData , 1:pv , 2:ev
     * @param {String} log  日志内容
     * @param {String} isTest  是否开启埋点测试 参数：1(是)或者0(否)
     * @return {Null} void
     * @example
     *      var logObj={
     *          Type:"newssdk",
     *          statType:"read",
     *          protocol: t.secondProtocal
     *      };
     *      KCloggerApi.addLog("0","Type="+logObj.Type+"&="+logObj.statType+"&="+logObj.protocol);
     *      
     * @since 2.7.5
     */
    addLog (type, log , isTest){
        this.sendData({
            method: "addLog",
            param: {
                "type": type,
                "log": log
            }
        });
        if(isTest){
            console.log(log)
        };
    }
	
}

export default new KCloggerApi({
    name: "loggerApi",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "loggerApi"
})