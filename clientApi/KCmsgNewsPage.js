
import KCpage from './KCpage'

class KCmsgNewsPage extends KCpage{
    /*
     * 获取章鱼资讯消息数据
     * @method getNewsList
     * @param {Number} number page
     * @param {Number} number pageSize 
     * @example
     *      KCmsgNewsPage.getNewsList(page, pageSize);
     * @since 2.3.0
     */
     
    getNewsList (page, pageSize, callBack){
        this.sendData({
            method: "getNewsList",
            param: {
                page: page,
                pageSize: pageSize
            },
            callBack: callBack
        });
    }
    
}

export default new KCmsgNewsPage({
    name: "msgNewsPage",
    author: "wukai",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "msgNewsPage"
})