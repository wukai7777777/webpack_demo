<template>
    <div>
        <!-- page start -->
        <!-- <section class="page-loading" v-bind:class="{active : isShowPageloading}">
            <div class="spinner">
                <div class="spinny"></div>
            </div>
        </section> -->
        <com-mid-loading top="45%" :com-mid-is-show="isShowComMid" />
        <div class="mod-page">
            <!-- section start -->
            <section class="mod-content message" v-cloak v-show="!isShowPageloading">
                <ul class="message-list mod-list" v-bind:style="{ minHeight:listMinHeight }">
                    <li class="mod-list-item" v-for="cardItem in cardListData">
                        <div class="message-time">{{cardItem.push_time}}</div>
                        <div class="message-info position-info">
                            <ul class="position-list mod-list">
                                <li class="mod-list-item com-border-bottom" v-for="jobItem in cardItem.job_list">
                                    <a href="javascript:;" v-on:click="goToJobDetail(jobItem.id,jobItem.urd_data)" class="mod-list-info product-info">
                                        <h3 class="product-title">
                                            <span>
                                               {{jobItem.title}}
                                            </span>    
                                        </h3>
                                        <div class="product-price">
                                            <span class="fl"><b class="fc-red">{{jobItem.salary}}</b>元/{{jobItem.salary_type_str}}</span>
                                        </div>
                                        <div class="product-label">
                                            <i class="icon icon-danbao" v-if="jobItem.is_deposit==1 || jobItem.cooperation_type==2 || jobItem.cooperation_type==3 || jobItem.cooperation_type==4 || jobItem.cooperation_type==5 || jobItem.cooperation_type==6"></i>
                                            <i v-if="!!jobItem.payment_type_str" class="fl line icon-label icon" :title="jobItem.payment_type_str">{{jobItem.payment_type_str}}</i>
                                            <i class="icon icon-jizhao" v-if="jobItem.ad_types==3" title="急招">急招</i>
                                            <i class="icon icon-renqi" v-if="jobItem.ad_types==2" title="人气">人气</i>
                                            <i class="icon icon-remen" v-if="jobItem.ad_types==1" title="热门">热门</i>
                                            <i class="icon icon-tuijian" v-if="jobItem.has_subsidy==1" title="推荐">推荐</i>
                                        </div>
                                        <!-- <h3 class="product-title">
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
                                        </div> -->
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
               <!--  <div class="mod-status-box" v-show="isShowLoadingBar">
                    <div class="mod-status" v-bind:class="{active:loadStatus}">释放加载更多</div>
                    <div class="mod-status" v-bind:class="{active:loadingStatus}">
                        <span class="icon-loading"></span>
                        加载中...
                    </div>
                    <div class="mod-status" v-bind:class="{active:moreStatus}">已没有更多数据</div>
                </div> -->
                <com-bom-loading :load-fn="getUserPreferenceListData"/>
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
     *  引入工具类库 或 模块API
     */
    import Util from 'tool/widget/Util'
    import KCmsgPage from 'clientApi/KCmsgPage'
    import KCcache from 'clientApi/KCcache'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import Vue from 'vue'

    import comBomLoading from 'components/com-bom-loading/com-bom-loading'
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'
    import * as combomloading_mt from "components/com-bom-loading/com-bom-loading-mutation-types"

    /**
     *  组件实例对象
     */
    export default {
        components: { 
            comBomLoading,
            comMidLoading
        },
        data(){
            return {
                loadStatus:false,
                loadingStatus:true,
                moreStatus:false,
                cardListData: [],
                page: 1,
                pageSize: 5,
                canNextRequest: true,
                hasCache: true,
                // isShowLoadingBar: false,
                isShowPageloading: true,
                clientHeight: document.documentElement.clientHeight,
                listMinHeight: document.documentElement.clientHeight - 40 + 'px',
                msgType: '',
                isShowComMid: false
            }
        },
        vuex: {
            getters: {
                
            },
            actions: {

            }
        },
        methods: {
            getUserPreferenceListData() {
                let self = this;
                // console.log(0)
                Util.ajax({
                    url:'/message/prefer?page=' + self.page + '&pageSize=' + self.pageSize,
                    timeout:10000,
                    success:function(data){
                        // console.log(data);
                        if(!!data && data.code == 1000){
                            KCmsgPage.dataDownloadFinished();
                            // self.isShowLoadingBar = true;
                            self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                            
                            // console.log('page===>' + self.page);

                            if(!!data.data && !!data.data.data && data.data.data.length > 0){
                                //整理卡片里面的职位列表
                                for(let i = 0;i < data.data.data.length;i++){
                                    // data.data.data[i].job_list = eval(data.data.data[i].content.replace('\"','"'));
                                    data.data.data[i].job_list = JSON.parse(data.data.data[i].data.replace('\"','"'));

                                    // console.log(data.data.data[i].job_list)

                                    //构建职位详情跳转参数##################需要裴胜强将job_type_str改成字符串值，目前他返回是职位类型对象###############
                                    for(let j = 0;j < data.data.data[i].job_list.length;j++){

                                        KCloggerApi.addLog('2','@atype=show@ca_name=doumi@ca_source=app@from=phxx@ca_from=post_show@post_id=' + data.data.data[i].job_list[j].id);

                                        data.data.data[i].job_list[j].urd_data = encodeURIComponent("title=" + data.data.data[i].job_list[j].title + "&hire_number=" + data.data.data[i].job_list[j].hire_number + "&payment_type_str=" + data.data.data[i].job_list[j].payment_type_str + "&job_type_str=" + data.data.data[i].job_list[j].job_type_str + 
                                                "&salary=" + data.data.data[i].job_list[j].salary + "&salary_type_str=" + data.data.data[i].job_list[j].salary_type_str + "&is_deposit=" + data.data.data[i].job_list[j].is_deposit + "&has_subsidy=" + data.data.data[i].job_list[j].has_subsidy + "&cooperation_type=" + data.data.data[i].job_list[j].cooperation_type + "&ad_types=" + data.data.data[i].job_list[j].ad_types);
                                    }
                                }

                                if(self.page == 1){
                                    KCcache.setCache('prefermsg_listData', data, 10 * 24 * 60 * 60);
                                    self.cardListData = data.data.data;
                                }else{
                                    self.cardListData = self.cardListData.concat(data.data.data);
                                }
                                if(data.data.last_page == 1 || data.data.last_page == data.data.current_page){
                                    // self.canNextRequest = false;
                                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                    self.setStatus(false,false,true);
                                }else{
                                    // self.canNextRequest = true;
                                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                                    if(Util.OS()=='android'){
                                        self.setStatus(true,false,false);
                                    }else{
                                        self.setStatus(false,true,false);
                                    }
                                    self.page++;
                                }
                            }else if(!!data.data && !!data.data.data && data.data.data.length == 0){
                                // self.canNextRequest = false;
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                if(self.page == 1){
                                    KCcache.setCache('prefermsg_listData', null, 10 * 24 * 60 * 60);
                                    self.cardListData = [];
                                    // self.isShowLoadingBar = false;
                                    self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                                    KCmsgPage.loadPageStatus('noData');
                                }
                                self.setStatus(false,false,true);
                            }
                        }else{
                            KCmsgPage.dataDownloadFinished();
                            // self.canNextRequest = true;
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            if(self.page == 1){
                                // self.isShowLoadingBar = false;
                                self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                                KCmsgPage.loadPageStatus('loadFailed');
                            }else{
                                KCwidget.toast('服务器异常');
                            }
                        }
                        self.isShowPageloading = false;
                        self.isShowComMid = false;

                    },
                    error:function(xhr, status){
                        // console.log(status)
                        KCmsgPage.dataDownloadFinished();
                        // self.canNextRequest = true;
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        let toastStr = '';
                        if(status == 'timeout'){
                            toastStr = '网络请求超时';
                        }else{
                            toastStr = '服务器异常';
                        }
                        if(self.page == 1){
                            // self.isShowLoadingBar = false;
                            self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                            KCmsgPage.loadPageStatus('loadFailed');
                        }else{
                            KCwidget.toast(toastStr);
                        }
                    },
                    noNetwork: function(){
                        KCmsgPage.dataDownloadFinished();
                        // self.canNextRequest = true;
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(self.page == 1){
                            // self.isShowLoadingBar = false;
                            self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                            KCmsgPage.loadPageStatus('netWorkFailed');
                        }else{
                            KCwidget.toast('网络异常');
                        }
                    }
                });
            },
            setStatus(emptyEle,loadingMore,noData){
                // console.log(emptyEle + ',' + loadingMore + ',' + noData);
                let self = this;
                self.$store.commit(combomloading_mt.SET_LOADING, loadingMore);
                self.$store.commit(combomloading_mt.SET_NOMORE, noData);
                // self.loadStatus = emptyEle;
                // self.loadingStatus = loadingMore;
                // self.moreStatus = noData;
            },
            goToJobDetail(jobId,urdData){
                let self = this;
                let from = Util.getQueryString('from');
                let push_id = '';
                let push_channel = '';
                let href_from = 'phxx';
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
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + from + '@ca_from=phxx' + push_id + messageType + business_date + push_channel + '@post_id=' + jobId);
                window.location.href = 'doumi://jobdetail?job_id=' + jobId + '&urdData=' + urdData + '&from=' + href_from + href_post_id + href_messageType + href_business_date;
            }
        },
        created(){
            let self = this;
            
            //设置加载页面loading
            self.isShowComMid = true;

            KCmsgPage.canPullWebView(true);

            //通知已读
            self.msgType = Util.getQueryString('messageType');
            KCmsgPage.setMsgReaded(self.msgType);

            window.loadData = function(){
                // console.log('window.loadData')
                self.page = 1;
                // self.canNextRequest = true;
                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                self.setStatus(false,false,false);
                // self.isShowLoadingBar = true;
                self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                self.getUserPreferenceListData();
            };

            KCcache.getCache('prefermsg_listData', function(data){
                // console.log(data)
                if(!!data && data != 'null'){
                    self.cardListData = data.data.data;
                }else{
                    // self.hasCache = false;
                    // KCmsgPage.loadPageStatus('noData');
                    self.isShowPageloading = true;
                    self.isShowComMid = true;
                }
                self.getUserPreferenceListData();
            });

            // KCmsgPage.registerHitPageBottomListener(function(y){
            //     // console.log('######registerHitPageBottomListener#######');
            //     // console.log(self.canNextRequest + '$$' + self.page);
            //     KCclientInfo.getNetworkType(function(networkData){
            //         if(networkData.network != 'invalid'){
            //             if(self.canNextRequest){
            //                 self.canNextRequest = false;
            //                 self.setStatus(false,true,false);
            //                 // console.log('load next page')
            //                 // 加载下一页数据
            //                 self.getUserPreferenceListData();
            //             }
            //         }else{
            //             self.canNextRequest = true;
            //             KCwidget.toast('网络异常');
            //         }
            //     });
                
            // }, 35);

            if((document.body.scrollHeight > self.clientHeight) && Util.OS()!='ios'){
                // self.loadStatus = true;
                self.$store.commit(combomloading_mt.SET_LOADING, false);
            }

            KCloggerApi.addLog('0', '职位偏好_消息展现量&职位偏好_消息展现量&');
        }
        
    }

    
</script>
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/list.css"></style>
<style src="static/css/message.css"></style>