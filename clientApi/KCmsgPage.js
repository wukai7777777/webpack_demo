import KCpage from './KCpage'

class KCmsgPage extends KCpage{
	/*
     * 通知客户端消息已读
     * @method setMsgReaded
     * @param {String} string messageType 判断消息类型
     * @example
     *      msgPage.setMsgReaded(messageType);
     * @since 2.3.0
     */
     
    setMsgReaded (messageType){
        this.sendData({
            method: "setMsgReaded",
            param: {
                messageType: messageType
            }
        });
    }
	
}

export default new KCmsgPage({
    name: "msgPage",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "msgPage"
})