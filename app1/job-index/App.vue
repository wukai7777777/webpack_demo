<template>
    <!-- page start -->
    <div class="mod-page">
        <section class="mod-content list-location">
            <!-- column start -->
            <div class="recommend mod-column bc-main" style="position:relative;" :style="{ minHeight: warpHeight + 'px' }">
            <!-- <div class="mod-column bc-main" style="height:3000px;"> -->
                <!-- com-mid-loading -->
                <com-mid-loading top="45%" />
                <div class="mod-column-body" v-show="isShowList">
                    <!-- <div>{{curIndex}}</div> -->
                    <!-- com-list -->
                    <!-- <keep-alive> -->
                        <com-list :data-list="dataList" :from-str="fromStr" />
                    <!-- </keep-alive> -->
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
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCjobIndexPage from 'clientApi/KcjobIndexPage'
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import comList from 'components/com-list/com-list'
    import comBomLoading from 'components/com-bom-loading/com-bom-loading'
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'
    import * as commidloading_mt from 'components/com-mid-loading/com-mid-loading-mutation-types'
    import * as combomloading_mt from "components/com-bom-loading/com-bom-loading-mutation-types"

    /**
     *  组件实例对象
     */
    export default {
        components: {
            comList,
            comBomLoading,
            comMidLoading
        },
        data: function() {
            return {
                warpHeight: document.documentElement.clientHeight,
                isShowList: true,
                curIndex: 0,
                page: 1,
                pageSize: 20, 
                optData: {},
                dataList: [],
                fromStr: 'jobindex'
            }
        },
        methods: {
            /**
             * [loadFunc bom loading 回调]
             * @return {[type]} [description]
             */
            loadFunc() {
                let self = this;
                // self.page += 1;
                self.loadListDataFun({
                    reset: false,
                    callback: function(data, dlist, dinfo, order) {
                        self.dataList = dlist;
                        filterOptionsStr(self.optData, data, dlist, self.page);
                        if (dlist.length) self.page += 1;
                        // self.page += 1;
                    }                 
                });
            },
            /**
             * [setWarpHeight 设置外层高度]
             */
            setWarpHeight(load) {
                let height = 0;
                let self = this;
                if (load) height = 54;
                self.$nextTick(function () {
                    self.warpHeight = +document.documentElement.clientHeight + height;
                });
            },
            /**
             * [getListCache 获取缓存]
             * @return {[type]} [description]
             */
            getListCache(callback) {
                let self = this;
                KCcache.getCache(`jobIndexListCache${self.curIndex}`, function(data) {
                    if(Util.isObject(data) && Util.isArray(data.data) && data.data.length) {
                        for(let v of data.data) {
                            if(v.show) delete v.show;
                        }
                        self.dataList = data.data;
                        if (Util.isFunction(callback)) callback();
                        self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                    } else {
                        // 占位缓存
                        KCcache.getCache('jobIndexListInitCache', function(data) {
                            self.dataList = data.data;
                            if (Util.isFunction(callback)) callback();
                            self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                        });
                    }
                });
            },
            /**
             * [getOptions 获取服务端参数]
             * @param  {Function} callback [description]
             * @return {[type]}            [description]
             */
            getOptions(callback) {
                KCjobIndexPage.getOptions(function(data) {
                    if(Util.isFunction(callback)) callback(data);
                });
            },
            /**
             * [loadListDataFun 获取列表数据]
             * @return {[type]} [description]
             */
            loadListDataFun(args = {}) {
                let self = this;
                let pobj = Object.assign({
                    type: 'act_comlist_loadListData',
                    page: this.page,
                    pageSize: this.pageSize,
                    resetPageFun: function(reset) {
                        if (reset) {
                            self.page = 1;
                            KCjobIndexPage.listDataLoadFinished();
                            KCjobIndexPage.dataDownloadFinished();   
                        }
                    }
                }, args);
                self.getOptions(function(data) {
                    if (Util.isObject(data)) {
                        self.optData = data;
                        pobj.optData = data;
                        pobj.url = `/listmore?${Util.json2url(data.param)}&platform=${Util.OS()}&pageSize=${self.pageSize}&page=${self.page}&token=`
                    }
                    self.$store.dispatch(pobj)
                });
            }
        },
        beforeCreate() {
            let self = this;
            // native 下拉调用
            window.loadData = function(needparam) {
                self.page = 1;
                self.loadListDataFun({
                    reset: true,
                    midLoading: false,
                    fromStr: self.fromStr,
                    callback: function(data, dlist, dinfo, order) {
                        self.dataList = dlist;
                        self.setWarpHeight(true);
                        filterOptionsStr(self.optData, data, dlist, self.page, needparam);
                        if (dlist.length) self.page += 1;
                        KCcache.setCache(`jobIndexListCache${order}`, dinfo, 10 * 24 * 60 * 60);
                    }                    
                });
            }
            // native 过滤调用
            window.loadListData = function() {
                // hide list
                self.isShowList = false;
                self.warpHeight = 0;
                self.page = 1;
                self.loadListDataFun({
                    reset: true,
                    midLoading: true,
                    fromStr: self.fromStr,
                    callback: function(data, dlist, dinfo, order) {
                        self.dataList = dlist;
                        self.isShowList = true;
                        self.setWarpHeight();
                        filterOptionsStr(self.optData, data, dlist, self.page);
                        if (dlist.length) self.page += 1;
                        KCcache.setCache(`jobIndexListCache${order}`, dinfo, 10 * 24 * 60 * 60);
                    }                   
                });
            };
            // 切换tab过滤列表
            window.filterJobList = function(index) {
                // cur index
                self.curIndex = index;
            }
        },
        created() {
            let self = this;
            // 获取opt参数
            self.getOptions(function(data) {
                // cur index
                self.curIndex = data.param.order;
                // 获取列表缓存
                self.getListCache(function() {
                    // 添加下拉刷新控件
                    KCjobIndexPage.canPullWebView(true);
                    // 刷新页面
                    KCjobIndexPage.refreshPage();
                });
            });
        }
        
    }

