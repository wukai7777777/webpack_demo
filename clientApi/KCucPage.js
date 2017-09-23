import KCpage from './KCpage'

class KCucPage extends KCpage{
	/**
     * 暂存取消帖子索引
     * @method stashChangeOfApplyList
     * @public
     * @param {String} option 添加还是移除 add代表添加 remove代表移除 
     * @param {Number} postId 帖子Id 
     * @return {void}
     * {data:信息}
     * @example
     *      UCPage.stashChangeOfApplyList(option, postId);
     * @since 2.4.0
     */
    stashChangeOfApplyList (option, pushData){
        this.sendData({
            method: "stashChangeOfApplyList",
            param: {
                option: option,
                domData: pushData
            }
        });
    }
    /**
     * 通知简历状态
     * @method resumeComplete
     * @public
     * @param {Boolean} status 状态
     * @return {void}
     * @example
     *      UCPage.resumeComplete(status);
     * @since 2.4.0
     */
    resumeComplete (status){
        this.sendData({
            method: "resumeComplete",
            param: {
                status: status
            }
        });
    }
    /**
     * 选择学校
     * @method selectSchoolName
     * @public
     * @param {void} 
     * @return {void}
     * @example
     *      UCPage.selectSchoolName();
     * @since 2.4.0
     */
    selectSchoolName (){
        this.sendData({
            method: "selectSchoolName",
            param: {
                "info": "selectSchoolName"
            }
        });
    }
	/**
     * domPosition
     * @method domPosition
     * @public
     * @param {Number} top 元素距离页面顶部的距离
     * @param {Number} height 元素的高度
     * @return {Null} void
     * @example
     *      widget.domPosition(top, height);
     * @since 2.1.0
     */
    domPosition(top, height){
        this.sendData({
            method:"domPosition",
            param: {
                top: top,
                height: height
            }
        });
    }
}

export default new KCucPage({
    name: "UCPage",
    author: "huochunyang",
    version: "2.0",
    jsbc: jsBridgeClient,
    nativeCls: "UCPage"
})