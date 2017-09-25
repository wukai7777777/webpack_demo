<template>
    <!-- page start -->
    <div class="mod-page js-success-page">
        <!-- section start -->
        <section class="mod-content submit">
            <div class="online-banner J_share" @click="shareTop()">
                <a href="#" class=""><img src="../../static/imgs/online/banner_submit.png" width="100%"></a>
            </div>
            <!-- form start -->
            <div class="form-widget">
                <div class="form-deliver">
                    <div class="deliver-title"><i class="icon-status"></i>特工提交成功</div>
                    <div class="deliver-tips">
                        <p><span class="js-submittime" >{{hours}}</span>小时内会给出审核结果，请耐心等待</p>
                    </div>

                    <div class="deliver-tips">
                        <p><span style="font-weight: bold;">温馨提示：</span>如您关注的公众号给您推送或者让您加QQ、微信或者其他聊天软件，以任何理由让您投入资金或缴纳押金等，请您提高警惕，联系客服010-57977077举报！</p>
                    </div>
                </div>
                <div class="form-tips">
                    <p>邀请好友注册斗米，您将额外获得好友特工收入的 10%作为奖励！</p>
                </div>
                <div class="form-opt">
                    <!-- <a href="doumi://jianzhimain?main_index=1" class="btn btn-primary btn-large js-touch-state js-goback-btn">返回申请更多的特工</a> -->
                    <!-- 特工分享，与其他一致 -->
                    <a class="btn btn-primary btn-large js-touch-state J_share" @click="shareBottom">邀友赚钱</a>
                </div>
            </div>
            <!-- form end -->
        </section>
        <!-- section end -->
    </div>
    <!-- page end -->
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCwidget from 'clientApi/KCwidget'
    import KCol_submitPage from 'clientApi/KCol_submitPage'
    import KCsocialApi from 'clientApi/KCsocialApi'
    import KCucApi from 'clientApi/KCucApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */

    /**
     *  组件实例对象
     */
    export default {
        components: {

        },
        data: function() {
            return {
                hours: 0,
                task_type: '',
                task_id: ''
            }
        },
        computed: {

        },
        methods: {
            /**
             * 初始化
             * @method initFun
             * @public
             * @return {Null} void
             */
            initFun () {
                var self = this;

                self.hours = Util.getQueryString('hours');
                self.task_type = Util.getQueryString('task_type');
                self.task_id = Util.getQueryString('task_id');

                KCloggerApi.addLog('1','/jianzhi/dmtg/'+self.task_type+'/detail/apply_success');
                KCloggerApi.addLog('0','特工提交成功页_展现&页面展现量&{"状态":"登录"}');
            },
            shareTop() {
                var self = this;

                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=share_top@task_id='+self.task_id);
                self.share();
            },
            shareBottom() {
                var self = this;

                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=share_bottom@task_id='+self.task_id);
                self.share();
            },
            share() {
                var self = this;

                KCsocialApi.olInviteShare(function(data){
                    if(data.status==1){
                        KCloggerApi.addLog('0','特工提交成功页_分享按钮点击&分享成功&{"分享到":"'+data.stateType+'"}');
                    }else{
                        KCloggerApi.addLog('0','特工提交成功页_分享按钮点击&分享失败&{"分享到":"'+data.stateType+'"}');
                    }
                });
                KCucApi.getUserInfo(function(data){
                    if(data.userId!=0){
                        KCloggerApi.addLog('0','特工提交成功页_分享按钮点击&分享按钮点击&{"状态":"已登录"}');
                    }else{
                        KCloggerApi.addLog('0','特工提交成功页_分享按钮点击&分享按钮点击&{"状态":"未登录"}');
                    }
                });
            }
        },
        beforeCreate() {

        },
        created() {
            this.initFun();
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/online_submit.css"></style>