import KCcore from './KCcore'

class KClocationApi extends KCcore{
	/**
     * 获取定位城市
     * @method getCity
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * {info: "http://api.k.sohu.com/"}
     * @example
     *        clientInfo.getCity(function(data){
     *          data.citydomain //城市简写
                data.city //城市名称
                data.cityid //城市ID
                data.lat //纬度
                data.lon //经度
     *      }
     * @since 2.7.5
     */
    getCity (callBack) {
        this.sendData({
            method: "getCity",
            param: {
                "info": "getCity"
            },
            callBack: callBack
        });
    }


	/**
     * 获取当前位置的经纬度
     * @method requestLocation
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *        KClocationApi.requestLocation(function(data){
     *          //data.lon经度  
     *          //data.lat纬度
     *          //{lon: "116.3060115901335", lat: "40.04798410511159"}
     *      }
     * @since 2.7.5
     */
    requestLocation (callBack) {
        this.sendData({
            method: "requestLocation",
            param: {
                "info": "requestLocation"
            },
            callBack: callBack
        });
    }


    /**
     * 根据经纬度获取地理位置
     * @method regeo
     * @public
     * @param {String} lon 经度
     * @param {String} lat 纬度
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *        KClocationApi.regeo(function(data){
     *          //POI信息  {address: "北京市海淀区东北旺路"}
     *      }
     * @since 2.7.5
     */
    regeo (lon,lat,callBack) {
        this.sendData({
            method: "regeo",
            param: {
                lon:lon,
                lat:lat
            },
            callBack: callBack
        });
    }


    /**
     * 根据城市街道获取经纬度
     * @method geo
     * @public
     * @param {String} address 字符串  address为结构化地址信息（规则：省+市+区+街道+门牌号）
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *        KClocationApi.geo(function(data){
     *          //data.lon经度  
     *          //data.lat纬度
     *      }
     * @since 2.7.5
     */
    geo (address,city,callBack) {
        this.sendData({
            method: "geo",
            param: {
                address:address,
                city:city
            },
            callBack: callBack
        });
    }


    /**
     * 获取当前位置周边的POI
     * @method searchPOIAround
     * @public
     * @param {String} lon 经度
     * @param {String} lat 纬度
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *        KClocationApi.searchPOIAround(function(data){
     *          //周边POI信息 {businessCircle: "上地,马连洼,西二旗"}
     *      }
     * @since 2.7.5
     */
    searchPOIAround (lon,lat,callBack) {
        this.sendData({
            method: "searchPOIAround",
            param: {
                lat:lat,
                lon:lon
            },
            callBack: callBack
        });
    }


    /**
     * 获取当前位置周边的POI
     * @method requestPOI
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *        locationApi.requestPOI(function(data){
     *          {
     *              address: "北京市海淀区东北旺路", 
     *              district: "海淀区", 
     *              city: "北京", 
     *              streetName: "东北旺路", 
     *              streetNumber: "",
     *              lon: "116.3060115901335",
     *              lat: "40.04798410511159",
     *              province: "北京市"
     *           }
     *      }
     * @since 2.7.5
     */
    requestPOI (callBack){ 
        this.sendData({
            method: "requestPOI",
            param: {
                "info":"requestPOI"
            },
            callBack: callBack
        });
    }

    /**
     * 获取首页缓存里面的经纬度
     * @method getCachedLocation
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *        KClocationApi.getCachedLocation(function(data){
     *          //data.lon经度  
     *          //data.lat纬度
     *          //{lon: "116.3060115901335", lat: "40.04798410511159"}
     *      }
     * @since 3.0.0
     */
    getCachedLocation (callBack) {
        this.sendData({
            method: "getCachedLocation",
            param: {
                "info": "getCachedLocation"
            },
            callBack: callBack
        });
    }
}

export default new KClocationApi({
    name: "locationApi",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "locationApi"
})