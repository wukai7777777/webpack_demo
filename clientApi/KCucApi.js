import KCcore from './KCcore'

class KCucApi extends KCcore{
    /**
     * 登录
     * @method logIn
     * @public
     * @param  {String} phoneNumber 用户手机号
     * @param  {String} verifyCode 验证码
     * @example
     *      loginApi.logIn(num,code);
     * @since 1.0.0
     */
     logIn (phoneNumber,verifyCode,psw,json,callBack) {
        this.sendData({
            method: "logIn",
            param: {
               'mobile':phoneNumber,
               'code':verifyCode,
               'psw':psw,
               'json':json
            },
            callBack: callBack
        });
    }
    /**
     * 注册
     * @method register
     * @public
     * @param  {String} phoneNumber 用户手机号
     * @param  {String} verifyCode 验证码
     * @param  {String} psw 密码
     * @example
     *      loginApi.register(num,code);
     * @since 2.4.0
     */
     register (phoneNumber,verifyCode,psw,json,callBack) {
        this.sendData({
            method: "register",
            param: {
               'mobile':phoneNumber,
               'code':verifyCode,
               'password':psw,
               'json':json
            },
            callBack: callBack
        });
    }
    /**
     * 重置密码
     * @method reset
     * @public
     * @param  {String} phoneNumber 用户手机号
     * @param  {String} verifyCode 验证码
     * @param  {String} psw 密码
     * @example
     *      loginApi.reset(num,code);
     * @since 2.4.0
     */
     reset (phoneNumber,verifyCode,psw,json,callBack) {
        this.sendData({
            method: "reset",
            param: {
               'mobile':phoneNumber,
               'code':verifyCode,
               'password':psw,
               'json':json
            },
            callBack: callBack
        });
    }
    /**
     * 登出
     * @method logOut
     * @public
     * @param {null} void
     * @return {null} void
     * @example
     *        UCApi.logOut();
     * @since 1.0.0
     */
    logOut () {
        this.sendData({
            method: "logOut",
            param: {
                info:'logOut'
            }
        });
    }
    
    /**
     * 获取用户信息
     * @method getUserInfo
     * @public
     * @param {Function} callBack 回调函数
     * @return {Object}
     * {data:信息}
     * @example
     *      UCApi.getUserInfo(function(data){
     *          console.log(data);
     *      });
     * @since 2.3.0
     */
    getUserInfo (callBack){
        this.sendData({
            method: "getUserInfo",
            param: {
                "info": "getUserInfo"
            },
            callBack: callBack
        });
    }
    /**
     * 用户信息透传给客户端
     * @method setUserInfo
     * @public
     * @param {String} userId 
     * @param {String} grade 等级 
     * @param {String} score 积分 
     * @return {void}
     * {data:信息}
     * @example
     *      UCApi.setUserInfo(function(data){
     *          console.log(data);
     *      });
     * @since 2.3.0
     */
    setUserInfo (userId,grade,score,score_rate,resume_audit){
        this.sendData({
            method: "setUserInfo",
            param: {
                userId:userId,
                grade:grade,
                score:score,
                score_rate:score_rate,
                resume_audit:resume_audit
            }
        });
    }
    /**
     * 一键登录
     * @method fastLogin
     * @public
     * @example
     *      loginApi.fastLogin();
     * @since 1.0.0
     */
     fastLogin (callBack) {
        this.sendData({
            method: "fastLogin",
            param: {
               "info": "fastLogin"
            },
            callBack: callBack
        });
    }
}

export default new KCucApi({
    name: "UCApi",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "UCApi"
})