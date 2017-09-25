<template>
    <!-- page start -->
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content" v-cloak>
        <!-- banner start-->
            <div class="mod-banner">
                <img src="../../static/imgs/online/banner_share.png">
            </div>
            <!-- banner end -->
            <!-- nav start -->
            <nav class="mod-nav com-border-bottom">
                <ul class="mod-flex">
                    <li class="mod-flex-item com-border-right" >
                        <a href="javascript:;" class="mod-nav-item" @click="goToMyInviteList()">
                            <em>我的邀约</em>
                            <b>{{dataObj.slavecount}}</b>个
                        </a>
                    </li>
                    <li class="mod-flex-item">
                        <a href="javascript:;" class="mod-nav-item" @click="goToMyInviteBonus()">
                            <em>我的分红</em>
                            <b>{{dataObj.totalbonus}}</b>元
                        </a>
                    </li>
                </ul>
            </nav>
            <!-- nav end -->
            <!-- btn start -->
            <div class="form-opt">
                <a href="javascript:;" class="btn btn-primary btn-large" @click="toShare($event)">邀友赚奖励</a>
            </div>
            <!-- btn end -->
            <!-- column start -->
            <div class="toplist mod-column bc-main com-space">
                <div class="mod-column-head com-border-bottom">
                    <h2 class="mod-column-title">邀约英雄榜<span class="fc-gray">{{dataObj.ranklist.month}}</span></h2>
                </div>
                <div class="mod-column-body">
                    <ol class="mod-list">
                        <li class="mod-list-item com-border-bottom" v-for="item in dataObj.ranklist.data">
                            <div class="mod-list-info product-info">
                                <div class="product-content">
                                    <h3 class="product-title">{{item.mobile}}</h3>
                                    <div class="product-meta"><span class="fc-gray">邀约{{item.person}}人</span></div>
                                </div>
                                <div class="product-aside">
                                    <div class="product-meta"><span class="fc-red">分红:{{item.get}}元</span></div>
                                </div>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
            <div class="rule mod-column bc-main com-space">
                <div class="mod-column-head com-border-bottom">
                    <h2 class="mod-column-title">邀约细则</h2>
                </div>
                <div class="mod-column-body">
                    <ul class="mod-list">
                        <li class="mod-list-item com-border-bottom">
                            <div class="mod-list-info product-info">
                                <h3 class="product-title">奖励规则</h3>
                                <div class="product-ds">
                                    <p>通过您分享的专属链接邀请好友注册斗米,好友注册并完成任务后,斗米会将好友特工收入的 10%给予您作为邀约奖励; 好友的特工申请审核通过后,邀约奖励会在第二天 16:00 统一发放。</p>
                                </div>
                            </div>
                        </li>
                        <li class="mod-list-item com-border-bottom">
                            <div class="mod-list-info product-info">
                                <h3 class="product-title">邀约关系</h3>
                                <div class="product-ds">
                                    <p>1、邀约关系永久有效,且不可逆</p>
                                    <p>B 用户通过 A 分享的链接新注册斗米后,A 邀约 B 的关系成立且永久有效,且 A 不可再通过 B 分享的链接注册斗米。</p>
                                    <p>2、一个用户最多只会被一个好友邀请,但可以邀约多个好友注册斗米,坐享提成</p>
                                    <p>B 用户被 A 邀请后,邀约上线就已固定为 A,不可再被 C 邀约;但用户 B 可以通过专属链接邀请 D、E、F...注册斗米。</p>
                                    <p>3、邀约关系不能传递</p>
                                    <p>用户 A 邀请了 B,用户 B 邀请了 C,不能视为用户 A 邀请了 C。</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- column end -->
        </section>
        <!-- section end -->
    </div>
    <!-- page end -->
</template>
<style type="text/css">
    [v-cloak] {
      display: none;
    }
</style>
<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCsocialApi from 'clientApi/KCsocialApi'
    import KCucApi from 'clientApi/KCucApi'
    import KCwidget from 'clientApi/KCwidget'
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
        data () {
            return {
                dataObj: {
                    slavecount: 0,
                    totalbonus: 0,
                    ranklist:{
                        mouth:'',
                        data:[]
                    }
                }
            }
        },
        computed: {

        },
        methods: {
            getSlavesummaryData() {
                var self = this;
                Util.ajax({
                    url:'/onlinetask/slavesummary',
                    timeout:10000,
                    ctrlStatus: {
                        loading: 1,
                        cache: true,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        // console.log(data);
                        if(!!data && data.code == 1000){
                            if(!!data.data.ranklist){
                                data.data.ranklist.month = '（' + data.data.ranklist.month + '）';
                            }
                            self.dataObj = data.data;
                        }else if(!!data && data.code == -100){
                            //未登录
                            KCucApi.logOut();
                        }else{
                            KCwidget.toast('服务器异常');
                        }
                    },
                    error:function(xhr, status){
                    },
                    noNetwork: function(){
                    }
                });
            },
            goToMyInviteList() {
                window.location.href = "doumi://offlineinvitelist";

                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=wdyy');
            },
            goToMyInviteBonus() {
                window.location.href = "doumi://offlineinvitebonus";

                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=wdfh');
            },
            toShare(event) {
                var self = this;
                event.preventDefault();

                KCucApi.getUserInfo(function(data){
                    if(data.userId != 0){
                        KCloggerApi.addLog('0','个人中心_分享赚钱页面_邀请好友来赚钱按钮点击&分享按钮点击&{"状态":"登录"}');
                    }else{
                        KCloggerApi.addLog('0','个人中心_分享赚钱页面_邀请好友来赚钱按钮点击&分享按钮点击&{"状态":"未登录"}');
                    }
                });

                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=yyzq');
                
                KCsocialApi.olInviteShare(function(data){
                    if(data.status == 1){
                        KCloggerApi.addLog('0','个人中心_分享赚钱页面_邀请好友来赚钱按钮点击&分享成功&{"分享到":"' + data.stateType + '"}');
                    }else{
                        KCloggerApi.addLog('0','个人中心_分享赚钱页面_邀请好友来赚钱按钮点击&分享失败&{"分享到":"' + data.stateType + '"}');
                    }
                });
            }
        },
        beforeCreate() {

        },
        created() {
            let self = this;
            KCucApi.getUserInfo(function(data){
                if(data.userId != 0){
                    KCloggerApi.addLog('0','个人中心_分享赚钱页面_展现&页面展现量&{"状态":"登录"}');
                }else{
                    KCloggerApi.addLog('0','个人中心_分享赚钱页面_展现&页面展现量&{"状态":"未登录"}');
                }
            });

            self.getSlavesummaryData();
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/online_offline.css"></style>