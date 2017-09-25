<template>
    
    <!-- 组件的模板 -->
    <!-- section start -->
    <section class="mod-content deliver">
        <!-- form start -->
        <div class="form-widget">
            <div class="form-deliver">
                <div class="deliver-title"><i class="icon-status icon-succeed"></i>设置成功</div>
                <div class="deliver-tips">
                    <p>如有合适职位，我们会第一时间通知您</p>
                </div>
            </div>
            <div class="form-opt">
                <button class="btn btn-primary btn-large" type="button" data-role="btn-list" @click="goToIndex()">查看职位</button>
            </div>
        </div>
        <!-- form end -->
    </section>
    <!-- section end -->
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCucPage from 'clientApi/KCucPage'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCPageCompleteResume from 'clientApi/KCPageCompleteResume'
    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */

    /**
     *  组件实例对象
     */
    export default {
        components: {

        },
        data: function(){
            return{
                
            }
        },
        vuex: {
            getters: {

            },
            actions: {

            }
        },
        methods: {
            /**
             *  初始化
             * @return {[type]} [description]
             */
            initFun() {
                var self = this;
                let from = Util.getQueryString('from') || 'IM';
                //通知客户端干掉完善简历
                KCPageCompleteResume.doResumeSuccess(from);
                 // 设置title bar 文案和动作
                KCucPage.updateTitleBar({
                    backAction: 'checkChange', //安卓
                    leftDisplay: false,
                    leftText: '',
                    leftAction: 'checkChange', //ios
                    rightDisplay: false,
                    rightText: '',
                    rightAction: ''
                });
                KCloggerApi.addLog('1', '/jianzhi/prefer/success');
                window.checkChange = function () {
                    if(from == 'applySuccess') {
                        //来源：报名成功页
                        KCcache.getCache('detailWebViewID', (detailWebViewID) => {
                            KCucPage.goBack(0, detailWebViewID.WebViewID);
                        })
                    }else {
                        //来源：IM 页面
                        KCucPage.goBack();
                    }
                }
            },
            /**
             * 返回首页
             * @return {[type]} [description]
             */
            goToIndex() {
                // @atype=click@ca_name=doumi@ca_source=app@from=wnyx_list@ca_from=seepost
                KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@from=wnyx_list@ca_from=seepost');
                KCcache.getCache('indexWebViewID', (backIndexData) => {
                    KCucPage.goBack(1, backIndexData.WebViewID);
                });
            }
        },
        created(){
            this.initFun();
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<!-- <style src="static/css/global.css"></style> -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/form.css"></style>
