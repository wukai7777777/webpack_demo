import KCcore from './KCcore'

class KCsocialApi extends KCcore{
	/**
     * 去客户端请求微信绑定数据
     * @method bindWeixin
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * @example
     *      SocialApi.bindWeixin(function(data){
     *          console.log(data);
     *      });
     * @since 2.2.0
     */
    bindWeixin (callBack) {
        this.sendData({
            method: "bindWeixin",
            param: {
                "info": "bindWeixin"
            },
            callBack: callBack
        });
    }
    /**
     * 分享
     * @method share
     * @public
     * @param {Json} Json 分享信息
     * @return {Null} void
     * @example
     *      widget.share(json);
     * @since 2.6.0
     */
    share (shareData, from, shareType){
        this.sendData({
            method: "share",
            param: {
                shareType: shareType,
                from: from,
                shareData: shareData
            }
        });
    }

    /**
     * 特工分享
     * @method olInviteShare
     * @public
     * @param {Function} Function 回调
     * @return {Null} void
     * @example
     *      widget.olInviteShare(function(data){
     *          data.status==1 //成功  
     *          data.stateType  //分享的路径   QQ,微信等   
     *      });
     * @since 2.7.0
     */
    olInviteShare (callBack){
        this.sendData({
            method:"olInviteShare",
            param: {
                info:'olInviteShare'
            },
            callBack:callBack
        });
    }
	
}

export default new KCsocialApi({
    name: "socialApi",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "socialApi"
})