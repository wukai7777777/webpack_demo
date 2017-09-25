<template>
<div>
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content integral" v-show="isMove && loading">
            <!-- detail start -->
            <div class="detail bc-main com-border-bottom">
                <div class="product-info"><span>可用积分</span><b>{{totalScore}}</b></div>
                <a @click="showRule" href="javascript:;" class="product-opt" data-role="link-rule">点击查看积分规则</a>
            </div>
            <!-- detail end -->
            <!-- column start -->
            <div class="record mod-column bc-main com-space">
                <div class="mod-column-head com-border-bottom hide">
                    <h2 class="mod-column-title">积分记录</h2>
                </div>
                <div class="mod-column-body">
                    <ul class="mod-list" v-for="item in itemsList">
                        <li class="mod-list-item com-border-bottom">
                            <div class="mod-list-info product-info">
                                <div class="product-content">
                                    <h3 class="product-title">{{item.description}}</h3>
                                    <div class="product-meta"><span class="fc-gray">{{item.create_at}}</span></div>
                                </div>
                                <div class="product-aside">
                                    <div class="product-meta"><span class="fc-red">{{item.score}}分</span></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-show="isShowLoadAction" class="mod-status-box">
                        <div class="mod-status active">
                            <span class="icon-loading"></span>加载中...
                        </div>
                    </div>
                </div>
            </div>
            <!-- column end -->
        </section>
        <section v-show="!loading" class="mod-content index">
        </section>
        <section v-show="!loading" class="page-loading active">
            <div class="spinner">
                <div class="spinny"></div>
            </div>
        </section>
        <!-- section end -->
    </div>
    <!-- page end -->
    <!-- popup start -->
    <div v-show="isShowRule" class="mod-popup popup-screen active bg" data-role="popup-rule">
        <div class="mod-popup-box">
            <div class="mod-popup-head-change"></div>
            <div class="mod-popup-body iscroll">
                <div class="mod-popup-scroll">
                    <div class="mod-popup-text">
                        <p><b>一.什么是斗米积分？</b></p>
                        <p>斗米积分是系统根据用户在斗米的行为而发放的，用户登录APP可在个人中心查看积分余额。
                        </p>
                    </div>
                    <div class="mod-popup-text">
                        <p><b>二.斗米积分有什么用？</b></p>
                        <p>斗米积分可以用于在积分商城兑换礼品、参加活动等。</p>
                        <p>积分商城入口可以在斗米APP中找到，所有用户均可享受积分权益，在积分商城中，用户可以使用积分进行手机充值、兑换优惠券、兑换实物礼品、参加抽奖活动等。</p>
                    </div>
                    <div class="mod-popup-text">
                        <p><b>三.如何获得斗米积分？</b></p>
                        <p>1.注册账号得积分：成功注册斗米账号，获得15积分奖励。</p>
                        <p>2.完善简历得积分：完善斗米个人简历，获得12积分奖励。</p>
                        <p>3.实名认证得积分：完成实名认证（即加入章鱼会员俱乐部），获得15积分奖励。</p>
                        <p>4.钱包提现得积分：成功添加提现方式，获得10积分奖励。</p>
                        <p>5.每天签到得积分：签到成功，获得10积分奖励。</p>
                        <p>连续签到额外得积分：连续签到第5天，额外获得30积分奖励；连续签到第10天，额外获得50积分奖励；连续签到第15天，额外获得100积分奖励。</p>
                        <p>连续签到满15天或连续签到中断，则重新计算额外签到奖励。</p>
                        <p>6.浏览职位得积分：连续查看15条以上兼职职位详情，获得12积分奖励。</p>
                        <p>7.分享职位得积分：成功分享兼职职位给好友，获得12积分奖励。</p>
                        <p>8.分享特工得积分：成功分享特工邀约，奖励3积分。每天最多可获得5次奖励。</p>
                        <p>9.收藏职位得积分：成功收藏一条兼职，获得2积分奖励。每天最多可获得3次奖励。</p>
                        <p>10.上岗结算得积分：成功上岗并结算，获得100积分奖励。</p>
                        <p>注：章鱼会员积分多：加入章鱼会员俱乐部，获得对应倍数的上岗结算奖励。</p>
                    </div>
                    <div class="mod-popup-text">
                        <p><b>四.斗米积分有限制吗？</b></p>
                        <p>用户获得的斗米积分有效期为半年。</p>
                        <p>违规用户获得的斗米积分会被冻结。</p>
                    </div>
                </div>
            </div>
            <div @click="closeAlert" class="mod-popup-bar"><i class="icon icon-close" data-role="icon-close">关闭</i></div>
        </div>
    </div>
