<template>
    
    <!-- 组件的模板 -->
    <div class="mod-page">
        <!-- com-mid-loading -->
        <com-mid-loading :com-mid-is-show="isShowComMid" />
        <section class="mod-content message" v-cloak v-show="!isShowComMid">
            <ul class="message-list mod-list">
                 <li class="mod-list-item" v-for="(item,index) in sysList" v-bind:key="item.index" @click="goToLink(item.urd)">
                    <!--<div class="message-time">{{item.push_time}}</div>-->
                    <a href="javascript:;" class="message-info">
                      <h3 class="message-title">{{item.title}}</h3>
                      <div class="message-meta">{{item.push_time}}</div>
                      <div class="message-content">{{item.content}}</div>
                      <div class="message-opt" v-show="item.urd && item.urd.length > 0 && item.urd.indexOf('doumi://JobMsgList') < 0">查看详情</div>
                    </a>
                </li>
            </ul>
            <com-bom-loading :load-fn="loadFunc"/>
        </section>
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
    import KClocationApi from 'clientApi/KClocationApi'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCmsgPage from 'clientApi/KCmsgPage'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCindexPage from 'clientApi/KCindexPage'
    import {mapGetters} from 'vuex'

    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */
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
        data: function(){
            return{
                page: 1,
                pageSize: 10,
                sysList: [],
                noMoreList: false,
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
            /**
             * 初始化
             * @method init
             * @public
             * @return {Null} void
             */
            initFn (){
                var self = this;
                self.isShowComMid = true;
                self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                //通知客户端push列表消息已读
                self.msgType = Util.getQueryString('messageType');
                KCmsgPage.setMsgReaded(self.msgType);
                KCucApi.getUserInfo((data) =>{
                    self.userId=data.userId;
                });
                // window.loadData = function() {
                //     page = 1;
                //     self.getMsgList();
                // }
                
                self.getMsgList();
            },
            loadFunc () {
                let self = this;
                self.getMsgList(true);
            },
            getMsgList(loadNextPage) {
                var self = this;
                Util.ajax({
                    url:'/message',
                    data:{
                        page: self.page,
                        pageSize: self.pageSize,
                        userId: self.userId,
                        platform: Util.OS(),
                        token: ''
                    },
                    timeout:10000,
                    success:function(data) {
                        self.isShowComMid = false;
                        if(!loadNextPage){
                            KCmsgPage.dataDownloadFinished();
                        }
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);

                        if(!!data && !!data.data && data.data.length > 0){
                            if(self.page == 1){
                                self.sysList = data.data;
                            }else{
                                self.sysList = self.sysList.concat(data.data);
                            }
                            if(data.last_page == 1 || data.last_page == data.current_page){
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                            }else{
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                                self.page++;
                            }
                        }else if(!!data && !!data.data && data.data.length == 0){
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                            if(self.page == 1){
                                self.sysList = [];
                                KCmsgPage.loadPageStatus('noData');
                            }
                            self.$store.commit(combomloading_mt.SET_NOMORE, true);
                        }else{
                            if(self.page == 1){
                                KCmsgPage.loadPageStatus('loadFailed');
                            }else{
                                KCwidget.toast('服务器异常');
                                self.$store.commit(combomloading_mt.SET_LOADING, true);
                            }
                        }

                        self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                    },
                    error:function(xhr, status){
                        self.isShowComMid = false;
                        if(!loadNextPage){
                            KCmsgPage.dataDownloadFinished();
                        }
                        if(self.page == 1){
                            Util.ajaxErrorFn(KCwidget,xhr,status,false,KCucApi);
                        }else{
                            Util.ajaxErrorFn(KCwidget,xhr,status,true,KCucApi);
                            self.$store.commit(combomloading_mt.SET_LOADING, true);
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        }
                    },
                    noNetwork: function(){
                        self.isShowComMid = false;
                        if(!loadNextPage){
                            KCmsgPage.dataDownloadFinished();
                        }
                        if(self.page == 1) {
                            KCmsgPage.loadPageStatus('netWorkFailed');
                        }else {
                            self.$store.commit(combomloading_mt.SET_LOADING, true);
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            KCwidget.toast('网络异常');
                        }
                    }
                });
            },
            /**
             * 跳转至详情页并埋点
             * @return {[type]} [description]
             */
            goToLink(url) {
                if(url && url.indexOf('doumi://JobMsgList') < 0) {
                    KCloggerApi.addLog('0','系统消息&查看详情_点击量&');
                    if(url.indexOf('online-submit-detail') > -1) {
                        let from = Util.getQueryString('from');
                        let push_id = '';
                        let messageType = '';
                        let business_date = '';
                        let task_id = '';
                        let list = url.split('&');
                        list.forEach(function(item){
                            if(item.indexOf('task_id')>-1){
                                task_id = item;
                            }
                        });
                        if (from == 'push') {
                            push_id = '@push_id=' + Util.getQueryString('push_id') || '-';
                            messageType = '@messageType=' + self.msgType;
                            business_date = '@business_date=' + Util.getQueryString('business_date') || '-';
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=xtxx_see_detail@from=push@' + task_id + push_id + messageType + business_date);
                            url = url + '&from=push';
                        }else{
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=xtxx_see_detail@from=no_push@' + task_id);
                            url = url + '&from=xtxx';
                        }
                    }
                    window.location.href = url;
                }
                
            }

        },
        created(){
            this.initFn();
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/message.css"></style>



