<template>
    <!-- page start -->
    <div class="mod-page mod-header-show" style="padding-top: 0;">
        <!-- com-mid-loading -->
        <com-mid-loading top="45%" :com-mid-is-show="comMidIsShow"/>
        <!-- section start -->
        <section class="mod-content order">
            <!-- column start -->
            <div class="mod-column product">
                <div class="mod-column-body" id="list_all">
                    <ul class="mod-list">
                        <li class="mod-list-item" v-for="(item, index) of dataList" :key="item.tb_goods_id">
                            <div class="mod-list-info product-info">
                                <div class="product-image"><img :src="item.tb_goods_image_url" :alt="item.title"></div>
                                <div class="product-content">
                                    <h3 class="product-title">{{item.tb_goods_title}}</h3>
                                    <div class="product-meta"><span class="label">下单时间：</span>{{item.tb_order_create_at}}</div>
                                    <div class="product-meta"><span class="label">订单号：</span>{{item.tb_order_no}}</div>
                                    <div class="product-price"><span class="label">预估收入：</span><b>{{item.user_esti_income}}</b>元</div>
                                    <div class="product-status" :class="statusObj[item.listing_status]">{{item.listing_status_show}}</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <!-- com-bom-loading -->
                    <com-bom-loading :load-fn="loadNext"/>
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
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import { KCpageInstances } from 'clientApi/KCpage'
    import KCtbkOrderPage from 'clientApi/KctbkOrderPage'
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
                    '-1': 'fc-grey',
                    '0': '',
                    '2': '',
                    '4': 'fc-red'
                }
            }
        },
        computed: {

        },
        methods: {
            /**
             * [loadOrderList 加载订单列表]
             * @return {[type]} [description]
             */
            loadOrderList() {
                let self = this;
                Util.ajax({
                    timeout: 10000,
                    url: `/tbk/orderlist?page=${this.page}&pageSize=${this.pageSize}`,
                    apiPath: '/api/v3/client',
                    ctrlStatus: {
                        loading: self.page,
                        cache: self.hasCache,
                        errNum: 0,
                        netNum: 0
                    },
                    success(data) {
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
                                KCcache.setCache('tbkOrderList', data, 10 * 24 * 60 * 60);
                            } else {
                                self.dataList = self.dataList.concat(dlist);
                            }
                            // 显示上拉状态
                            self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                            // 最后一页
                            if(length < self.pageSize || length === 0) {
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
                this.loadOrderList();
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
                self.loadOrderList();
            }
        },
        created() {
            let self = this;
            // 获取列表缓存
            KCcache.getCache('tbkOrderList', function(data) {
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
                    self.loadOrderList();
                }
            });
        }
        
    }
</script>

<!-- CSS 样式 -->
<style src="static/style/taobaoke_order.css"></style>