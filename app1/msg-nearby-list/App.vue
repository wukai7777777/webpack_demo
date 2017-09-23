<template>
<div>
    <!-- page start -->
    <section class="page-loading" v-bind:class="{active : isShowPageloading}">
        <div class="spinner">
            <div class="spinny"></div>
        </div>
    </section>
    <!-- page start -->
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content message" v-cloak v-show="!isShowPageloading">
            <ul class="message-list mod-list">
                <li class="mod-list-item" v-for="cardItem in cardListData">
                    <div class="message-time">{{cardItem.push_time}}</div>
                    <div class="message-info near-info">
                        <h2 class="message-title com-border-bottom">最新发布职位</h2>
                        <ul class="near-list mod-list">
                            <li class="mod-list-item com-border-bottom" v-for="jobItem in cardItem.data">
                                <a href="javascript:;" class="mod-list-info product-info" v-on:click="goToJobDetail(jobItem.id,jobItem.urd_data)">
                                    <h3 class="product-title">
                                        <span>
                                            <i class="icon icon-jizhao" v-if="jobItem.ad_types==3">急招</i>
                                            <i class="icon icon-renqi" v-if="jobItem.ad_types==2">人气</i>
                                            <i class="icon icon-remen" v-if="jobItem.ad_types==1">热门</i>
                                            <i class="icon icon-tuijian" v-if="jobItem.has_subsidy==1">推荐</i>{{jobItem.title}}
                                        </span>
                                    </h3>
                                    <div class="product-meta">
                                        <span class="fl"><b class="fc-red">{{jobItem.salary}}</b>元/{{jobItem.salary_type_str}}</span>
                                        
                                        <span v-if="!!jobItem.payment_type_str" class="fl line">{{jobItem.payment_type_str}}</span>
                                        <i class="icon icon-danbao" v-if="jobItem.is_deposit==1 || jobItem.cooperation_type==2 || jobItem.cooperation_type==3 || jobItem.cooperation_type==4 || jobItem.cooperation_type==5 || jobItem.cooperation_type==6"></i>
                                    </div>
                                    <div class="product-ds"><span class="fc-gray">{{jobItem.distance_int}}km</span></div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </section>
        <!-- section end -->
    </div>
    <!-- page end -->