</div>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import KCindexPage from 'clientApi/KCindexPage'
    import $ from 'zepto'
    import KCclientUI from 'clientApi/KCclientUI'
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCloggerApi from 'clientApi/KCloggerApi'
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
                isMove: true,
                isShowRule: false,
                itemsList: new Array,
                isShowLoadAction: false,
                pageNum: 1,
                isLoadData: true,
                loading: false,
                totalScore: Util.getQueryString('total_score')
            }
        },
        vuex: {
            getters: {

            },
            actions: {

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
                this.getItemsData()
            },
            showRule (){
                //2.8.5 积分规则埋点
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=jfgz')
                //2.8.0
                KCloggerApi.addLog('0','积分细则页面_展现量&积分细则页面展现量&')
                this.isShowRule = !this.isShowRule
                this.isMove = false
                var title =  document.getElementsByTagName('title')
                title[0].innerHTML = '积分规则'
            },
            closeAlert (){
                this.isShowRule = !this.isShowRule
                this.isMove = true
                var title =  document.getElementsByTagName('title')
                title[0].innerHTML = '积分明细'
            },
            stopMove (){
                if(!isMove){ return false }
            },
            getItemsData (){
                let self = this
                Util.ajax({
                    url:'/pointsmall/scoreRecord',
                    timeout:10000,
                    type: 'GET',
                    data: {
                        'page': self.pageNum
                    },
                    success: function(result){
                        KCloggerApi.addLog('0','我的积分页面_展现量&我的积分页面展现量&');
                        if(result.result.data.length < 10){
                            self.isShowLoadAction = false
                            self.isLoadData = false
                        }else{
                            self.isShowLoadAction = true
                        }
                        //解析时间戳
                        result.result.data.forEach((e)=>{
                            e.create_at = Util.getLocalTime(e.create_at * 1000,'yyyy-MM-dd')
                        })
                        //判断并添加 + 号
                        result.result.data.forEach((e)=>{
                            if(e.score > 0){
                                e.score = '+'+e.score
                            } 
                        })
                        let arr = Array.from(result.result.data)
                        result.result.data.forEach((e)=>{
                            self.itemsList.push(e)
                        })
                        self.pageNum++
                        self.loading = true
                    },
                    error: function(xhr, status){
                        self.isShowLoadAction = false
                        var toastStr = ''
                        if(status == 'timeout'){
                            toastStr = '网络请求超时'
                        }else{
                            toastStr = '服务器异常'
                        }
                        if(self.pageNum == 1){
                            KCindexPage.loadPageStatus('loadFailed')
                        }else{
                            KCwidget.toast('加载失败')
                            
                        }
                    },
                    noNetwork: function(){
                        self.isShowLoadAction = false
                        if(self.pageNum == 1){
                            KCindexPage.loadPageStatus('loadFailed')
                        }else{
                            KCwidget.toast('网络连接失败!')
                            
                        }
                    }
                })
            }
        },
        created(){
            let self = this
            KCindexPage.registerHitPageBottomListener(function(){
                self.isShowLoadAction = true
                if(self.isLoadData){
                    self.getItemsData()
                }else{
                    KCwidget.toast('已经是最后一条了')
                    self.isShowLoadAction = false
                }
            },10)
            self.initFun()
        }   
    }
</script>
<!-- CSS 样式 -->
<style>
    .mod-popup-head-change{
        height: 10px;
        max-height: 26px;
    }
    .record .product-title{
        font-weight: 300;
    }
    .bg{
        background: rgba(255,255,255,0.9)
    }

</style>
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/integral.css"></style>
<style src="static/css/index.css"></style>




