import KCpage from './KCpage.js'

class KCol_submitPage extends KCpage{
    /**
     * 通知客户端提交页面提交成功
     * @method noticeSubmitSuccess
     * @public
     * @example
     *        ol_submitPage.noticeSubmitSuccess();
     * @since 2.5.0
     */
    noticeSubmitSuccess () {
        this.sendData({
            method: "noticeSubmitSuccess",
            param: {
                "info": "noticeSubmitSuccess"
            }
        });
    }
}

export default new KCol_submitPage({
    name: "kerkee ol_submitPage",
    author: "gulp",
    version: "1.0",
    jsbc: jsBridgeClient,
    nativeCls: "ol_submitPage"
})