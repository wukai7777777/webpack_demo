import KCpage from './KCpage.js'
class KCpreferencesPage extends KCpage{

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
    showProvinceAndCityPicker (title,callBack){
        this.sendData({
            method: "showProvinceAndCityPicker",
            param: {
                title:title
            },
            callBack: callBack
        });
    }
    /*
     * 获取首页职位类型
     * @method getExpectJobType
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *      detailPage.getExpectJobType(function(data){
     *          console.log(data.data); //data.data 数组
     *          {
     *              choice_type: 1
     *               count: "836"
     *               field: "job_type"
     *               filter_category_name: "职位类型"
     *               name: "不限" // 职位类型
     *               value: "0"   // 职位类型ID
     *          }
     *      });
     * @since 2.6.5
    */
    getExpectJobType(callBack){
        this.sendData({
            method: "getExpectJobType",
            param:{
                info:'getExpectJobType'
            },
            callBack: callBack
        });
    }

    /*
     * 通知客户端职位偏好设置成功
     * @method setPreferencesSuccess
     * @public
     * @param {Number} isSuccess 1 成功 0 失败
     * @param {Function} callBack 回调函数
     * @example
     *      detailPage.setPreferencesSuccess(isSuccess);
     * @since 2.6.5
    */
    setPreferencesSuccess(isSuccess){
        this.sendData({
            method: "setPreferencesSuccess",
            param:{
                isSuccess:isSuccess
            }
        });
    }


}

export default new KCpreferencesPage({
    name: "preferencesPage",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "preferencesPage"
})