//统计数据拼装
function tjFn(optData, filterOptionsStr, page) {
    let data = optData.param;
    var citydomain = data.citydomain;
    var job_type = data.job_type || 0;
    var order = data.order || 0;
    var more = data.more;
    var arr = [0, 0, 0, 0];
    if (/y/.test(more)) {
        arr[0] = 1;
    }
    if (/c/.test(more)) {
        arr[1] = 1;
    }
    if (/j/.test(more)) {
        arr[2] = 1;
    }
    if (/w/.test(more)) {
        arr[3] = 1;
    }
    more = arr.join('_');
    // console.log(more);
    // /jianzhi/[区域]/[职位类型]/[排序类型]/[筛选项]/list/
    var tj_Str = '/jianzhi/' + citydomain + '/' + job_type + '/' + order + '/' + more + '/list/&pn=' + page + '&' + filterOptionsStr;
    // console.log(tj_Str);
    KCloggerApi.addLog('1', tj_Str)
};

function filterOptionsStr(optData, data, dlist, page, needparam) {
    let foStr = '';
    if (dlist.length) {
        // &item=[城市_区域;职位类型;排序类型;筛选]
        // "pv_param":{"district":"北京","order":"推荐排序","filter":"不限;女生可做;非学生可做;全部","job_type":"全部兼职"}
        // pv,ev埋点，带筛选参数
        //首次启动的时候optData是null
        if (!!optData.pv_param) {
            if (!!needparam) {
                if (!!data.default) {
                    if(data.default.sex == 0 && data.default.identity == 0 ){
                        foStr = 'item=' + optData.pv_param.district + ';' + optData.pv_param.job_type + ';' + optData.pv_param.order + ';' +optData.pv_param.filter; 
                    }else{
                        let sexStr = '';
                        let identityStr = '';
                        if (data.default.sex == 0) {
                            sexStr = '';
                        }else if (data.default.sex == 1) {
                            sexStr = '男生可做;';
                        }else if (data.default.sex == 2) {
                            sexStr = '女生可做;';
                        }

                        if(data.default.identity == 0){
                            identityStr = '';
                        }else if (data.default.identity == 1) {
                            identityStr = '学生可做';
                        }else if (data.default.identity == 3) {
                            identityStr = '非学生可做';
                        }
                        foStr = 'item=' + optData.pv_param.district + ';' + optData.pv_param.job_type + ';' + optData.pv_param.order+ ';' +sexStr +  identityStr;
                    }
                } else {
                    foStr = 'item=' + optData.pv_param.district + ';' + optData.pv_param.job_type + ';' + optData.pv_param.order + ';' +optData.pv_param.filter; 
                }
            }else{
                foStr = 'item=' + optData.pv_param.district + ';' + optData.pv_param.job_type + ';' + optData.pv_param.order + ';' +optData.pv_param.filter; 
            }
            
        }
        //构建职位详情跳转参数
        for(var i = 0;i < dlist.length;i++){
            //曝光埋点
            dlist[i].tjStr = foStr;
            KCloggerApi.addLog('2','@atype=show@ca_name=doumi@ca_source=app@ca_from=post_show@post_id=' + dlist[i].id + '@pn=' + page + '@ca_kw=' + (i+1) + '@' + foStr);

            dlist[i].urd_data = encodeURIComponent("title=" + dlist[i].title + "&hire_number=" + dlist[i].hire_number + 
                "&payment_type_str=" + dlist[i].payment_type_str + "&job_type_str=" + dlist[i].job_type_str + 
                    "&salary=" + dlist[i].salary + "&salary_type_str=" + dlist[i].salary_type_str + 
                        "&is_deposit=" + dlist[i].is_deposit + "&has_subsidy=" + dlist[i].has_subsidy + "&cooperation_type=" + dlist[i].cooperation_type + "&ad_types=" + dlist[i].ad_types);
        }
        // 统计
        tjFn(optData, foStr, page);
    }
}

    
</script>

<!-- CSS 样式 -->
<style src="static/css/discovery_list.css"></style>



