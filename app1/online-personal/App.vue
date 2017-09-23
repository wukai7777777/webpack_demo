<template>
    <!-- page start -->
    <div class="mod-page" v-cloak v-show="!isShowPageloading">
        <com-mid-loading top="45%" :com-mid-is-show="isShowComMid" />
        <!-- section start -->
        <section class="mod-content list">
            <!-- column start -->
            <div class="mod-column">
                <div class="mod-column-body" id="status_all">
                    <ul class="mod-list">
                        <li class="mod-list-item bc-main com-border-bottom com-space" v-for="(task, index) in taskListData">
                            <a href="javascript:;" class="product-info mod-list-info mod-flex" @click="goToTaskDetail(task.id, task.cityId, task.urd_data, index + 1, task.status, task.apply_id)">
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
                                        <span class="fr" :class="{'fc-gray': task.status_text == '已过期' ? true : false}">{{task.status_text}}</span>
                                    </div>
                                </div>
                            </a>
                            <p class="product-opt com-border-top" v-if="task.status == 0 && task.opt">请在{{task.finish_remain_time_c}}内按任务要求提交任务</p>
                            <p class="product-opt com-border-top" v-if="task.status == 1 && task.opt">请耐心等待，{{task.audit_remain_time_c}}后无反馈工资自动发放</p>
                        </li>
                    </ul>
                    <com-bom-loading :load-fn="getPersonalTaskList"/>
                </div>
            </div>
            <!-- column end -->
        </section>
        <!-- section end -->
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
    import KCol_indexPage from 'clientApi/KCol_indexPage'
    import KCucApi from 'clientApi/KCucApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCcityApi from 'clientApi/KCcityApi'
    import KCwidget from 'clientApi/KCwidget'
    import KCcache from 'clientApi/KCcache'
    import KCclientInfo from 'clientApi/KCclientInfo'
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
                taskListData: [],
                userId: '',
                cityId: '',
                page: 1,
                pageSize: 20,
                isShowPageloading: false,
                numerousCountdown: false,
                listing_status: Util.getQueryString('index'),
                clientHeight: document.documentElement.clientHeight,
                isShowComMid: false,
                hasCache: false
            }
        },
        computed: {

        },
        methods: {
            /**
             * 初始化
             * @method initFun
             * @public
             * @return {Null} void
             */
            initFun () {
                let self = this;
                window.loadData = function () {
                    KCucPage.loadPageStatus('loadSuccess');

                    self.page = 1;
                    self.listing_status = Util.getQueryString('index');

                    KCcityApi.getValidCity(function (data) {
                        if (!data) {
                            // 定位失败
                            self.cityId = 0;
                        } else {
                            self.cityId = data.cityid;
                        }
                        KCucApi.getUserInfo(function(data){
                            if (!!data.userId && data.userId !== '0') {
                                self.userId = data.userId;
                                self.getPersonalTaskList(true);
                            } else {
                                KCwidget.toast('服务器异常');
                            }
                        });
                    });  
                };

                KCucApi.getUserInfo(function (data) {
                    if(!!data.userId && data.userId !== '0'){
                        self.userId = data.userId;
                        KCcache.getCache('taskData' + self.listing_status + self.userId, function (data) {
                            if (!data) {
                                // 没有缓存
                                self.isShowPageloading = true;
                                self.isShowComMid = true;
                                self.hasCache = false;
                                self.page = 1;
                                KCcityApi.getValidCity(function (data) {
                                    if (!data) {
                                        // 定位失败
                                        self.cityId = 0;
                                    } else {
                                        self.cityId = data.cityid;
                                    }
                                    self.getPersonalTaskList();
                                });
                            } else if (!!data && !!data.data && !!data.data.tasks && data.data.tasks.length > 0 && data.code == 1000) {
                                self.isShowPageloading = false;
                                self.isShowComMid = false;
                                self.hasCache = true;
                                // 有缓存先读取缓存，并刷新数据
                                self.taskListData = data.data.tasks;
                                KCol_indexPage.refreshPage();
                            } else {
                                self.isShowPageloading = true;
                                self.isShowComMid = true;
                                self.page = 1;
                                KCcityApi.getValidCity(function (data) {
                                    if (!data) {
                                        // 定位失败
                                        self.cityId = 0;
                                    } else {
                                        self.cityId = data.cityid;
                                    }
                                    self.getPersonalTaskList();
                                });
                            }
                        });
                        KCloggerApi.addLog('0','我的特工_展现&详情页展现&{"详情页展现":"已登录"}');
                    }else{
                        KCloggerApi.addLog('0','我的特工_展现&详情页展现&{"详情页展现":"未登录"}');
                    }
                });
            },
            /**
             * 获取我的特工列表数据
             * @method getPersonalTaskList
             * @public
             * @return {Null} void
             */
            getPersonalTaskList (isRefresh) {
                let self = this;
                Util.ajax({
                    url: '/onlinetask/usertask?type=' + self.listing_status + '&page=' + self.page + '&pagesize=' + self.pageSize,
                    type: 'POST',
                    timeout: 10000,
                    ctrlStatus: {
                        loading: self.page,
                        cache: self.hasCache,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function (data) {
                        // console.log(data)
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if (!!data && data.code == 1000) {
                            if(!!data.data && !!data.data.tasks && data.data.tasks.length > 0){
                                data.data.tasks.forEach(function (item, index) {
                                    item.cityId = self.cityId;
                                    if (item.status == 0 || item.status == 1) {
                                        item.opt = true;
                                        if(!!item.finish_remain_time){
                                            item.finish_remain_time_c = Util.parseSeconds(item.finish_remain_time);
                                        }
                                        if(!!item.audit_remain_time){
                                            item.audit_remain_time_c = Util.parseSeconds(item.audit_remain_time);
                                        }
                                    }
                                    //如果需要跳转到特工详情，则构建urd_data
                                    item.urd_data = encodeURIComponent(`tag_status=${item.tag_status}&title=${item.title}&left_stock=${item.left_stock}&deadline=${item.deadline}&amount=${item.amount}&old_amount=${item.old_amount}`);
                                });

                                if(self.page == 1){
                                    KCcache.setCache('taskData' + self.listing_status + self.userId, data, 10 * 24 * 60 * 60);
                                    self.taskListData = data.data.tasks;
                                }else{
                                    self.taskListData = self.taskListData.concat(data.data.tasks);
                                }
                                if(data.data.last_page == 1 || data.data.last_page == data.data.current_page){
                                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                    self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                }else{
                                    self.$store.commit(combomloading_mt.SET_NOMORE, false);
                                    self.$store.commit(combomloading_mt.SET_LOADING, false);
                                    self.page++;
                                }
                                if(Util.OS() == 'ios'){
                                    if(!!isRefresh){
                                        // 重置
                                        if (self.numerousCountdown) {
                                            self.numerousCountdown.postMessage('reset');
                                        } 
                                    }

                                    if(!self.numerousCountdown){
                                        self.numerousCountdown = Util.numerousCountdown(function(sec){
                                            self.taskListData.forEach(function (item, index) {
                                                if ((item.status == 0 || item.status == 1) &&  (item.status_text != '已过期' && item.status_text != '已通过')) {
                                                    let tempTimeName = '';
                                                    if (item.status == 0) {
                                                        tempTimeName = 'finish_remain_time';
                                                    } else if (item.status == 1) {
                                                        tempTimeName = 'audit_remain_time';
                                                    }
                                                    // console.log(index + '==>' + parseInt(Math.abs(item[tempTimeName])) + '====>' + sec)
                                                    let curtime = parseInt(Math.abs(item[tempTimeName])) - sec;
                                                    if (curtime <= 0) {
                                                        item.opt = false;
                                                        if (item.status == 0) {
                                                            item.status_text = '已过期';
                                                        } else {
                                                            item.status_text = '已通过';
                                                        }
                                                    } else {
                                                        let tempTimeNameC = '';
                                                        if (item.status == 0) {
                                                            tempTimeNameC = 'finish_remain_time_c';
                                                        } else {
                                                            tempTimeNameC = 'audit_remain_time_c';
                                                        }
                                                        item[tempTimeNameC] = Util.parseSeconds(curtime);
                                                    }
                                                }
                                            });
                                        });
                                    }
                                }else{
                                    self.taskListData.forEach(function (item, index) {
                                        if (item.status == 0 || item.status == 1) {
                                            let tempTimeName = '';
                                            if (item.status == 0) {
                                                tempTimeName = 'finish_remain_time';
                                            } else if (item.status == 1) {
                                                tempTimeName = 'audit_remain_time';
                                            }
                                            Util.countdown(self.taskListData[index][tempTimeName], function(countnum){
                                                let tempTimeNameC = '';
                                                if (item.status == 0) {
                                                    tempTimeNameC = 'finish_remain_time_c';
                                                } else {
                                                    tempTimeNameC = 'audit_remain_time_c';
                                                }
                                                item[tempTimeNameC] = countnum;
                                            },function(){
                                                item.opt = false;
                                                if (item.status == 0) {
                                                    item.status_text = '已过期';
                                                } else {
                                                    item.status_text = '已通过';
                                                }  
                                            });
                                        }
                                    });
                                }
                            }else if(!!data.data && !!data.data.tasks && data.data.tasks.length == 0){
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                if(self.page == 1){
                                    KCcache.setCache('taskData' + self.listing_status + self.userId, null, 10 * 24 * 60 * 60);
                                    self.taskListData = [];
                                    self.isShowLoadingBar = false;
                                    KCol_indexPage.loadPageStatus('noData');
                                }else {
                                    self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                }
                            }
                        } else {
                            KCol_indexPage.dataDownloadFinished();
                            if(self.page == 1){
                                self.isShowLoadingBar = false;
                                KCol_indexPage.loadPageStatus('loadFailed');
                            }else{
                                KCwidget.toast('服务器异常');
                            }
                        }
                        self.isShowPageloading = false;
                        self.isShowComMid = false;
                        self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                        KCol_indexPage.dataDownloadFinished();
                    },
                    error: function (xhr, status) {
                        KCol_indexPage.dataDownloadFinished();
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        self.isShowLoadingBar = false;
                    },
                    noNetwork: function () {
                        KCol_indexPage.dataDownloadFinished();
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        self.isShowLoadingBar = false;
                    }
                });
            },
            /**
             * 跳转至特工详情
             * @method goToTaskDetail
             * @public
             * @return {Null} void
             */
            goToTaskDetail (task_id, city_id, urd_data, index, status, apply_id) {
                let self = this;
                let ca_kw = '';
                if (self.page <= 2) {
                    ca_kw = '@ca_kw=' + index
                }

                let current_tab = 'qb';
                switch (self.listing_status) {
                    case '1':
                      current_tab = 'jxz'
                      break;
                    case '2':
                      current_tab = 'shz'
                      break;
                    case '3':
                      current_tab = 'yjs'
                      break;
                }

                //v2.9.0 如果特工任务状态是申请超时、已拒绝、重审拒绝、审核中、重审中、完成（手工审核通过，自动审核通过）、重审手动通过、重审自动，则跳转至特工提交详情页
                let goToSubmitDetailStatusArr = ['-1', '-2', '-3', '1', '2', '3', '4', '5'];
                if (goToSubmitDetailStatusArr.indexOf(status) != -1) {
                    window.location.href = 'doumi://online-submit-detail?apply_id=' + apply_id + '&task_id=' + task_id + '&city_id=' + city_id + '&from=wdtg' + '&urdData=' + urd_data;
                } else {
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + current_tab + '@ca_from=post_list@task_id=' + task_id+ca_kw);
                    window.location.href = 'doumi://onlinetaskdetail?task_id=' + task_id + '&city_id=' + city_id + '&urdData=' + urd_data;
                }
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