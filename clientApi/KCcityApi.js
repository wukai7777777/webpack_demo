import KCcore from './KCcore'

class KCcityApi extends KCcore{
    /**
     * 向客户端请求参数
     * @method getOptions
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *      indexApi.getOptions(function(data){
     *          console.log(data);
     *      });
     * @since 1.0.0
     */
    getOptions (callBack) {
        this.sendData({
            method: "getOptions",
            param: {
                "info": "getOptions"
            },
            callBack: callBack
        });
    }
    /**
     * 获取用户选择城市
     * @method getValidCity
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * {info: "http://api.k.sohu.com/"}
     * @example
     *        clientInfo.getValidCity(function(posCity){
     *          console.log(posCity);
     *      }
     * @since 2.6.0
     */
    getValidCity (callBack) {
        this.sendData({
            method: "getValidCity",
            param: {
                "info": "getValidCity"
            },
            callBack: callBack
        });
    }

    /**
     * 切换城市，向客户端发送请求
     * @method changeCity
     * @public
     * @param {Object} param 给客户端发送的参数
     * @return {Null}
     * @example
     *        CityApi.changeCity()
     * @since 1.0.0
     */
    changeCity (params) {
        this.sendData({
            method: "changeCity",
            param: params
        });
    }

    /**
     * 调起地址筛选匡
     * @method showCityPicker
     * @public
     * @return {Fuction} callback
     * @example
     *      clientInfo.showCityPicker(callback);
     * @since 2.7.5
     */
    showCityPicker (callBack) {
        this.sendData({
            method: "showCityPicker",
            param: {
                info:'showCityPicker'
            },
            callBack:callBack
        });
    }
	
}

export default new KCcityApi({
    name: "cityApi",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "cityApi"
})