<template>
    <!-- 未登录 -->
    <section class="mod-content personal">
        <!-- 已登录 -->
        <div class="user" v-if="loginStatus">
            <div class="user-avatar">
                <a href="javascript:;" @click="goToLogin($event)"><img src="../../static/imgs/default.png"></a>
            </div>
            <div class="user-name"><a href="javascript:;" @click="goToLogin($event)">登录/注册</a></div>
        </div>
        <div class="user" v-else>
            <div class="user-avatar">
                <a href="javascript:;">
                    <img :src="userInfo.logo" alt="" v-if="userInfo.logo">
                    <img src="../../static/imgs/default.png" alt="" v-else>
                </a>
            </div>
            <div v-if="!!userInfo.real_name" class="user-name">{{userInfo.real_name}}</div>
            <div v-else class="user-name">{{userInfo.nick_name}}</div>
            <div class="user-phone"><i class="icon icon-phone"></i>{{userInfo.mobile}}</div>
            <div class="user-member">
                <template v-if="userInfo.audit_status == -1 || userInfo.audit_status == 2 || userInfo.audit_status == -404" >
                    <a href="javascript:;" @click="goToClub('上面','zyjlb_top')">{{userInfo.status_desc}}</a>
                </template>
                <template v-else>
                    <i v-if="userInfo.audit_status != -100 && (!!userInfo.grade || userInfo.grade == 0)" :class="'icon icon-level-' + userInfo.grade"></i>{{userInfo.grade_name}}
                </template>
            </div>
        </div>
        <div class="wallet bc-main" v-if="!loginStatus">
            <ul class="mod-list mod-flex com-border-bottom">
                <li class="mod-list-item mod-flex-item com-border-right" @click="setMaidian('userwallet',{'0':'钱包入口'},{'2':'wallet'})">
                    <a href="javascript:;" class="mod-list-info wallet-info">
                        <span class="wallet-item fc-gray">钱包余额</span>
                        <b class="wallet-value fc-red">{{userInfo.balance}}</b>
                        <span class="fc-gray">元</span>
                        <span class="wallet-opt">提现</span>
                    </a>
                </li>
                <li class="mod-flex-item com-border-right" @click="setMaidian('duiba',{'0':'积分入口'},{'2':'exchange'})">
                    <a href="javascript:;" class="mod-list-info wallet-info">
                        <span class="wallet-item fc-gray">积分</span>
                        <b class="wallet-value fc-red">{{userInfo.score}}</b>
                        <span class="fc-gray">分</span>
                        <span class="wallet-opt">兑换奖品</span>
                    </a>
                </li>
            </ul>
        </div>
        <ul class="menu mod-list bc-main com-border-bottom com-space">
            <li class="mod-list-item com-border-bottom" @click="goToApplyList">
                <a href="javascript:;" class="mod-list-info com-arrow-right"><i class="icon icon-package"></i>我的兼职</a>
            </li>
            <li class="mod-list-item com-border-bottom" @click="resumeFn">
                <a href="javascript:;" class="mod-list-info com-arrow-right"><i class="icon icon-resume"></i>我的简历</a>
            </li>
            <li class="mod-list-item com-border-bottom" @click="favoriteFn">
                <a href="javascript:;" class="mod-list-info com-arrow-right"><i class="icon icon-bookmark"></i>我的收藏</a>
            </li>
            <li class="mod-list-item com-border-bottom" @click="setPreferences($event)" >
                <a href="javascript:;" class="mod-list-info com-arrow-right"><i class="icon icon-preference"></i>我的偏好</a>
            </li>
        </ul>
        <ul class="menu mod-list bc-main com-border-bottom com-space">
            <li class="mod-list-item com-border-bottom" @click="goToEarnScore">
                <a href="javascript:;" class="mod-list-info com-arrow-right"><i class="icon icon-integral"></i>做任务赚积分</a>
            </li>
            <li class="mod-list-item com-border-bottom" @click="clubFn">
                <a href="javascript:;" class="mod-list-info com-arrow-right"><i class="icon icon-member"></i>章鱼俱乐部<span class="ds fr fc-red">加入会员享积分奖励</span></a>
            </li>
            <li class="mod-list-item com-border-bottom" @click="setMaidian('offlineshare',{'2':'yyzq'})" v-show="showShare == 1">
                <a href="javascript:;" class="mod-list-info com-arrow-right"><i class="icon icon-recommend"></i>邀友赚钱<span class="ds fr fc-gray">好友做特工我也赚钱</span></a>
            </li>
        </ul>
        <ul class="menu mod-list bc-main com-border-bottom com-space">
            <li class="mod-list-item com-border-bottom">
                <a :href="hireUrl" class="mod-list-info com-arrow-right"><i class="icon icon-zhaoren"></i>我要招人</a>
            </li>
            <li class="mod-list-item com-border-bottom" @click="phoneCall()">
                <a href="javascript:;" class="mod-list-info com-arrow-right"><i class="icon icon-contact"></i>联系客服<span class="ds fr fc-red">{{loginStatus ? defaultNumber : userInfo.service_phone}}</span></a>
            </li>
            <li class="mod-list-item com-border-bottom" @click="setMaidian('',{'2':'complain_feedback'})">
                <a :href="'doumi://complain-and-feedback?webViewId=' + pageId" class="mod-list-info com-arrow-right"><i class="icon icon-feedback"></i>投诉与反馈</a>
            </li>
             <li class="mod-list-item com-border-bottom" @click="setMaidian('settings',{'2':'setting'})"  v-if="!loginStatus">
                <a href="javascript:;" class="mod-list-info com-arrow-right"><i class="icon icon-option"></i>设置</a>
            </li>
        </ul>
    </section>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCsettingsApi from 'clientApi/KCsettingsApi'
    
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
        data (){
            return{
                pageId: '',
                loginStatus: true,
                userInfo: {},
                showShare: false,
                defaultNumber: '010-57977077',
                hireUrl: 'doumi://browser/https://b.doumi.com/cwap/pubchoice'//?ca_source=app&ca_name=doumi&ca_from=dmapp_uc_fbzpxx
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
            initFun (){
                let self = this;
                KCsettingsApi.getSettingsOfAppReview((data) => {
                    self.showShare = data.isShowYYZQ;
                } );
                KCucApi.getUserInfo((data) => {
                    if(!!data.userId && data.userId!='0') {//登录状态
                        // 先获取缓存中的数据
                        KCcache.getCache('accountData' , (cacheData) => {
                            if (!!cacheData && data.userId == cacheData.user_id) {
                                //同一账号先显示缓存
                                self.loginStatus = false;
                                self.userInfo = cacheData;
                            } else {
                                self.loginStatus = true;
                            }
                            self.getUserInfo();//更新数据
                        });
                    }else {//未登录状态
                        KCucPage.dataDownloadFinished();
                        self.loginStatus = true;
                    }
                });

                //请求我要招人url
                self.getHireUrl();

                /**
                 * 获取页面唯一标记
                 * @param  {[type]} (data [description]
                 * @return {[type]}       [description]
                 */
                KCucPage.getWebViewID((data)=>{
                    this.pageId = data;
                    KCcache.setCache('accountWebViewID',{'WebViewID': data}, 3 * 24 * 60 * 60);
                });
            },
            /**
             * 获取个人中心用户信息
             * @return null
             */
            getUserInfo() {
                var self = this;
                Util.ajax({
                    url:'/ucenter/index',
                    data:{
                        platform:Util.OS(),
                        token:''
                    },
                    ctrlStatus: {
                        loading: 0,
                        cache: true,
                        errNum: 0,
                        netNum: 0
                    },
                    timeout:10000,
                    success:function(data) {
                        self.loginStatus = false;
                        KCucPage.dataDownloadFinished();
                        if(!!data && !!data.user_id) {
                            if(data.score=='0' || !data.score){
                                data.score='0';
                            }
                            data.grade=parseInt(data.grade) + 1;
                            // 手机号脱敏处理
                            if(!!data.mobile) {
                                let mobileStr = data.mobile + '';
                                data.mobile = mobileStr.length > 0 ? mobileStr.substring(0,3) + '*****' + mobileStr.substring(8,11) : mobileStr;
                            }
                            self.userInfo = data;
                            KCcache.setCache('accountData',data, 3 * 24 * 60 * 60);
                            KCucApi.setUserInfo(data.user_id,data.grade,data.score,data.score_rate,data.resume_audit);
                        } else {
                            KCwidget.toast('服务器异常');
                        }
                    },
                    error:function(xhr, status){
                        KCucPage.dataDownloadFinished();
                        
                    },
                    noNetwork: function(){
                        KCucPage.dataDownloadFinished();
                    }
                });
            },
            getHireUrl () {
                let self = this;
                Util.ajax({
                    apiPath: '/api/v3/client',
                    url:'/ucenter/pubchoice',
                    timeout:10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: true,
                        errNum: 0,
                        netNum: 0
                    },
                    success:function(data) {
                        if(!!data) {
                            self.hireUrl = `doumi://browser/${data.pubchoice}`;
                        }
                    },
                    error:function(xhr, status){
                        
                    },
                    noNetwork: function(){

                    }
                });
            },
            /**
             * 跳转至登录页
             * @return {[type]} [description]
             */
            goToLogin(event) {
                event.preventDefault();
                KCloggerApi.addLog('0','登录／注册&登录／注册入口点击&{"注册登录":"点击"}');
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=login_reg');
                window.location.href = 'doumi://login';
            },
            /**
             * 联系客服
             * 拨打电话并且埋点
             * @return {[type]} [description]
             */
            phoneCall() {
                let phoneNumber = this.loginStatus ? this.defaultNumber : this.userInfo.service_phone;
                KCclientUI.showPhoneDialog(phoneNumber,'','呼叫','取消','Service',function(data){
                    if(data.status==1){}
                });
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=lxkf');
            },
            resumeFn () {
                let self = this;
                if (self.loginStatus) {
                    self.setMaidian('resume',{'2':'my_profile'});
                } else {
                    self.setMaidian('resume',{'0':'我的简历'},{'2':'my_profile'});
                }
            },
            favoriteFn () {
                let self = this;
                if (self.loginStatus) {
                    self.setMaidian('favorite',{'2':'my_collect'});
                } else {
                    self.setMaidian('favorite',{'0':'我的收藏'},{'2':'my_collect'});
                }
            },
            clubFn() {
                let self = this;
                if (self.loginStatus) {
                    self.setMaidian('login',{'2':'zyjlb_bottom'});
                } else {
                    self.goToClub('下面','zyjlb_bottom');
                }
            },
            /**
             * 设置偏好
             * 跳转页面并埋点
             */
            setPreferences(event) {
                event.preventDefault();
                KCloggerApi.addLog('0','职位偏好设置_点击&来源&{"个人中心_职位偏好":"点击"}');
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=my_prefer');
                window.location.href = 'doumi://userpreferences';
            },
            /**
             * 跳转我的兼职页面
             * @return {[type]} [description]
             */
            goToApplyList(){
                this.setMaidian(null,{'2':'my_apply'});
                let title=encodeURIComponent("我的兼职");
                let subtitle=encodeURIComponent("全部,已报名,已录取,已拒绝");//v3.0.0全部,已报名,已录取,已结束=》全部,已报名,已录取,已拒绝
                window.location.href="doumi://applylist/?title="+title+"&subtitle="+subtitle+"&subpath=apply-list.html";
            },
            /**
             *  跳转至章鱼俱乐部页面并埋点
             * @param  {[type]} info [description]
             * @param  {[type]} from [description]
             * @return {[type]}      [description]
             */
            goToClub(info,from) {
                window.location.href='doumi://browser/' + encodeURIComponent(this.userInfo.club_url);
                KCloggerApi.addLog('0','个人中心&点击章鱼俱乐部&{"章鱼俱乐部":"'+info+'"}');  
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from='+from);
            },
            /**
             * 跳转至赚积分页面并埋点
             * @return {[type]} [description]
             */
            goToEarnScore() {
                KCloggerApi.addLog('0','赚积分入口_点击&赚积分入口_点击&{"点击":"个人中心"}');
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=zrw_zjf'); 
                window.location.href = 'doumi://EarnScore?from=grzx';
            },
            /**
             * 埋点公共方法
             * @param {[type]}    url [description]
             * @param {...[type]} res [description]
             */
            setMaidian(url,...res) {
                res.forEach(function(e,i,a){
                    for(let key in e){
                        let from = e[key];
                        let spFromArr = [
                            {id: 'wallet', text: '钱包入口'}, 
                            {id: 'exchange', text: '积分入口'}, 
                            {id: 'my_apply', text: '我的兼职'},
                            {id: 'my_profile', text: '我的简历'},
                            {id: 'my_collect', text: '我的收藏'}
                        ];
                        let spFrom = spFromArr.filter((item) => {
                            return item.id == from;
                        });
                        if (!self.loginStatus && spFrom.length != 0) {
                            KCloggerApi.addLog('0', '个人中心&点击' + spFrom[0].text + '&{"个人中心":"点击' + spFrom[0].text + '"}');
                        }
                        KCloggerApi.addLog(key, '@atype=click@ca_name=doumi@ca_source=app@ca_from='+from);
                    }
                })
                if(url){
                    window.location.href = 'doumi://' + url;
                }
            }
        },
        created(){
            this.initFun();
            window.loadData = this.initFun;
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/personal.css"></style>