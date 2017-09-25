<template>
    
    <!-- 组件的模板 -->
    <section class="mod-content index">
        <!-- banner start -->
        <div class="mod-banner com-border-bottom">
            <a href="javascript:;"><img :src="imageUrl" :style="{height:imgHeight}" alt=""></a>
        </div>
        <!-- banner end -->
        <!-- column start -->
        <div class="mod-column bc-main list" v-show="!isShowPageLoading">
            <div class="mod-column-body">
                <ul class="mod-list">
                    <li class="mod-list-item com-border-bottom" v-for="(task,index) in listData" v-bind:key="task.index" v-on:click="goToTaskDitail(task.id, task.urd_data)">
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
            </div>
        </div>
         <com-bom-loading :load-fn="getData"/>
         <com-mid-loading top="45%" :com-mid-is-show="isShowComMid" />
        <!-- column end -->
    </section>   
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KClocationApi from 'clientApi/KClocationApi'
    import KCwidget from 'clientApi/KCwidget'
    import KCcityApi from 'clientApi/KCcityApi'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCprefecturePage from 'clientApi/KCprefecturePage'
    import KCucApi from 'clientApi/KCucApi'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'


    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */
    import comBomLoading from 'components/com-bom-loading/com-bom-loading'
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'
    import * as combomloading_mt from "components/com-bom-loading/com-bom-loading-mutation-types"

    let page = 1;
    const pageSize = 20;
    // let canNextRequest = true;
    let cityid = '';
 
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
                listData: [],
                isShowPageLoading: false,
                imgHeight: Math.floor(document.documentElement.clientWidth / 1.975) + 'px',//'160px'//
                from: Util.getQueryString('from'),
                imageUrl: '',
                isShowComMid: false,
                tabid: '',
                hasCache: false
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
                KCprefecturePage.canPullWebView(true);
                self.imageUrl = decodeURIComponent(Util.getQueryString('imageUrl'));
                self.tabid = decodeURIComponent(Util.getQueryString('tabid'));
                // 下拉刷新
                window.loadData = function() {
                    page = 1;
                    self.getData(true); 
                }

                KCcache.getCache('onlinePrefectureData', function(data){
                    if (!!data && data != 'null') {
                        self.hasCache = true;
                        self.listData = data.data.data;
                    } else {
                        self.hasCache = false;
                    }
                    KCprefecturePage.refreshPage();
                });
                //埋点
                // KCloggerApi.addLog('0','特工运营位_页面展现量&来源&{"位置":'+self.from+'"}');
                KCloggerApi.addLog('0','特工运营位_页面展现量&运营位落地页面展现量&');
            },
            /**
             *  获取任务列表
             * @return {[type]} [description]
             */
            getData(pullDownFresh) {
                var self = this;
                if(self.listData.length == 0 && !pullDownFresh) {
                    self.isShowPageLoading = true;
                    self.isShowComMid = true;
                    self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                }
                KCcityApi.getValidCity(function(data) {
                    cityid = data.cityid;
                    Util.ajax({
                        url:'/onlinetask/tasklist?cityid=' + cityid + '&page=' + page + '&pagesize=' + pageSize + '&tabid=' + self.tabid,
                        timeout:10000,
                        ctrlStatus: {
                            loading: page,
                            cache: self.hasCache,
                            errNum: 0,
                            netNum: 0,
                        },
                        success:function(data) {
                             self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            // self.showLoading = true;
                            self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                            self.isShowPageLoading = false;
                            self.isShowComMid = false;
                            KCprefecturePage.dataDownloadFinished();
                            if(!!data && data.code == 1000) {
                                try{
                                    let list = data.data.data;
                                    if(list && list.length > 0) {
                                        
                                        //下拉刷新数据加载完成 告诉客户端 滚动到第一条位置 
                                        if(pullDownFresh){
                                            KCprefecturePage.listDataLoadFinished();
                                        }

                                        //构建特工详情页所需urdData
                                        data.data.data.forEach(function(item, index){
                                            item.urd_data = encodeURIComponent(`tag_status=${item.tag_status}&title=${item.title}&left_stock=${item.left_stock}&deadline=${item.deadline}&amount=${item.amount}&old_amount=${item.old_amount}`);
                                        });
                                        
                                        if(page == 1){
                                            KCcache.setCache('onlinePrefectureData', data, 10 * 24 * 60 * 60);
                                            self.listData = list;
                                        }else {
                                            self.listData = self.listData.concat(list);
                                        }

                                        if(data.data.last_page == 1 || data.data.last_page == data.data.curent_page) {
                                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                            self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                        } else {
                                            self.$store.commit(combomloading_mt.SET_NOMORE, false);
                                            self.$store.commit(combomloading_mt.SET_LOADING, false);
                                            page++;
                                        }
                                        
                                    }else if(list && list.length == 0) {
                                         self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                        if(page == 1) {
                                            self.listData = [];
                                            KCcache.setCache('onlinePrefectureData', null, 10 * 24 * 60 * 60);
                                            // KCprefecturePage.loadPageStatus('noData');
                                        }
                                        self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                    }else{
                                        if(page == 1) {
                                            KCprefecturePage.loadPageStatus('loadFailed');
                                        }else {
                                            KCwidget.toast('服务器异常');
                                        }
                                    }
                                }catch(e) {
                                    if(page == 1) {
                                        KCprefecturePage.loadPageStatus('loadFailed');
                                    }else {
                                        KCwidget.toast('服务器异常');
                                    }
                                }
                            }else {
                                if(page == 1) {
                                    KCprefecturePage.loadPageStatus('loadFailed');
                                }else {
                                    KCwidget.toast('服务器异常');
                                }
                            }
                        },
                        error:function(xhr, status){
                            KCprefecturePage.dataDownloadFinished();
                            self.isShowPageLoading = false;
                            self.isShowComMid = false;
                            self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                             self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        },
                        noNetwork: function(){
                            KCprefecturePage.dataDownloadFinished();
                            self.isShowPageLoading = false;
                            self.isShowComMid = false;
                            self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                             self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        }
                    });
                });
            },
            /**
             * 跳转任务详情页
             * @param  {[type]} taskId [description]
             * @param  {[type]} index  [description]
             * @return {[type]}        [description]
             */
            goToTaskDitail(taskId, urd_data) {
                window.location.href = "doumi://onlinetaskdetail?task_id=" + taskId + "&city_id=" + cityid + "&urdData=" + urd_data;
            }
        },
        created(){

            this.initFun();
            
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/online_index.css"></style>