import KCpage from './KCpage.js'
class KCPageCompleteResume extends KCpage{

    /**
     * 3.0.0
     * 获取用户在引导页填写信息
     * @param  {[type]} callBack [description]
     * @return {[type]}          [description]
     */
    getResumeInfo (callBack) {
        this.sendData({
            method: "getResumeInfo",
            param: {
                "info": "getResumeInfo"
            },
            callBack: callBack
        });
    }
     /**
     * 通知客户端完善简历设置成功，干掉完善简历页
     * page: applySuccess 报名成功页，IM im页面
     * @return {[type]} [description]
     */
    doResumeSuccess(page) {
        this.sendData({
            method: "doResumeSuccess",
            param: {
                "page": page
            }
        });
    }
}

export default new KCPageCompleteResume({
    name: "completeResumePage",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "completeResumePage"
})