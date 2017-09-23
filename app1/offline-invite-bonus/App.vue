<template>
    <!-- page start -->
    <div class="mod-page">
        <com-mid-loading :com-mid-is-show="isShowComMid" />
        <!-- section start -->
        <section class="mod-content page-name" v-show="!pageLoadingStatus && get_offlineinvitenodata_displayIndex == -1" v-cloak>
            <div class="offline-list com-border-bottom">
                <div class="mod-flex com-border-bottom offline-list-head">
                    <div class="mod-flex-item offline-list-item">时间</div>
                    <div class="mod-flex-item offline-list-item">受邀人手机号</div>
                    <div class="mod-flex-item offline-list-item">分红金额</div>
                </div>
                <ul class="offline-list-body">
                    <li class="mod-flex" v-for="item in dataObj">
                        <div class="mod-flex-item offline-list-item">{{item.create_at}}</div>
                        <div class="mod-flex-item offline-list-item">{{item.slave_phone}}</div>
                        <div class="mod-flex-item offline-list-item">{{item.amount}}元</div>
                    </li>
                </ul>
            </div>
            <com-bom-loading :load-fn="getInviteBonusData"/>
        </section>
        <!-- section end -->
        <offlineInviteNodata></offlineInviteNodata>
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
    import KCucApi from 'clientApi/KCucApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCwidget from 'clientApi/KCwidget'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import {mapGetters} from 'vuex'

    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import offlineInviteNodata from 'components/offline-invite-nodata/offline-invite-nodata'
    import * as offlineInviteNodata_mt from 'components/offline-invite-nodata/offline-invite-nodata-mutation-types'
    import comBomLoading from 'components/com-bom-loading/com-bom-loading'
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'
    import * as combomloading_mt from "components/com-bom-loading/com-bom-loading-mutation-types"
    
    /**
     *  组件实例对象
     */
    export default {
        components: {
            offlineInviteNodata,
            comBomLoading,
            comMidLoading
        },
        data () {
            return {
                dataObj: [],
                page: 1,
                pageSize: 20,
                pageLoadingStatus: true,
                isShowComMid: true
            }
        },
        computed: {
            ...mapGetters(['get_offlineinvitenodata_displayIndex'])
        },
        methods: {
            getInviteBonusData() {
                var self = this;
                Util.ajax({
                    url:'/onlinetask/bonuslist?page=' + self.page + '&pagesize=' + self.pageSize,
                    timeout:10000,
                    ctrlStatus: {
                        loading: self.page,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        if(!!data && data.code == 1000){
                            KCucPage.dataDownloadFinished();
                            self.pageLoadingStatus = false;
                            self.isShowComMid = false;
                            self.$store.commit(combomloading_mt.SET_LOADING, false);
                            self.$store.commit(combomloading_mt.SET_NOMORE, false);
                            if(!!data.data && !!data.data.data && data.data.data.length > 0){
                                if(self.page == 1){
                                    // self.setDisplayIndex(-1);
                                    self.$store.commit(offlineInviteNodata_mt.SET_DISPLAY_INDEX, -1);
                                    self.dataObj = [];
                                    self.dataObj = data.data.data;

                                    KCloggerApi.addLog('0','分享赚钱页面_我的分红页面展现&页面展现量&{"有下线":"展现量"}');
                                }else{
                                    self.dataObj = self.dataObj.concat(data.data.data);
                                }
                                if(data.data.last_page == 1 || data.data.last_page == data.data.current_page){
                                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                    self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                }else{
                                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                                }
                                self.page++;
                            }else if(!!data.data && !!data.data.data && data.data.data.length == 0){
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                if(self.page == 1){
                                    self.dataObj = [];
                                    // self.setDisplayIndex(1);
                                    self.$store.commit(offlineInviteNodata_mt.SET_DISPLAY_INDEX, 1);

                                    KCloggerApi.addLog('0','分享赚钱页面_我的分红页面展现&页面展现量&{"有下线":"展现量"}');
                                }else{
                                    self.$store.commit(combomloading_mt.SET_LOADING, false);
                                    self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                }
                            }
                        }else if(!!data && data.code == -100){
                            //未登录
                            KCucApi.logOut();
                        }else{
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            if(self.page == 1){
                                self.dataObj = [];
                                KCucPage.loadPageStatus('loadFailed');
                            }else{
                                KCwidget.toast('服务器异常');
                            }
                        }
                    },
                    error:function(xhr, status){
                        if (self.page > 1) {
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            self.$store.commit(combomloading_mt.SET_LOADING, true);
                        }
                        self.isShowComMid = false;
                    },
                    noNetwork: function(){
                        self.isShowComMid = false;
                    }
                });
            }
        },
        beforeCreate() {

        },
        created() {
            let self = this;
            self.getInviteBonusData();
            self.$store.commit(combomloading_mt.SET_ISSHOW, true);
        }
    }
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/online_offline.css"></style>