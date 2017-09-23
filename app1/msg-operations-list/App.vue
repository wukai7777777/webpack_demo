<template>
    
    <!-- 组件的模板 -->
    <div class="mod-page">
      <!-- section start -->
        <section class="mod-content message">
            <ul class="message-list mod-list">
                <li class="mod-list-item" v-for="item in dataList">
                    <div class="message-time">{{item.business_date}}</div>
                    <a href="javascript:;" class="message-info" @click="goToMessageInfo(item)">
                        <h3 class="message-title">{{item.title}}</h3>
                        <div class="message-meta">{{item.push_time}}</div>
                        <div class="message-image" v-if="!!item.image_url"><img :src="item.image_url" alt=""></div>
                        <div class="message-content">{{item.description}}</div>
                        <div class="message-opt">阅读全文</div>
                    </a>
                </li>
              
            </ul>

            <!-- <div class="mod-status loadingList" :class="{'active': showLoading}">
                <span class="icon-loading"></span>
                加载中...
            </div>
            <div class="mod-status readyLoading" :class="{'active': showReadyLoading}">释放加载更多</div>
            <div class="mod-status" :class="{'active': showNoMore}">已没有更多数据</div> -->
        </section>

        <!-- <section class="page-loading" :class="{'active': showPageLoading}">
            <div class="spinner">
              <div class="spinny"></div>
            </div>
        </section> -->
        <com-mid-loading top="45%" :com-mid-is-show="isShowComMid" />
    </div>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCmsgPage from 'clientApi/KCmsgPage'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KClocationApi from 'clientApi/KClocationApi'
    import Vue from 'vue'
    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'
    
    let page = 1;
    const pageSize = 20;
    let deviceToken = '';
    let messageType = '';
    let userId = '';
    /**
     *  组件实例对象
     */
    export default {
        components: {
            comMidLoading
        },
        data: function(){
            return{
                dataList:[],
                isShowComMid: false
                // showPageLoading: false
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
             * 初始化
             * @method init
             * @public
             * @return {Null} void
             */
            beforeCreate (){
                var self = this;
                messageType = Util.getQueryString('messageType');
                KCmsgPage.setMsgReaded(messageType);
                KCmsgPage.canPullWebView(true);

                KCucApi.getUserInfo((userData) => {
                    if(userData.userId != 0) {
                        userId = userData.userId;
                    }
                    KCclientInfo.getDeviceToken((tokenData) => {
                        deviceToken = tokenData.deviceToken;
                        KCcache.getCache('operationsmsgData', (data) => {
                            if(!!data && !!data.data) {
                                //有缓存，先显示缓存数据，同时请求数据，请求成功刷新数据
                                // self.showPageLoading = false;
                                self.isShowComMid = false;
                                self.dataList = data.data;
                                KCmsgPage.refreshPage();
                            }else {
                                 //没有缓存，直接请求数据
                                // self.showPageLoading = true;
                                self.isShowComMid = true;
                                self.getData();
                            }
                        })
                    });
                })

                /**
                 * 下拉刷新掉用方法
                 * @return {[type]} [description]
                 */
                window.loadData = function() {
                    page = 1;
                    KCclientInfo.getDeviceToken((tokenData) => {
                        deviceToken = tokenData.deviceToken;
                        self.getData();
                    });
                }
                
            },
            /**
             * 获取列表数据
             * @return {[type]} [description]
             */
            getData() {
                var self = this;
                KClocationApi.requestLocation(function(locationData){
                    Util.ajax({
                        url:'/message/business',
                        type: 'GET',
                        data:{
                            page: page,
                            pageSize: pageSize,
                            platform: Util.OS(),
                            token: '',
                            deviceToken: deviceToken,
                            userId: userId,
                            lat: locationData.lat,
                            lng: locationData.lon
                        },
                        timeout:10000,
                        success:function(data) {
                            // self.showPageLoading = false;
                            self.isShowComMid = false;
                            KCmsgPage.dataDownloadFinished();
                            if(!!data && !!data.data && data.data.length > 0) {
                                try{
                                    KCcache.setCache('operationsmsgData',data, 10 * 24 * 60 * 60);
                                    self.dataList = data.data;
                                }catch(e) {
                                    KCmsgPage.loadPageStatus('loadFailed');
                                    return; 
                                }
                            }else if(!!data && !!data.data && data.data.length==0) {
                                KCmsgPage.loadPageStatus('noData');
                                KCcache.setCache('operationsmsgData',null, 10 * 24 * 60 * 60);
                                self.dataList = [];
                            }else {
                                if(self.dataList.length > 0) {
                                    KCwidget.toast('服务器异常');
                                }else {
                                    KCmsgPage.loadPageStatus('loadFailed');
                                }
                            }
                        },
                        error:function(xhr, status){
                            KCmsgPage.dataDownloadFinished();
                            if(self.dataList.length > 0) {
                                 Util.ajaxErrorFn(KCwidget,xhr,status,true,KCucApi);
                             }else {
                                 Util.ajaxErrorFn(KCwidget,xhr,status,false,KCucApi);
                             }
                        },
                        noNetwork: function(){
                            KCmsgPage.dataDownloadFinished();
                            if(self.dataList.length > 0){
                                KCwidget.toast('网络异常');
                            }else{
                                KCmsgPage.loadPageStatus('netWorkFailed');
                            }
                        }
                    });
                });
            },
            /**
             * 跳转详情页并埋点
             * @return {[type]} [description]
             */
            goToMessageInfo(item) {
                let url = item.urd;
                let date = item.business_date;
                let from = Util.getQueryString('from');
                let push_id = '';
                let push_channel = '';
                let ca_from = '@ca_from=' + date + '_' + url;
                let business_date = '';
                let message_type = '';
                if(from == 'push'){
                    push_id = '@push_id=' + Util.getQueryString('push_id') || '-';
                    ca_from = '@ca_from=zyxm';
                    business_date = '@business_date=' + Util.getQueryString('business_date') || '-';
                    push_channel = '@push_channel=' + Util.getQueryString('push_channel') || '-';//v3.2
                    message_type = '@messageType=' + messageType;
                }
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + from + ca_from + push_id + business_date + message_type + push_channel);
                window.location.href = url;
            }
        },
        created(){
            this.beforeCreate();
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/message.css"></style>
