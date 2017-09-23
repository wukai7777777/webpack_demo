<template>
    
    <div class="mod-page">
        <!-- header start -->
        
        <!-- header end -->
        <!-- section start -->
        <section class="mod-content integral">
            <!-- banner start -->
            <div class="mod-banner"><img src="../../static/imgs/banner_integral.jpg" alt="" @click="toDuiba"></div>
            <!-- banner end -->
            <!-- link start -->
            <!-- <div class="mod-adv bc-main com-border-bottom">
                <a href="doumi://duiba" class="mod-adv-info com-arrow-right">更多商品，进入积分商城</a>
            </div> -->
            <!-- link end -->
            <!-- column start -->
            <div class="task mod-column bc-main com-space">
                <div class="mod-column-head com-border-bottom">
                    <h2 class="mod-column-title">每日任务</h2>
                </div>
                <div class="mod-column-body">
                    <ul class="mod-list">
                        <li class="mod-list-item com-border-bottom active">
                            <a href="javascript:;" class="product-info mod-list-info com-arrow-right">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>5积分</b>每日启动APP</span></h3>
                                    <div class="product-meta"><span class="fc-gray">启动APP获积分奖励</span></div>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">已完成</span></div>
                                </div>
                            </a>
                        </li>

                        <li class="mod-list-item com-border-bottom" v-bind:class="{active:signinActive}" @click="clickEvents('signin')">
                            <a href="javascript:;" class="product-info mod-list-info com-arrow-right">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>10积分</b>每日签到</span></h3>
                                    <div class="product-meta"><span class="fc-gray">连续签到有惊喜</span></div>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">{{siginText}}</span></div>
                                </div>
                            </a>
                        </li>

                        <li class="mod-list-item com-border-bottom" v-bind:class="{active:applyJobActive}" @click="clickEvents('applyJob')">
                            <a v-bind:href="applyJobUrl" class="product-info mod-list-info com-arrow-right">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>3积分</b>报名兼职工作</span></h3>
                                    <div class="product-meta"><span class="fc-gray">还可以获得{{applyJobCount}}次积分奖励</span></div>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">{{applyJobText}}</span></div>
                                </div>
                            </a>
                        </li>
                        
                        <!--探索版去掉-->
          <!--               <li class="mod-list-item com-border-bottom" v-bind:class="{active:applyOnlineJobActive}" @click="clickEvents('applyOnlineJob')" v-show="displayTegong==1">
                            <a v-bind:href="applyOnlineJobUrl" class="product-info mod-list-info com-arrow-right">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>2积分</b>领取特工任务</span></h3>
                                    <div class="product-meta"><span class="fc-gray">还可以获得{{applyOnlineJobCount}}次积分奖励</span></div>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">{{applyOnlineJobText}}</span></div>
                                </div>
                            </a>
                        </li> -->


                        <li class="mod-list-item com-border-bottom" v-bind:class="{active:sharetegongActive}">
                            <a v-bind:href="sharetegongUrl" class="product-info mod-list-info com-arrow-right" @click="clickEvents('sharetegong')">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>3积分</b>分享斗米任务</span></h3>
                                    <div class="product-meta"><span class="fc-gray">还可以获得{{sharetegongCount}}次积分奖励</span></div>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">{{sharetegongText}}</span></div>
                                </div>
                            </a>
                        </li>
                        <li class="mod-list-item com-border-bottom" v-bind:class="{active:postsActive}">
                            <a v-bind:href="postsUrl" class="product-info mod-list-info com-arrow-right" @click="clickEvents('posts')">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>12积分</b>连续浏览15条兼职</span></h3>
                                    <div class="product-meta"><span class="fc-gray">今天已浏览{{postsCount}}条兼职信息</span></div>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">{{postsText}}</span></div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="task mod-column bc-main com-space">
                <div class="mod-column-head com-border-bottom">
                    <h2 class="mod-column-title">新手任务</h2>
                </div>
                <div class="mod-column-body">
                    <ul class="mod-list">
                        <li class="mod-list-item com-border-bottom" v-bind:class="{active:resumeActive}">
                            <a v-bind:href="resumeUrl" class="product-info mod-list-info com-arrow-right" @click="clickEvents('resume')">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>12积分</b>完善简历</span></h3>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">{{resumeText}}</span></div>
                                </div>
                            </a>
                        </li>
                        <li class="mod-list-item com-border-bottom" v-bind:class="{active:IDCardActive}">
                            <a v-bind:href="IDCardUrl" class="product-info mod-list-info com-arrow-right" @click="clickEvents('IDCard')">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>15积分</b>实名认证</span></h3>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">{{IDCardText}}</span></div>
                                </div>
                            </a>
                        </li>
                        <li class="mod-list-item com-border-bottom" v-bind:class="{active:preferenceActive}">
                            <a v-bind:href="preferenceUrl" class="product-info mod-list-info com-arrow-right" @click="clickEvents('preference')">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>5积分</b>设置职位偏好</span></h3>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">{{preferenceText}}</span></div>
                                </div>
                            </a>
                        </li>
                        <li class="mod-list-item com-border-bottom" v-bind:class="{active:applyActive}">
                            <a v-bind:href="applyUrl" class="product-info mod-list-info com-arrow-right" @click="clickEvents('apply')">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>5积分</b>报名兼职</span></h3>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">{{applyText}}</span></div>
                                </div>
                            </a>
                        </li>
                        <li class="mod-list-item com-border-bottom" v-bind:class="{active:duibaActive}">
                            <a v-bind:href="duibaUrl" class="product-info mod-list-info com-arrow-right" @click="clickEvents('duiba')">
                                <div class="product-content">
                                    <h3 class="product-title"><span><b class="tag-integral"><i class="icon icon-integral-sm"></i>5积分</b>兑换奖品</span></h3>
                                </div>
                                <div class="product-aside">
                                    <div class="product-opt"><span class="fc-red">{{duibaText}}</span></div>
                                </div>
                            </a>
                        </li>
                    </ul>
                    
                </div>
            </div>
            <!-- column end -->
        </section>
        <!-- section end -->
    </div>
        
