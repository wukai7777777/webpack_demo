<template>
    
    <!-- 组件的模板 -->
    <div class="mod-page">
        <!-- com-mid-loading -->
        <com-mid-loading :com-mid-is-show="isShowComMid" />
        <section class="mod-content message" v-cloak v-show="!isShowComMid">
            <ul class="message-list mod-list">
                 <li class="mod-list-item" v-for="(item,index) in dataList" v-bind:key="item.index">
                    <a :href="(!!item.urd && item.urd.length > 0 && item.urd.indexOf('doumi://msg-online-list') < 0) ? item.urd : 'javascript:;'" class="message-info" @click="setLog(item.urd)">
                      <h3 class="message-title">{{item.title}}</h3>
                      <div class="message-meta">{{item.date_str}}</div>
                      <div class="message-content">{{item.description}}</div>
                      <div class="message-opt" v-show="item.urd && item.urd.length > 0 && item.urd.indexOf('doumi://msg-online-list') < 0">查看详情</div>
                    </a>
                </li>
            </ul>
            <com-bom-loading :load-fn="getListData" :check-network="checkNetwork"/>
        </section>
    </div>    
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCmsgPage from 'clientApi/KCmsgPage'
    import KCmsgOnlinePage from 'clientApi/KCmsgOnlinePage'
    import KCclientInfo from 'clientApi/KCclientInfo'

    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import comBomLoading from 'components/com-bom-loading/com-bom-loading'
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'
    import * as combomloading_mt from "components/com-bom-loading/com-bom-loading-mutation-types"

    let page = 1;
    const pageSize = 20;

    /**
     *  组件实例对象
     */
    export default {
        components: {
            comBomLoading,
            comMidLoading
        },
        data: function() {
            return {
                dataList: [],
                isShowComMid: false,
                checkNetwork: false
            }
        },
        computed: {

        },
        methods: {
            init() {
                //通知客户端push列表消息已读
                let msgType = Util.getQueryString('messageType');
                KCmsgPage.setMsgReaded(msgType);
                this.isShowComMid = true;
                this.getListData();
                KCloggerApi.addLog('1', '/jianzhi/message/tgtz');
            },
            getListData() {
                var self = this;
                KCmsgOnlinePage.getOnlineList(page, pageSize, function(data) {
                    self.isShowComMid = false;
                    KCmsgPage.dataDownloadFinished();
                    if(!!data && data.status == 'success') {
                        if(!!data && !!data.data && data.data.length > 0){
                            data.data.map((item) => {
                                item.date_str = Util.timeFormat(item.create_at * 1000);
                                return item;
                            });
                            if(page == 1) {
                                self.dataList = data.data;
                            }else {
                                self.dataList = self.dataList.concat(data.data);
                            }
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            self.$store.commit(combomloading_mt.SET_LOADING, false);
                            if(data.data.length < pageSize){
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                            }
                           page++;
                        }else if(!!data && !!data.data && data.data.length == 0){
                            self.$store.commit(combomloading_mt.SET_LOADING, false); 
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                            if(page == 1){
                                self.dataList = [];
                                KCmsgPage.loadPageStatus('noData');
                            }
                            self.$store.commit(combomloading_mt.SET_NOMORE, true);
                        }else{
                            if(page == 1){
                                KCmsgPage.loadPageStatus('loadFailed');
                            }else{
                                KCwidget.toast('服务器异常');
                                self.$store.commit(combomloading_mt.SET_LOADING, true);
                            }
                        }
                        self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                    }else if (!!data && data.status == 'error') {
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(page == 1) {
                            KCmsgPage.loadPageStatus('loadFailed');
                        }else{
                            if(!!data.message) {
                                KCwidget.toast(data.message);
                            }else{
                                KCwidget.toast('服务器异常');
                            }
                            self.$store.commit(combomloading_mt.SET_LOADING, true);
                        }
                    }else if(!!data && data.status == 'nonet') {
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(page == 1) {
                            KCmsgPage.loadPageStatus('netWorkFailed');
                            if (Util.OS() == 'ios') {
                                KCclientInfo.getNetworkType(function(networkData){
                                    Util.openNetworkSetting(networkData.network);
                                });
                            }
                        }else{
                            self.$store.commit(combomloading_mt.SET_LOADING, true);
                            KCwidget.toast('网络异常');
                        }
                    }
                    
                })
            },
            /**
             * 设置特工通知点击的埋点
             * @param {[type]} urd [description]
             */
            setLog(urd) {
                let strList = urd.split('&');
                let str = '';
                for(let i = 0; i < strList.length; i++) {
                    if(strList[i].indexOf('task_id') > -1) {
                        str = strList[i].split('=')[1];
                        break;
                    }
                }
                KCloggerApi.addLog('2', '@atype=click@ca_source=app@ca_name=doumi@ca_from=yyxx@task_id=' + str);
            }
        },
        beforeCreate() {

        },
        created() {
            this.init();
        }
        
    }

    
</script>
<style type="text/css">
    [v-cloak] {
      display: none;
    }
</style>
<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/message.css"></style>


