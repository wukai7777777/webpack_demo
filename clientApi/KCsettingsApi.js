import KCcore from './KCcore'

class KCsettingsApi extends KCcore{
	/**
     * 设置IM消息通知的开关
     * @method setIMNotifyStatus
     * @param {Number} status 需要设置的状态 0 关闭 1 开启
     * @param {Function} callBack
     * @return {Object} data.status 0 设置失败 1 设置成功
     * @example
     *        settingsApi.setIMNotifyStatus(status,function(data){
     *            data.status//0 设置失败 1 设置成功
     *        })
     * @since 2.4.0
    */
    setIMNotifyStatus (status,callBack){
        this.sendData({
            method:"setIMNotifyStatus",
            param:{
                "status":status
            },
            callBack: callBack
        });
    }
    /**
     * 获取IM消息通知的开关
     * @method getIMNotifyStatus
     * @param {Function} callBack
     * @return {Object} data.status 
     * @example
     *        settingsApi.getIMNotifyStatus(function(data){
     *            data.status //0 关闭 1 开启
     *        })
     * @since 2.4.0
    */
    getIMNotifyStatus (callBack){
        this.sendData({
            method:"getIMNotifyStatus",
            param:{
                "info":"getIMNotifyStatus"
            },
            callBack: callBack
        });
    }
    /**
     * 获取是否展示邀友赚钱标识
     * @return {[type]} [description]
     */
    getSettingsOfAppReview(callBack) {
        this.sendData({
            method:"getSettingsOfAppReview",
            param:{
                "info":"getSettingsOfAppReview"
            },
            callBack: callBack
        });
    }
}

export default new KCsettingsApi({
    name: "settingsApi",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "settingsApi"
})