<template>
    <!-- page start -->
    <div class="mod-page">
        <!-- section start -->
        <!-- com-mid-loading -->
        <com-mid-loading :top="(warpHeight / 2) - 30 + 'px'" :com-mid-is-show="isShowComMid" />
        <section class="mod-content wallet" :class="{'mod-footbar-show' : platform == 'ios'}" v-show="!isShowComMid">
            <!-- wallet-box start -->
            <div class="wallet-box">
                <div class="wallet-info">
                    <p>余额</p>
                    <p><b>{{balance}}</b>元</p>
                </div>
            </div>
            <!-- wallet-box end -->
            <!-- mod-message start -->
            <div class="mod-message bc-main com-border-bottom" v-if="broadcast">
                <a href="javascript:;" class="mod-message-info" :class="{'mod-message-info-s':broadcast.type == 0}" @click="goBroadCaseUrl(broadcast.url)">{{broadcast.message}}</a>
            </div>
            <!-- message start -->
            <!-- column start -->
            <div class="mod-column bc-main com-space record">
                <div class="mod-column-body">
                    <ul class="mod-list">
                        <li class="mod-list-item com-border-bottom" v-for="item in listData">
                            <div class="mod-list-info product-info">
                                <div class="product-content">
                                    <h3 class="product-title">{{item.title}}</h3>
                                    <div class="product-meta">账单类型：{{item.recode_type_name}}</div>
                                    <p class="product-ds"><span class="fc-gray">备注：{{item.remark}}</span></p>
                                </div>
                                <div class="product-aside">
                                    <div class="product-meta">{{item.create_at_str}}</div>
                                    <div class="product-meta"><b>{{item.recode_type_str}}{{item.amount}}元</b></div>
                                    <p class="product-ds">
                                    <span class="fc-red" v-if="item.gray_status == 1">({{item.listing_status_str}})</span>
                                    <span v-else :class="{'fc-gray':item.listing_status == 5,'fc-red':item.listing_status == -1}">({{item.listing_status_str}})</span>
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <!-- com-bom-loading -->
                    <com-bom-loading :load-fn="loadFunc"/>
                </div>
            </div>
            <!-- column end -->
        </section>
        <!-- section end -->
    </div>
    <!-- page end -->
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import widget from 'clientApi/KCwidget.js'
    import clientInfo from 'clientApi/KCclientInfo.js'
    import KCucPage from 'clientApi/KCucPage'
    import Util from 'tool/widget/Util'
    import {mapGetters} from 'vuex'

    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
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
        data () {
            return {
                balance: '',
                broadcast: {},
                listData: [],
                page: 1,
                pageSize: 20,
                isShowComMid: true,
                platform: Util.OS(),
                warpHeight: document.documentElement.clientHeight
            }
        },
        methods: {
            /**
             * 初始化
             * @method initFun
             * @public
             * @return {Null} void
             */
            initFun (){
                var self = this;
                self.page = 1;
                self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                self.getBalance();
                self.getCashrecord();
            },
            loadFunc () {
                let self = this;
                self.getCashrecord();
            },
            goBroadCaseUrl(url){
                if(url != ''){ 
                    if(/doumi:\/\//.test(url)){
                        window.location.href = url;
                    }else{
                        window.location.href = 'doumi://browser/'+encodeURIComponent(url);
                    }
                }
            },
            getBalance(){
                var self = this;
                Util.ajax({
                    url:'/ucenter/balance',
                    timeout:10000,
                    ctrlStatus: {
                        loading: 1,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        if(!!data){
                            self.balance = data.balance;
                            self.broadcast = data.broadcast;
                        }else{
                            self.isShowComMid = false;
                            KCucPage.loadPageStatus('loadFailed');
                        }
                    },
                    error:function(xhr, status){
                        KCucPage.loadPageStatus('loadFailed');
                        self.isShowComMid = false;
                    },
                    noNetwork: function(){
                        KCucPage.loadPageStatus('netWorkFailed');
                        self.isShowComMid = false;
                    }
                });
            },
            getCashrecord(){
                var self = this;
                Util.ajax({
                    url:'/ucenter/cashrecord?page=' + self.page + '&pageSize=' + self.pageSize,
                    timeout:10000,
                    ctrlStatus: {
                        loading: self.page,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        // console.log(data);
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);

                        if(!!data && !!data.data && Util.getDataLength(data.data) > 0){
                            if(self.page == 1){
                                self.listData = data.data;
                            }else{
                                self.listData = self.listData.concat(data.data);
                            }
                            if(data.last_page == 1 || data.last_page == data.current_page){
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                            }else{
                                // self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                                self.$store.commit(combomloading_mt.SET_NOMORE, false);
                                self.$store.commit(combomloading_mt.SET_LOADING, false);
                                self.page++;
                            }
                        }else if(!!data && !!data.data && Util.getDataLength(data.data) == 0){
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                            self.$store.commit(combomloading_mt.SET_NOMORE, true);
                        }else{
                            if(self.page == 1){
                                KCucPage.loadPageStatus('loadFailed');
                            }else{
                                widget.toast('服务器异常');
                                self.$store.commit(combomloading_mt.SET_LOADING, true);
                            }
                        }
                        self.isShowComMid = false;
                        self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                        KCucPage.dataDownloadFinished();
                    },
                    error:function(xhr, status){
                        if(self.page > 1){
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            self.$store.commit(combomloading_mt.SET_LOADING, true);
                        }
                        self.isShowComMid = false;
                    },
                    noNetwork: function(status){
                        self.isShowComMid = false;
                    }
                });
            }
        },
        beforeCreate() {

        },
        created() {
            var self = this;
            self.initFun();
            window.loadData=function(){
                self.isShowComMid = true;
                self.initFun();
            };
            window.jump = function(){
                window.location.href = "doumi://applycash";
            };
        }
    }
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/btn.css"></style>
<style src="static/css/wallet.css"></style>