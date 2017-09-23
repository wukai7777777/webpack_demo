<template>
    <!-- page start -->
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content index" v-cloak>
            <!-- nav start -->
            <nav class="menu mod-nav com-border-bottom" id="headerNav">
                <ul class="mod-flex">
                    <li class="mod-flex-item active">
                        <a href="javascript:;" class="mod-nav-item" v-on:click="goToMyOnlineTask($event)">我的特工<br><b>{{userBaseInfoObj.task_count}}</b>个</a>
                    </li>
                    <li class="mod-flex-item">
                        <a href="javascript:;" class="mod-nav-item" v-on:click="goToMyApplyCash($event)">特工收入<br><b>{{userBaseInfoObj.income}}</b>元</a>
                    </li>
                </ul>
            </nav>
            <!-- <div class="mod-banner adv-height-slide" v-if="gdtAdvHeight != 0" :style="{ height: gdtAdvHeight + 'px' }"></div> -->
            <!-- nav end -->
            <com-advertisement :adv-data="advData"></com-advertisement>
            <!-- column start -->
            <div class="list mod-column bc-main com-space" id="taskList">
                <nav class="mod-nav mod-tab com-border-bottom" id="menuNav">
                    <ul class="mod-list mod-flex">
                        <li v-for="item in menuData" class="mod-list-item mod-flex-item" v-bind:class="currentIndex == item.id?'active':''">
                            <a href="javascript:;" class="mod-nav-item">{{item.title}}</a>
                        </li>
                    </ul>
                </nav>
                <div class="mod-column-body" id="list_all" v-cloak v-bind:style="{ minHeight:minHeight }">
                    <section class="page-loading" v-bind:class="{active:isShowPageLoading}">
                        <div class="spinner">
                            <div class="spinny"></div>
                        </div>
                    </section>
                    <ul class="mod-list" v-show="isShowJobList">
                        <li class="mod-list-item com-border-bottom" v-for="(task, index) in listData" v-on:click="goToTaskDitail(task.id,task.urd_data, index+1)">
                            <a href="javascript:;" class="product-info mod-list-info mod-flex">
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
                                        <span class="fr fc-gray">{{task.deadline}}</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                    <div class="mod-status-box" v-show="isShowJobListLoading">
                        <div class="mod-status" v-bind:class="{active:loadStatus}">释放加载更多</div>
                        <div class="mod-status" v-bind:class="{active:loadingStatus}">
                            <span class="icon-loading"></span>
                            加载中...
                        </div>
                        <div class="mod-status" v-bind:class="{active:moreStatus}">已没有更多数据</div>
                    </div>
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
     *  引入工具类库 或 模块API
     */
    import Util from 'tool/widget/Util'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCol_indexPage from 'clientApi/KCol_indexPage'
    import KCcache from 'clientApi/KCcache'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCcityApi from 'clientApi/KCcityApi'
    import KCclientUI from 'clientApi/KCclientUI'
    import Vue from 'vue'

    /**
     *  引入组件 以及 组件接口(Action)
     */
    import comAdvertisement from 'components/com-advertisement/com-advertisement'

    /**
     *  组件实例对象
     */
    export default {
        components: { comAdvertisement },
        data(){
            return {
                userBaseInfoObj: {
                    income:0,
                    task_count:0
                },
                currentIndex: 0,
                menuData: [],
                clientHeight: document.documentElement.clientHeight,
                tabIndex: 0,
                isShowPageLoading: false,
                isShowJobListLoading: true,
                isShowJobList: true,
                isLoadData: true,
                isClickedMenu: false,
                isScrollToFisrtJob: false,
                canNextRequest: true,
                loadStatus: false,
                loadingStatus: false,
                moreStatus: false,
                listData: [],
                page: 1,
                pageSize: 20,
                cityid: 12,
                minHeight: 100,
                fillHeight: document.documentElement.clientHeight,
                pageOneReqCount: 0,
                noCache: false,
                advData: []
                // gdtAdvHeight: 0
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
             * 获取用户概览信息
             * @method getUserBaseInfo
             * @public
             * @return {Null} void
             */
            getUserBaseInfo() {
                var self = this;
                Util.ajax({
                    url:'/onlinetask/userinfo?set_opr_config=1',
                    timeout:10000,
                    ctrlStatus: {
                        loading: 1,
                        cache: true,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        self.clientHeight = document.documentElement.clientHeight;
                        // KCol_indexPage.dataDownloadFinished();
                        if(!!data && data.code == 1000){
                            self.userBaseInfoObj = data.data;
                            //判断三天是否已过
                            // KCcache.getCache('onlinecloseadv',function(closeData){
                                // if (!closeData) {
                                    //设置广告高度
                                    // window.setAdvertisementHeight = function(height){
                                    //     self.gdtAdvHeight = height;
                                    //     setTimeout(function(){
                                    //         self.setFilterMenuFn(false);
                                    //     },300)
                                    // };

                                    //关闭广告
                                    // window.closeAdvertisement = function() {
                                    //     self.gdtAdvHeight = 0;
                                    //     setTimeout(function(){
                                    //         self.setFilterMenuFn(false);
                                    //     },300)

                                    //     //关闭后，三天后展示
                                    //     KCcache.setCache('onlinecloseadv', {userId:self.userId}, 3 * 24 * 60 * 60);
                                    // }
                                    // if(!!data.data.ad_conf){
                                    //     if (data.data.ad_conf.type == 1) {
                                    //         self.gdtAdvHeight = 50;
                                    //     }
                                    //     let headerNavHeight = $('#headerNav').height();
                                    //     KCol_indexPage.setAdvertisementPos(headerNavHeight,data.data.ad_conf.type);
                                    // }
                                // } else {
                                //     self.gdtAdvHeight = 0;
                                // }

                                // 运营位
                                if(!!data.data.opr_conf){
                                    //存起来
                                    KCcache.setCache('opr_confData', data.data.opr_conf.items, 10 * 24 * 60 * 60);
                                    if (!!data.data.opr_conf.items) {
                                        //更新链接
                                        data.data.opr_conf.items.forEach((item, i) => {
                                            if(item.link_to != ''){
                                                if(/doumi:\/\//.test(item.link_to)){
                                                    data.data.opr_conf.items[i].link_to = item.link_to;
                                                }else{
                                                    data.data.opr_conf.items[i].link_to = 'doumi://browser/' + encodeURIComponent(item.link_to);
                                                }
                                            }
                                        });
                                        self.advData = data.data.opr_conf.items;
                                    }
                                }

                                if(data.data.tabtype.length == 1){
                                    self.menuData = [];
                                    self.currentIndex = data.data.tabtype[0].id;
                                    self.clickFilterMenuFn(0, 0);
                                }else{
                                    self.menuData = data.data.tabtype;
                                }

                                self.tabIndex = self.currentIndex;
                                
                                //设置menu位置和数据
                                // if (self.gdtAdvHeight > 0) {
                                //     setTimeout(function(){
                                //         self.setFilterMenuFn(true);
                                //     },300)
                                // } else {
                                    self.setFilterMenuFn(true);
                                // }
                            // });
                        }else{
                            KCol_indexPage.dataDownloadFinished();
                            self.isShowPageLoading = false;
                            self.isShowJobList = true;
                            self.setFilterMenuFn(true);
                            KCwidget.toast('服务器异常');
                        }
                    },
                    error:function(xhr, status){
                        KCol_indexPage.dataDownloadFinished();
                        self.isShowPageLoading = false;
                        self.isShowJobList = true;
                    },
                    noNetwork: function(){
                        KCol_indexPage.dataDownloadFinished();
                        self.isShowPageLoading = false;
                        self.isShowJobList = true;
                    }
                });
            },
            /**
             * 调用Native的setFilterMenu接口，设置menu
             * @method setFilterMenuFn
             * @public
             * @return {Null} void
             */
            setFilterMenuFn (isSetMinHeight) {
                let self = this;
                self.$nextTick(function () {
                    //通知客户端menu数据和高度
                    var headerNavHeight = $('#menuNav').offset().top;
                    var menuNavHeight = $('#menuNav').height();
                    KCol_indexPage.setFilterMenu(menuNavHeight, headerNavHeight, self.menuData);
                    
                    if (isSetMinHeight) {
                        if(Util.OS() == 'ios'){
                            self.minHeight = self.clientHeight - menuNavHeight + 'px';
                        }else{
                            self.minHeight = self.clientHeight - menuNavHeight + 8 + 'px';
                        }
                    }
                });

                
            },
            /**
             * 跳转至我的特工页面
             * @method goToMyOnlineTask
             * @public
             * @return {Null} void
             */
            goToMyOnlineTask(event) {
                event.preventDefault();
                var title = encodeURIComponent("我的特工");
                var subtitle = encodeURIComponent("全部,进行中,审核中,已结束");
                window.location.href = "doumi://myonlinetask/?title="+title+"&subtitle="+subtitle+"&subpath=online-personal.html";

                if(self.userId != 0){
                    KCloggerApi.addLog('0','特工_我的特工点击&入口点击&{"点击在线任务入口":"用户登录"}');
                }else{
                    KCloggerApi.addLog('0','特工_我的特工点击&入口点击&{"点击在线任务入口":"用户未登录"}');
                }

                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=wdtg');
            },
            goToMyApplyCash(event) {
                event.preventDefault();
                window.location.href = "doumi://onlineincome?buttonTitle=去我的钱包";

                if(self.userId != 0){
                    KCloggerApi.addLog('0','特工收入_我的钱包点击&入口点击&{"点击特工钱包入口":"用户登录"}');
                }else{
                    KCloggerApi.addLog('0','特工收入_我的钱包点击&入口点击&{"点击特工钱包入口":"用户未登录"}');
                }

                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=tgsr');
            },
            goToTaskDitail(taskId,urd_data,index) {
                var self = this;
                
                window.location.href = "doumi://onlinetaskdetail?task_id=" + taskId + "&city_id=" + self.cityid + '&urdData=' + urd_data;

                if(self.userId != 0){
                    KCloggerApi.addLog('0','在线兼职列表&详情页访问量&{"点击进入详情页":"用户登录"}');
                }else{
                    KCloggerApi.addLog('0','在线兼职列表&详情页访问量&{"点击进入详情页":"用户未登录"}');
                }

                //Array.find() 在安卓不支持
                var currentMenu = self.menuData.filter(function(value, index, arr) {
                  return value.id == self.currentIndex;
                });

                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+currentMenu[0].dmalog+'@ca_from=post_list@task_id='+taskId+'@ca_kw='+index);
            },
            getTaskListDataByFromAndIndex(from,index) {
                var self = this;
                if(from == 'getFirst'){
                    self.page = 1;
                }
                self.getTaskListDataByIndex(index);
            },
            getTaskListDataByIndex(index) {
                var self = this;
                KCcityApi.getValidCity(function(data){
                    self.cityid = data.cityid;
                    Util.ajax({
                        url:'/onlinetask/tasklist?cityid=' + self.cityid + '&page=' + self.page + '&pagesize=' + self.pageSize + '&tabid=' + index,
                        timeout:10000,
                        ctrlStatus: {
                            loading: self.page,
                            cache: true,
                            errNum: 0,
                            netNum: 0,
                        },
                        success:function(data){
                            // console.log(data)
                            if(!!data && data.code == 1000){
                                if(self.tabIndex == index){
                                    // console.log('self.page==>' + self.page + ',length==>' + data.data.data.length)

                                    //安卓
                                    if(Util.OS()!='ios'){
                                        if(self.isScrollToFisrtJob){
                                            self.isScrollToFisrtJob = false;
                                            KCol_indexPage.listDataLoadFinished();
                                        }else{
                                            if(self.isLoadData){
                                                KCol_indexPage.listDataLoadFinished();
                                            }
                                        }
                                    }else{
                                        if(self.isLoadData){
                                            KCol_indexPage.listDataLoadFinished();
                                        }
                                    }

                                    if(!!data.data && !!data.data.data && data.data.data.length > 0){
                                        data.data.data.forEach(function(item, index){
                                            item.urd_data = encodeURIComponent(`tag_status=${item.tag_status}&title=${item.title}&left_stock=${item.left_stock}&deadline=${item.deadline}&amount=${item.amount}&old_amount=${item.old_amount}`);
                                        });
                                        if(self.page == 1){
                                            KCcache.setCache('olindexData_' + index, data, 10 * 24 * 60 * 60);
                                            self.listData = data.data.data;

                                            KCloggerApi.addLog('0','特工列表可配置页面展现量&页面展现量&{"tabid":"' + index + '"}');
                                        }else{
                                            self.listData = self.listData.concat(data.data.data);
                                        }
                                        if(data.data.last_page == 1 || data.data.last_page == data.data.curent_page){
                                            self.canNextRequest = false;
                                            self.setStatus(false,false,true);
                                        }else{
                                            self.canNextRequest = true;
                                            if(Util.OS()=='android'){
                                                self.setStatus(true,false,false);
                                            }else{
                                                self.setStatus(false,true,false);
                                            }
                                            
                                            self.page++;
                                        } 
                                    }else if(!!data.data && !!data.data.data && data.data.data.length == 0){
                                        self.canNextRequest = false;
                                        if(self.page == 1){
                                            KCcache.setCache('olindexData_' + index, null, 10 * 24 * 60 * 60);
                                            self.listData = [];
                                        }
                                        self.setStatus(false,false,true);
                                    }
                                    // // console.log(self.listData);
                                    self.isShowPageLoading = false;
                                    self.isShowJobList = true;
                                    self.isShowJobListLoading = true;
                                }
                            }else{
                                if(self.noCache){
                                    self.isShowPageLoading = false;
                                }else{
                                    self.canNextRequest = true;
                                    self.setStatus(false,false,false);
                                    self.isShowJobListLoading = true;
                                }

                                if(self.page == 1){
                                    // self.listData = [];
                                    KCwidget.toast('网络异常');
                                }else{
                                    KCwidget.toast('服务器异常');
                                }
                                
                            }
                            self.isLoadData = false;
                            self.isClickedMenu = false;
                            KCol_indexPage.dataDownloadFinished();
                        },
                        error:function(xhr, status){
                            KCol_indexPage.dataDownloadFinished();
                            var toastStr = '';
                            if(status == 'timeout'){
                                toastStr = '网络请求超时';
                            }else{
                                toastStr = '服务器异常';
                            }

                            if(self.noCache){
                                self.isShowPageLoading = false;
                            }else{
                                self.canNextRequest = true;
                                self.setStatus(false,false,false);
                                self.isShowJobListLoading = true;
                            }
                            
                            KCwidget.toast(toastStr)
                        },
                        noNetwork: function(){
                            KCol_indexPage.dataDownloadFinished();
                            if(self.noCache){
                                self.isShowPageLoading = false;
                            }else{
                                self.canNextRequest = true;
                                self.setStatus(false,false,false);
                                self.isShowJobListLoading = true;
                            }
                            
                            KCwidget.toast('网络异常');
                        }
                    });
                })
            },
            setStatus(emptyEle,loadingMore,noData){
                // console.log(emptyEle + ',' + loadingMore + ',' + noData);
                var self = this;
                self.loadStatus = emptyEle;
                self.loadingStatus = loadingMore;
                self.moreStatus = noData;
            },
            clickFilterMenuFn (index, isClicked) {
                let self = this;
                // console.log(isClicked)
                self.currentIndex = index;
                self.tabIndex = self.currentIndex;

                if(isClicked == '1'){
                    self.isClickedMenu = true;
                    self.isShowJobList = false;
                    self.isShowJobListLoading = false;
                    self.isShowPageLoading = true;
                }else{
                    self.isClickedMenu = false;
                    self.isShowJobList = true;
                    self.isShowJobListLoading = true;
                    self.isShowPageLoading = false;
                }

                KCcache.getCache('olindexData_' + index, function(data){
                    if(!!data && data != 'null'){
                        self.listData = data.data.data;
                        self.isShowPageLoading = false;
                        self.isShowJobList = true;
                        self.noCache = false;
                    }else{
                        self.noCache = true;
                        KCclientInfo.getNetworkType(function(networkData){
                            if(networkData.network == 'invalid'){
                                self.isShowPageLoading = false;
                                KCol_indexPage.dataDownloadFinished();
                                KCwidget.toast('网络异常');
                                return;
                            }
                        });
                    }
                });

                self.page = 1;
                // self.canNextRequest = true;
                self.setStatus(false,false,false);
                self.getTaskListDataByFromAndIndex('getFirst',index);

                KCloggerApi.addLog('0','特工列表可配置类别_点击&配置类别点击&{"tabid":"' + index + '"}');
            }
        },
        created(){
            var self = this;


            KCol_indexPage.canPullWebView(true);
            window.loadData = function(){
                self.isLoadData = true;
                self.canNextRequest = false;
                self.isShowJobListLoading = false;
                self.getUserBaseInfo();
            };

            KCcache.getCache('opr_confData', function(data){
                console.log(data);
                if(data){
                    self.advData = data;
                }
            });

            KCcache.getCache('olindexData_' + self.currentIndex, function(data){
                if(!!data && data != 'null'){
                    self.listData = data.data.data;
                    // KCol_indexPage.readOlStartupState(function(data){
                    //     if(data.state != 1){
                            // KCol_indexPage.refreshPage();
                    //     }
                    // });  
                }
                // else{
                //     KCol_indexPage.refreshPage();
                // }
                KCol_indexPage.refreshPage();
            });

            KCucApi.getUserInfo(function(data){
                self.userId = data.userId;
            });

            window.clickFilterMenu = function(index,isClicked){
                self.clickFilterMenuFn(index, isClicked);
            };

            KCol_indexPage.registerHitPageBottomListener(function(y){
                if(self.isClickedMenu){
                    self.isClickedMenu = false;
                }else{
                    KCclientInfo.getNetworkType(function(networkData){
                        if(networkData.network != 'invalid'){
                            if(self.canNextRequest){
                                self.canNextRequest = false;
                                self.setStatus(false,true,false);
                                self.isShowJobListLoading = true;
                                // 加载下一页数据
                                self.getTaskListDataByFromAndIndex('getNext',self.currentIndex);
                            }else{
                                if(self.isLoadData){
                                    self.isLoadData = false;
                                    if(Util.OS() != 'ios'){
                                        self.isScrollToFisrtJob = true;
                                    }else{
                                        //ios
                                        KCol_indexPage.listDataLoadFinished();
                                    }
                                }else{
                                    self.isScrollToFisrtJob = false;
                                }
                            }
                        }else{
                            self.isShowPageLoading = false;
                            self.canNextRequest = true;
                            KCwidget.toast('网络异常');
                        }
                    });
                }
            }, 35);

            if((document.body.scrollHeight > self.clientHeight) && Util.OS()!='ios'){
                self.loadStatus = true;
            }
        }
        
    }
</script>
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/online_index.css"></style>