</template>

<script>
    /**
     *  引入工具类库 或 Native API
    **/
    import KCearnScorePage from 'clientApi/KCearnScorePage'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import Util from '../../tool/widget/Util' 
    
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
                signin: 0,
                signinActive:false,
                siginText:'去签到',
                sharetegong: 0,
                sharetegongActive:false,
                sharetegongUrl:'javascript:;',
                sharetegongCount:5,
                sharetegongText:'去分享',
                posts: 0,
                postsActive:false,
                postsCount:0,
                postsUrl:'javascript:;',
                postsText:'去浏览',

                resume: 0,
                resumeActive:false,
                resumeUrl:'javascript:;',
                resumeText:'去完善',
                IDCard: 0,
                IDCardActive:false,
                IDCardUrl:'javascript:;',
                IDCardText:'去认证',
                preference: 0,
                preferenceActive:false,
                preferenceUrl:'javascript:;',
                preferenceText:'去设置',
                apply: 0,
                applyActive:false,
                applyUrl:'javascript:;',
                applyText:'去报名',
                duiba: 0,
                duibaActive:false,
                duibaUrl:'javascript:;',
                duibaText:'去兑换',
                finishText:'已完成',
                from: Util.getQueryString('from'),
                caTest: 0,  //2.8.5埋点测试

                applyJobActive: false,
                applyJobCount: 3,
                applyJobText: '去报名',
                applyJobUrl: 'javascript:;',

                applyOnlineJobActive: false,
                applyOnlineJobCount: 3,
                applyOnlineJobText: '去领取',
                applyOnlineJobUrl: 'javascript:;',
                displayTegong: 1 // 判断领取特供任务显示 0:不显示 1:显示
            }
        },
        vuex: {
            getters: {

            },
            actions: {

            }
        },
        methods: {
            toDuiba(){
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=jfsc',self.caTest);
                KCloggerApi.addLog('0','积分商城_点击量&积分商城_点击量&{"点击":"赚积分页面"}');
                window.location.href="doumi://duiba";
            },
            renderPage(){
                var self=this;
                KCearnScorePage.getData(function(data){
                    self.displayTegong = data.displayTegong;
                    // 报名兼职
                    if(data.applyJob == 0){
                        self.applyJobActive = true;
                        self.applyJobText = self.finishText;
                        self.applyJobCount = 0;
                        self.applyJobUrl='javascript:;';
                        KCloggerApi.addLog('0','任务完成量&具体任务_完成量&{"完成量":"报名兼职_每日任务"}');
                    }else{
                        self.applyJobText = '去报名';
                        self.applyJobCount = data.applyJob;
                        self.applyJobActive = false;
                        self.applyJobUrl = 'doumi://jianzhimain?main_index=0';
                    }


                    // 领取特工任务
                    // if(data.applyOnlineJob == 0){
                    //     self.applyOnlineJobActive = true;
                    //     self.applyOnlineJobText = self.finishText;
                    //     self.applyOnlineJobCount = 0;
                    //     self.applyOnlineJobUrl='javascript:;';
                    //     KCloggerApi.addLog('0','任务完成量&具体任务_完成量&{"完成量":"领取特工任务"}');
                    // }else{
                    //     self.applyOnlineJobText = '去领取';
                    //     self.applyOnlineJobCount = data.applyOnlineJob;
                    //     self.applyOnlineJobActive = false;
                    //     self.applyOnlineJobUrl = 'doumi://jianzhimain?main_index=1';
                    // }

                    if(data.signin==0){
                        self.signin=0;
                        self.signinActive=false;
                    }else{
                        self.signin=1;
                        self.signinActive=true;
                        self.siginText=self.finishText;
                        KCloggerApi.addLog('0','任务完成量&具体任务_完成量&{"完成量":"签到"}');
                    }

                    // doumi://offlinesharetegong
                    self.sharetegongCount = 5-data.sharetegongCount;
                    if(data.sharetegong==0){
                        self.sharetegongUrl='doumi://offlineshare';
                        self.sharetegong=0;
                        self.sharetegongActive=false;
                    }else{
                        self.sharetegongUrl='javascript:;';
                        self.sharetegong=1;
                        self.sharetegongActive=true;
                        self.sharetegongText=self.finishText;
                        KCloggerApi.addLog('0','任务完成量&具体任务_完成量&{"完成量":"分享斗米任务"}');
                    }

                    self.postsCount=data.postsCount;
                    if(data.posts==0){
                        self.postsActive=false;
                        self.posts=0;
                        self.postsUrl='doumi://jianzhimain?main_index=0';
                    }else{
                        self.postsActive=true;
                        self.posts=1;
                        self.postsUrl='javascript:;';
                        self.postsText=self.finishText;
                        KCloggerApi.addLog('0','任务完成量&具体任务_完成量&{"完成量":"浏览帖子"}');
                    }

                    if(data.resume==0){
                        self.resume=0;
                        self.resumeActive=false;
                        self.resumeUrl='doumi://resume';
                    }else{
                        self.resume=1;
                        self.resumeActive=true;
                        self.resumeUrl='javascript:;';
                        self.resumeText=self.finishText;
                        KCloggerApi.addLog('0','任务完成量&具体任务_完成量&{"完成量":"完善简历"}');
                    }


                    if(data.IDCard==0){
                        self.IDCard=0;
                        // http://m.doumi.com/member/intro
                        self.IDCardUrl='doumi://browser/'+encodeURIComponent('http://m.doumi.com/member/intro');
                        self.IDCardActive=false;
                    }else{
                        self.IDCard=1;
                        self.IDCardUrl='javascript:;';
                        self.IDCardActive=true;
                        self.IDCardText=self.finishText;
                        KCloggerApi.addLog('0','任务完成量&具体任务_完成量&{"完成量":"实名认证"}');
                    }

                    if(data.preference==0){
                        self.preference=0;
                        self.preferenceUrl='doumi://userpreferences';
                        self.preferenceActive=false;
                    }else{
                        self.preference=1;
                        self.preferenceUrl='javascript:;';
                        self.preferenceActive=true;
                        self.preferenceText=self.finishText;
                        KCloggerApi.addLog('0','任务完成量&具体任务_完成量&{"完成量":"设置职位偏好"}');
                    }

                    if(data.apply==0){
                        self.apply=0;
                        self.applyUrl='doumi://jianzhimain?main_index=0';
                        self.applyActive=false;
                    }else{
                        self.apply=1;
                        self.applyUrl='javascript:;';
                        self.applyActive=true;
                        self.applyText=self.finishText;
                        KCloggerApi.addLog('0','任务完成量&具体任务_完成量&{"完成量":"报名兼职_新手任务"}');
                    }
                    if(data.duiba==0){
                        self.duiba=0;
                        self.duibaUrl='doumi://duiba';
                        self.duibaActive=false;
                    }else{
                        self.duiba=1;
                        self.duibaUrl='javascript:;';
                        self.duibaActive=true;
                        self.duibaText=self.finishText;
                        KCloggerApi.addLog('0','任务完成量&具体任务_完成量&{"完成量":"兑换奖品"}');
                    }

                });
            },
            // signFn(){
            //     var self=this;
            //     if(self.signin==0){
            //         KCearnScorePage.signIn();
            //     }
            // },
            // pullData(param){
            //     var self=this;
            //     if(param==0){
            //         KCearnScorePage.pullData(1);
            //     }   
            // },
            clickEvents(type){
                var self=this;
                if(type=='signin' && self.signin==0){
                    KCearnScorePage.signIn();
                    KCloggerApi.addLog('0','任务类型_点击&每日任务_点击&{"点击":"每日签到"}');
                    //2.8.5 每日签到埋点
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=mrqd',self.caTest);

                }else if(type=='sharetegong' && self.sharetegong==0){
                    KCloggerApi.addLog('0','任务类型_点击&每日任务_点击&{"点击":"分享斗米任务"}');
                    //2.8.5 分享任务埋点
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=fxrw',self.caTest);
                }else if(type=='posts' && self.posts==0){
                    KCloggerApi.addLog('0','任务类型_点击&每日任务_点击&{"点击":"连续浏览兼职信息"}');
                    //2.8.5 连续浏览埋点
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=lxll',self.caTest);
                }else if(type=='applyJob' && !self.applyJobActive) {
                    KCloggerApi.addLog('0','任务类型_点击&每日任务_点击&{"点击":"报名兼职工作"}');
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=bmjz_top');
                }else if(type=='applyOnlineJob' && !self.applyOnlineJobActive) {
                    KCloggerApi.addLog('0','任务类型_点击&每日任务_点击&{"点击":"领取特工任务"}');
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=lqtg');
                }else if(type=='resume' && self.resume==0){
                    KCloggerApi.addLog('0','任务类型_点击&新手任务_点击&{"点击":"完善简历"}');
                    //2.8.5 完善简历
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=wsjl',self.caTest);
                }else if(type=='IDCard' && self.IDCard==0){
                    KCearnScorePage.pullData(1);
                    KCloggerApi.addLog('0','任务类型_点击&新手任务_点击&{"点击":"实名认证"}');
                    //2.8.5 实名认证埋点
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=smrz',self.caTest);
                }else if(type=='preference' && self.preference==0){
                    KCearnScorePage.pullData(1);
                    KCloggerApi.addLog('0','任务类型_点击&新手任务_点击&{"点击":"设置职位偏好"}');
                    //2.8.5 设置职位偏好埋点
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=szph',self.caTest);
                }else if(type=='apply' && self.apply==0){
                    KCearnScorePage.pullData(1);
                    KCloggerApi.addLog('0','任务类型_点击&新手任务_点击&{"点击":"报名兼职"}');
                    //2.8.5 报名兼职埋点
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=bmjz',self.caTest);
                }else if(type=='duiba' && self.duiba==0){
                    KCearnScorePage.pullData(1);
                    KCloggerApi.addLog('0','任务类型_点击&新手任务_点击&{"点击":"兑换奖品"}');
                    //2.8.5 兑换奖品埋点
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+self.from+'@ca_from=dhlp',self.caTest);
                }
            }
        },
        created(){
            var self=this;
            self.renderPage(); 
            window.loadData=function(){
                self.renderPage();
            };
            // KCloggerApi.addLog('0','赚积分页面_展现量&赚积分页面展现量&'); 

            // 添加赚积分入口埋点ls
            let logText = self.from == 'qdcg' ? '签到成功页' : self.from == 'grzx' ? '个人中心' : '积分商城';
            KCloggerApi.addLog('0','赚积分入口_点击&赚积分入口点击&{"点击":'+logText+'}');
            KCloggerApi.addLog('0','赚积分页面_展现量&赚积分页面_展现量&{"展现量": '+logText+'}');
        }
        
    }

    
</script>
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/integral.css"></style>