</div>
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
    import KCmsgPage from 'clientApi/KCmsgPage'
    import KCcache from 'clientApi/KCcache'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KClocationApi from 'clientApi/KClocationApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import Vue from 'vue'

    /**
     *  组件实例对象
     */
    export default {
        components: {

        },
        data(){
            return{
                cardListData: [],
                isShowPageloading: false,
                cacheData: [],
                msgType: ''
            }
        },
        vuex: {
            getters: {

            },
            actions: {

            }
        },
        methods: {
            getNearbyJobListData() {
                let self = this;
                self.isShowPageloading = true;
                KClocationApi.requestLocation(function(data){
                    //如果定位失败就不发送请求了
                    if(!!data&&data.lat != 0&&data.lon != 0){
                        Util.ajax({
                            url:'/message/postlist?lat=' + data.lat + '&lng=' + data.lon,
                            timeout:10000,
                            success:function(data){
                                // console.log(data);
                                if(!!data && data.code == 1000){
                                    if(!!data.data && !!data.data.data){
                                        //卡片显示时间L：年月日
                                        let push_time = Util.getLocalTime(data.data.send_time * 1000,'yyyy-MM-dd');
                                        data.data.push_time = push_time;
                                        //整理卡片里面的职位列表
                                        for(let i = 0;i < data.data.data.length;i++){

                                            KCloggerApi.addLog('2','@atype=show@ca_name=doumi@ca_source=app@from=fjjz@ca_from=post_show@post_id='+ data.data.data[i].id +'@ca_kw='+ (i+1));

                                            //距离转换：米=》千米（公里）
                                            data.data.data[i].distance_int = (data.data.data[i].distance_int/1000).toFixed(1);
                                            //详情页跳转
                                            data.data.data[i].urd_data = encodeURIComponent("title=" + data.data.data[i].title + "&hire_number=" + data.data.data[i].hire_number + "&payment_type_str=" + data.data.data[i].payment_type_str + "&job_type_str=" + data.data.data[i].job_type_str + "&salary=" + data.data.data[i].salary + "&salary_type_str=" + data.data.data[i].salary_type_str + "&is_deposit=" + data.data.data[i].is_deposit + "&has_subsidy=" + data.data.data[i].has_subsidy + "&cooperation_type=" + data.data.data[i].cooperation_type + "&ad_types=" + data.data.data[i].ad_types);
                                        }

                                        //附近兼职数据一周push一次，缓存里只存4条数据（不管push时间），多余的将被推出,本地缓存时间设为30天;
                                        if(self.cacheData.length != 0){
                                            if(self.cacheData.length == 4){
                                                self.cacheData.pop();
                                            }
                                            self.cacheData.unshift(data.data);
                                            self.cardListData = self.cacheData;
                                        }else{
                                            self.cardListData = [data.data];
                                            self.cacheData = [data.data];
                                        }
                                        if(self.cacheData.length != 0){
                                            KCcache.setCache('nearbyjoblistData', self.cacheData, 30 * 24 * 60 * 60);
                                        }else{
                                            KCmsgPage.loadPageStatus('noData');
                                        }
                                    }
                                }else{
                                    KCmsgPage.loadPageStatus('loadFailed');
                                }
                                self.isShowPageloading = false;
                            },
                            error:function(xhr, status){
                                self.isShowPageloading = false;
                                KCmsgPage.loadPageStatus('loadFailed');
                            },
                            noNetwork: function(){
                                self.isShowPageloading = false;
                                KCmsgPage.loadPageStatus('netWorkFailed');
                            }
                        });
                    }else{
                        self.isShowPageloading = false;
                        //如果此时缓存为空，则显示无数据，否则显示缓存数据
                        if(self.cacheData.length != 0){
                            self.cardListData = self.cacheData;
                        }else{
                            KCmsgPage.loadPageStatus('noData');
                        }
                    }
                });
            },
            goToJobDetail(jobId,urdData){
                let self = this;
                let from = Util.getQueryString('from');
                let push_id = '';
                let push_channel = '';
                let href_from = 'fjjz';
                let href_post_id = '';
                let messageType = '';
                let href_messageType = '';
                let business_date = '';
                let href_business_date = '';
                if(from == 'push'){
                    push_id = '@push_id=' + Util.getQueryString('push_id') || '-';
                    href_from = 'push';
                    href_post_id = '&push_id=' + Util.getQueryString('push_id') || '-';
                    messageType = '@messageType=' + self.msgType;
                    href_messageType = '&messageType=' + self.msgType;
                    business_date = '@business_date=' + Util.getQueryString('business_date') || '-';
                    push_channel = '@push_channel=' + Util.getQueryString('push_channel') || '-';//v3.2
                    href_business_date = '&business_date=' + Util.getQueryString('business_date') || '-';
                    
                }
                // @atype=click@ca_name=doumi@ca_source=app@ca_from=fjjz@ca_kw=[帖子排序] 不添加ca_kw
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + from + '@ca_from=fjjz' + push_id + messageType + business_date + push_channel + '@post_id=' + jobId);
                window.location.href = 'doumi://jobdetail?job_id=' + jobId + '&urdData=' + urdData + '&from=' + href_from + href_post_id + href_messageType + href_business_date;
            }
        },
        created(){
            let self = this;

            //通知已读
            self.msgType = Util.getQueryString('messageType');
            KCmsgPage.setMsgReaded(self.msgType);
            //获取消息是否已读，1表示未读；0表示已读（如果多条未读，只取最新的一条）
            let isReaded = Util.getQueryString('isReaded');

            KCcache.getCache('nearbyjoblistData', function(data){
                //记录缓存
                if(!!data){
                    self.cacheData = data;
                }
                //判断入口
                if(!!isReaded){
                    if(isReaded == 1){
                        self.getNearbyJobListData();
                    }else{
                        if(!!data){
                            self.cardListData = data;
                        }else{
                            self.getNearbyJobListData();
                        }
                    }
                }else{
                    self.getNearbyJobListData();
                }
            });

            KCloggerApi.addLog('0', '附近兼职_消息展现量&附近兼职_消息展现量&');
        }
    }
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/old-list.css"></style>
<style src="static/css/old-message.css"></style>