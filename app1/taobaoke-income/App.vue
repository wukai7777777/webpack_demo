<template>
    <!-- page start -->
    <div class="mod-page mod-header-show" style="padding-top: 0;">
        <!-- com-mid-loading -->
        <com-mid-loading top="45%" :com-mid-is-show="comMidIsShow"/>
        <!-- section start -->
        <section class="mod-content income mod-footbar-show">
            <!-- tips start -->
            <p class="mod-tips">淘任务佣金按月进行结算，每月25号发放上月相关订单的佣金</p>
            <!-- tips end -->
            <!-- column start -->
            <div class="mod-column product">
                <div class="mod-column-body">
                    <ul class="mod-list" v-for="(item, index) of dataList">
                        <li class="mod-list-item" :key="item.id">
                            <div class="mod-list-info product-info">
                                <h3 class="product-title">{{item.date}}</h3>
                                <div class="product-price"><span class="label">{{item.amount_info}}：</span><b>{{item.amount}}</b>元</div>
                                <div class="product-ds">{{item.info}}</div>
                                <div class="product-status" :class="statusObj[item.status].class">{{statusObj[item.status].text}}</div>
                            </div>
                        </li>
                    </ul>
                    <com-bom-loading :load-fn="loadNext"/>
                </div>
            </div>
            <!-- column end -->
        </section>
        <!-- section end -->
        <!-- footbar start -->
        <div class="mod-footbar">
            <div class="btn-group">
                <button class="btn btn-primary btn-large" type="button"><a href="doumi://onlineincome?buttonTitle=去我的钱包">去我的钱包</a></button>
            </div>
        </div>
        <!-- footbar end -->
    </div>
    <!-- page end -->
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import { KCpageInstances } from 'clientApi/KCpage'
    import KCtbkIncomePage from 'clientApi/KctbkIncomePage'
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
        data: function() {
            return {
                dataList: [],
                page: 1,
                pageSize: 20,
                comMidIsShow: false,
                hasCache: false,
                statusObj: {
                    0: {
                        text: '未结算',
                        class: ''
                    },
                    1: {
                        text: '已结算',
                        class: 'fc-red'
                    }
                }
            }
        },
        computed: {

        },
        methods: {
            /**
             * [getIncomeList 获取收入列表]
             * @return {[type]} [description]
             */
            getIncomeList() {
                let self = this;
                Util.ajax({
                    timeout: 10000,
                    url: `/tbk/incomelist?page=${this.page}&pageSize=${this.pageSize}`,
                    apiPath: '/api/v3/client',
                    ctrlStatus: {
                        loading: self.page,
                        cache: self.hasCache,
                        errNum: 0,
                        netNum: 0
                    },
                    success(data) {
                        console.log(data);
                        self.ajaxAllCase();
                        if (Util.isObject(data) && Util.isArray(data.data)) {
                            // let dinfo = data.data;
                            let dlist = data.data;
                            let length = dlist.length;
                            // 添加下拉刷新控件
                            if (!self.dataList.length) KCpageInstances.canPullWebView(true);
                            // 写缓存&渲染列表
                            if (self.page === 1) {
                                self.dataList = dlist;
                                KCcache.setCache('tbkIncomeList', data, 10 * 24 * 60 * 60);
                            } else {
                                self.dataList = self.dataList.concat(dlist);
                            }
                            // 显示上拉状态
                            self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                            // 最后一页
                            if(self.pageSize > length || length === 0) {
                                // 禁止上拉
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                // 显示已没有更多数据
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                            } else {
                                // 显示释放加载更多
                                self.$store.commit(combomloading_mt.SET_NOMORE, false);
                            }
                            // 显示释放加载更多
                            self.$store.commit(combomloading_mt.SET_LOADING, false);
                            // 页数加一
                            self.page++;
                        } else {
                            KCwidget.toast('服务器异常');
                            // 禁止上拉
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                        }
                    },
                    error(xhr, status) {
                        self.ajaxAllCase();
                    },
                    noNetwork() {
                        self.ajaxAllCase();
                    }
                })
            },
            /**
             * [ajaxAllCase ajax所有状态的回调]
             * @return {[type]} [description]
             */
            ajaxAllCase() {
                let self = this;
                self.comMidIsShow = false;
                // 允许上拉
                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                if (self.page === 1) {
                    KCpageInstances.listDataLoadFinished();
                    KCpageInstances.dataDownloadFinished();
                }
            },
            /**
             * [loadNext 加载下一页]
             * @return {[type]} [description]
             */
            loadNext() {
                this.getIncomeList();
            }
        },
        beforeCreate() {
            let self = this;
            // native 下拉调用
            window.loadData = function(needparam) {
                self.page = 1;
                // 禁止上拉
                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                // 隐藏上拉状态
                self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                self.getIncomeList();
            }
        },
        created() {
            let self = this;
            // 获取列表缓存
            KCcache.getCache('tbkIncomeList', function(data) {
                if (Util.isObject(data)) {
                    self.dataList = data.data;
                    self.hasCache = true;
                    // 添加下拉刷新控件
                    KCpageInstances.canPullWebView(true);
                    // 刷新页面
                    KCpageInstances.refreshPage();
                } else {
                    self.comMidIsShow = true;
                    self.hasCache = false;
                    // 加载列表
                    self.page = 1;
                    self.getIncomeList();
                }
            });
        }
    }
</script>

<!-- CSS 样式 -->
<style src="static/style/taobaoke_income.css"></style>