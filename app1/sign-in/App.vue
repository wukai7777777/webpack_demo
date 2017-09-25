<template>
<div>
    <section v-show="loading" class="mod-content sign">
            <!-- detail start -->
            <div class="detail bc-main com-border-bottom">
                <div class="product-title">已连续签到</div>
                <div class="product-info"><b>{{integralData.consecutivedays}}</b>天</div>
                <p class="product-ds">距下个惊喜还有<b>{{integralData.remaindays}}</b>天</p>
                <a v-bind:href="URL" class="product-opt" @click="logFn('jfmx')">积分明细</a>
            </div>
            <!-- detail end -->
            <!-- link start -->
            <div class="mod-adv bc-main com-border-bottom">
                <a href="doumi://EarnScore?from=qdcg" class="mod-adv-info com-arrow-right" @click="logFn('zjf')">
                    <span class="fl">我的积分<b>{{integralData.total_score}}</b>，积分太少？</span>
                    <b class="fr b">立即去赚</b>
                </a>
            </div>
            <!-- link end -->
            <!-- banner start -->
            <div class="mod-banner com-space">
                <a href="doumi://Duiba"><img src="../../static/imgs/banner_integral.jpg" alt=""></a>
            </div>
            <!-- banner end -->
            <!-- link start -->
            <div class="mod-adv bc-main com-border-bottom">
                <a href="doumi://Duiba" class="mod-adv-info com-arrow-right" @click="logFn('jfsc')">更多商品，进入积分商城</a>
            </div>
            <!-- link end -->
        </section>
        <section v-show="!loading" class="page-loading active">
            <div class="spinner">
                <div class="spinny"></div>
            </div>
        </section>
</div>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    
    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */
    import KCindexPage from 'clientApi/KCindexPage'
    import KCclientUI from 'clientApi/KCclientUI'
    import Util from '../../tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCloggerApi from 'clientApi/KCloggerApi'
    /**
     *  组件实例对象
     */
    export default {
        components: {

        },
        data: function(){
            return{
                integralData: {},
                isShowAlert: false,
                loading:false,
                isFirst:false,
                URL: "doumi://integralDetail?total_score=",
                messageColor: {"messageAttribute":[],"titleAttribute":[]},
                maidianTest: 0
            }
        },
        methods: {
            
            logFn(logStr){
                if(logStr=='jfmx'){
                    //2.8.5 积分明细埋点
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from='+logStr,this.maidianTest)
                }
                if(logStr=='zjf'){
                    //2.8.0 
                    KCloggerApi.addLog('0','赚积分入口_点击&赚积分入口_点击&{"点击":"签到成功页"}')
                    //2.8.5 赚积分埋点
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from='+logStr,this.maidianTest)
                }else if(logStr=='jfsc'){
                    //2.8.0
                    KCloggerApi.addLog('0','积分商城_点击量&积分商城_点击量&{"点击":"签到成功页"}')
                    //2.8.5 积分商城埋点
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from='+logStr,this.maidianTest)
                }
            },
            changeMsgCol(arr,mes){
                let long = -1
                for(let i = 0 ; i < arr.length ; i++){
                    let obj = {}
                    var item = arr[i]
                    if(i == 0){
                        obj.location = 0
                        obj.length = item[0].toString().length
                        obj.color = item[1]
                        long = long + obj.length
                    }else{
                        obj.location = long + 1
                        obj.length = item[0].toString().length
                        obj.color = item[1]
                       long = long + obj.length
                    }
                    mes.messageAttribute.push(obj)
                }
            },
            getIntegralDetail (){
                let self = this
                Util.ajax({
                    url:'/pointsmall/signin',
                    timeout: 10000,
                    type: 'POST',
                    success: function(result){
                        KCloggerApi.addLog('0','签到成功页_展现量&签到成功页展现量&');

                        let message
                        //message判断是否是第一次进入
                        if(Util.getQueryString('message')){
                            message = Util.getQueryString('message')
                            //message解码,native有加密
                            message = decodeURIComponent(message)
                        }
                        //bonuses判断知否有连续签到的奖励
                        let bonuses = result.data.bonuses > 0
                        // let bonuses = true

                        //判断是否连续签到用于确定弹什么图片的弹窗
                        let isConsecutivedays = result.data.consecutivedays == 1

                        if(bonuses && message){
                            let signScore = result.data.score
                            let arrNotice = [
                                ['获得','#000000'],
                                [signScore,'#ff6600'],
                                ['积分,额外奖励','#000000'],
                                [result.data.bonuses,'#ff6600'],
                                ['积分','#000000']
                            ]
                            self.changeMsgCol(arrNotice,self.messageColor)

                            let notice = '获得'+signScore+'积分,额外奖励'+result.data.bonuses+'积分'

                            KCclientUI.alertDialog('连续签到成功',notice,(data)=>{},'确定','ContinuousSign',self.messageColor.titleAttribute,self.messageColor.messageAttribute)

                        }else if(message && !bonuses){
                            let notice = '获得'+result.data.score+'积分'
                            //判断是否是第一次签到和连续签到
                            let arrNotice = [
                                ['获得','#000000'],
                                [`${result.data.score}`,'#ff6600'],
                                ['积分','#000000']
                            ]
                            self.changeMsgCol(arrNotice,self.messageColor)
                            KCclientUI.alertDialog('签到成功',notice,(data)=>{},'确定','Sign',self.messageColor.titleAttribute,self.messageColor.messageAttribute)
                        }
                        //传入数据渲染页面
                        self.integralData = result.data
                        self.loading = true
                        self.URL += self.integralData.total_score
                    },
                    error: function(xhr, status){
                        var toastStr = ''
                        if(status == 'timeout'){
                            toastStr = '网络请求超时'
                        }else{
                            toastStr = '服务器异常'
                        }
                        KCindexPage.loadPageStatus('loadFailed')
                    },
                    noNetwork: function(){
                        KCwidget.toast('网络异常');
                        KCindexPage.loadPageStatus('loadFailed')
                    }
                })
            }
        },
        created(){
            this.getIntegralDetail()
        }
        
    }

    
</script>

<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/sign.css"></style>
<style>
    .mod-adv-info .b{
        color:#ff6600;
        font-weight:300;
    }
</style>
<!-- CSS 样式 -->
<!-- <style src="static/css/global.css"></style> -->



