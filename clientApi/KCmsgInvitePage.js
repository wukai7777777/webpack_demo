import KCpage from './KCpage'

class KCmsgInvitePage extends KCpage{
    /*
     * 获取工作邀约消息数据
     * @method getInviteList
     * @param {Number} number page
     * @param {Number} number pageSize 
     * @example
     *      KCmsgInviteList.getInviteList(page, pageSize);
     * @since 2.3.0
     */
     
    getInviteList (page, pageSize, callBack){
        this.sendData({
            method: "getInviteList",
            param: {
                "page": page,
                "pageSize": pageSize
            },
            callBack: callBack
        });
    }
    
}

export default new KCmsgInvitePage({
    name: "msgInvitePage",
    author: "lvxiaojiao",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "msgInvitePage"
})