import KCpage from './KCpage.js'
class KCapplyListPage extends KCpage{
    /*
     * 通知客户端职位状态变了
     * @method updateApply
     * @public
     * @param {String} tab_index 当前tab索引
     * @param {Object} post_opr 职位操作信息{post_id,opr},opr='cancel' or other
     * @example
     *      KCapplyListPage.updateApply('0','123122');
     * @since 2.8.0
     */
    updateApply (tab_index, post_opr){
        this.sendData({
            method: "updateApply",
            param: {
               "tab_index": tab_index,
               "post_opr": post_opr
            }
        });
    }
    

    /*
     * 通知客户端列表已更新完成
     * @method signIn
     * @example
     *      KCapplyListPage.updateJobListOver();
     * @since 2.8.0
     */
    updateJobListOver (){
        this.sendData({
            method: "updateJobListOver",
            param: {
                "info": 'updateJobListOver'
            }
        });
    }
}

export default new KCapplyListPage({
    name: "applyListPage",
    author: "lvixiaojiao",
    version: "3.0",
    jsbc: jsBridgeClient,
    nativeCls: "applyListPage"
})