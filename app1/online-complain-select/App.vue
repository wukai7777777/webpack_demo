<template>
    <div>
        <com-mid-loading top="45%" :com-mid-is-show="isShowComMid" />
        <!-- section start -->
        <section class="mod-content list" v-cloak v-show="!isShowPageloading">
            <!-- column start -->
            <div class="mod-column">
                <div class="mod-column-body">
                    <ul class="mod-list">
                        <li class="mod-list-item bc-main com-border-bottom com-space" v-for="task in listData">
                            <a href="javascript:;" class="product-info mod-list-info mod-flex" @click="goToOnlineComplainSelect(task.id, task.apply_id, task.city_id, task.title, task.urd_data)">
                                <div class="product-image" v-if="task.task_type == 1"><img src="../../static/imgs/online/icon_cate_reg.png" alt="下载注册"></div>
                                <div class="product-image" v-if="task.task_type == 2"><img src="../../static/imgs/online/icon_cate_share.png" alt="互动分享"></div>
                                <div class="product-image" v-if="task.task_type == 3"><img src="../../static/imgs/online/icon_cate_promotion.png" alt="驻点推广"></div>
                                <div class="product-image" v-if="task.task_type == 4"><img src="../../static/imgs/online/icon_cate_survey.png" alt="用户调研"></div>
                                <div class="product-image" v-if="task.task_type == 5"><img src="../../static/imgs/online/icon_cate_check.png" alt="验收采集"></div>
                                <div class="product-image" v-if="task.task_type == 6"><img src="../../static/imgs/online/icon_cate_other.png" alt="其他"></div>
                                <div class="product-content mod-flex-item">
                                    <h3 class="product-title">{{task.title}}</h3>
                                    <div class="product-meta">
                                        <span class="fl" v-if="task.tag_status==1"><del>{{task.old_amount}}元</del><i class="icon icon-rise"></i><b class="fc-red">{{task.amount}}</b>元</span>
                                        <span class="fl" v-else><b class="fc-red">{{task.amount}}</b>元</span>
                                        <span class="fl line">剩余{{task.left_stock}}次</span>
                                        <span class="fr">{{task.status_text}}</span>
                                    </div>
                                </div>
                            </a>
                            <nav class="mod-nav product-opt com-border-top">
                                <ul class="mod-flex">
                                    <li class="mod-flex-item com-border-right">
                                        <a href="javascript:;" class="mod-nav-item" @click="goToOnlineComplainSelect(task.id, task.apply_id, task.city_id, task.title, task.urd_data)">申诉职位</a>
                                    </li>
                                </ul>
                            </nav>
                        </li>
                    </ul>
                    <com-bom-loading :load-fn="getOnlineJobs"/>
                </div>
            </div>
            <!-- column end -->
        </section>
        <!-- section end -->
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
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCucApi from 'clientApi/KCucApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    
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
                listData: [],
                page: 1,
                pageSize: 10,
                // canNextRequest: true,
                // loadStatus: false,
                // loadingStatus: false,
                // moreStatus: false,
                // isShowLoadingBar: false,
                isShowPageloading: true,
                isShowComMid: false
            }
        },
        computed: {

        },
        methods: {
            /**
             * 初始化
             * @method initFun
             * public
             * @return {Null} void
             */
            initFun () {
                let self = this;

                KCmsgPage.canPullWebView(true);
                self.isShowComMid = true;
                window.loadData = function () {
                    //console.log('window.loadData')
                    self.page = 1;
                    self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                    self.getOnlineJobs();
                };

                KCcache.getCache('onlineComplain_listData', function (data) {
                    //console.log(data)
                    if (!!data && data != 'null') {
                        self.listData = data.data.tasks;
                    } else {
                        // self.hasCache = false;
                        // KCmsgPage.loadPageStatus('noData');
                        self.isShowPageloading = true;
                        // self.isShowComMid = true;
                    }
                    self.getOnlineJobs();
                });
            },
            /**
             * 获取特工任务列表
             * @method getPersonalOnlineJobs
             * public
             * @return {Null} void
             */
            getOnlineJobs () {
                let self = this;
                Util.ajax({
                    url:'/onlinetask/complaintasks?page=' + self.page + '&pagesize=' + self.pageSize,
                    timeout:10000,
                    ctrlStatus: {
                        loading: self.page,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function (data) {
                        // console.log(data);
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if (!!data && data.code == 1000) {
                            KCmsgPage.dataDownloadFinished();
                            self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                            
                            // console.log('page===>' + self.page);

                            if (!!data.data && !!data.data.tasks && data.data.tasks.length > 0) {
                                data.data.tasks.forEach(function (item, index) {
                                    //如果需要跳转到特工详情，则构建urd_data
                                    item.urd_data = encodeURIComponent(`tag_status=${item.tag_status}&title=${item.title}&left_stock=${item.left_stock}&deadline=${item.deadline}&amount=${item.amount}&old_amount=${item.old_amount}`);
                                });
                                if (self.page == 1) {
                                    KCcache.setCache('onlineComplain_listData', data, 10 * 24 * 60 * 60);
                                    self.listData = data.data.tasks;
                                } else {
                                    self.listData = self.listData.concat(data.data.tasks);
                                }
                                if (data.data.last_page == 1 || data.data.last_page == data.data.current_page) {
                                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                    self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                } else {
                                    self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                    self.$store.commit(combomloading_mt.SET_LOADING, false);
                                    self.page++;
                                }
                            } else if (!!data.data && !!data.data.tasks && data.data.tasks.length == 0) {
                                // self.canNextRequest = false;
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                if (self.page == 1) {
                                    KCcache.setCache('onlineComplain_listData', null, 10 * 24 * 60 * 60);
                                    self.listData = [];
                                    // self.isShowLoadingBar = false;
                                    self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                                    KCmsgPage.loadPageStatus('noData');
                                }
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                            }
                        } else if (!!data && data.code == -100) {
                            KCucApi.logOut();
                        } else {
                            KCmsgPage.dataDownloadFinished();
                            if (self.page == 1) {
                                self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                                KCmsgPage.loadPageStatus('loadFailed');
                            } else {
                                KCwidget.toast('服务器异常');
                            }
                        }
                        self.isShowPageloading = false;
                        self.isShowComMid = false;
                    },
                    error: function (xhr, status) {
                        KCmsgPage.dataDownloadFinished();
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        self.isShowComMid = false;
                    },
                    noNetwork: function () {
                        KCmsgPage.dataDownloadFinished();
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        self.isShowComMid = false;
                    }
                });
            },
            /**
             * 设置加载状态
             * @method setStatus
             * public
             * @return {Null} void
             */
            setStatus (emptyEle,loadingMore,noData) {
                let self = this;
                // self.loadStatus = emptyEle;
                // self.loadingStatus = loadingMore;
                // self.moreStatus = noData;
                self.$store.commit(combomloading_mt.SET_LOADING, loadingMore);
                self.$store.commit(combomloading_mt.SET_NOMORE, noData);
            },
            /**
             * 跳转去提交特公告详情页
             * @method goToOnlineComplainSelect
             * public
             * @return {Null} void
             */
            goToOnlineComplainSelect (taskId, applyId, cityId, post_title, urd_data) {
                let self = this;
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=see_flow@task_id=' + taskId);
                window.location.href = `doumi://online-submit-detail?apply_id=${applyId}&task_id=${taskId}&city_id=${cityId}&post_title=${post_title}&from=tsyfk&urdData=${urd_data}`;
            }
        },
        beforeCreate() {

        },
        created() {
            this.initFun();
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/online_list.css"></style>