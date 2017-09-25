<template>
    <section class="dm-app-wrap">
        <!-- com-mid-loading -->
        <com-list-mid-loading top="35%" :is-show-com-list-mid="isShowComListMid"/>
        <div class="mod-column bc-main">
            <div class="mod-column-body" v-show="isShowList">
                <!-- com-list -->
                <keep-alive>
                    <com-list :com-list-args="comListArgs" :com-list-query-recognition="comListQueryRecognition" @ajaxCallBack="ajaxCallBack" :com-list-next-fun="comListNextFun" :is-youxuan="isYouxuan" @clickItemEvent="logEvent"/>
                </keep-alive>
            </div>
        </div>
    </section>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KClistPage from 'clientApi/KClistPage'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCwidget from 'clientApi/KCwidget'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCucApi from 'clientApi/KCucApi'
    /**
     *  引入组件 以及 组件接口(Action)
     */
    import comList from 'components/com-list/com-list'
    import comListMidLoading from 'components/com-list-mid-loading/com-list-mid-loading'
    import * as comlist_mt from 'components/com-list/com-list-mutation-types';
    /**
     *  组件实例对象
     */
    export default {
        components: {
            comListMidLoading,
            comList,
        },
        data: function() {
            return {
                isShowList: true,
                // 请求加载数据状态
                comListQueryRecognition: '',
                // com list 参数
                comListArgs: {
                    fromStr: 'recommend',
                    dataList: [],
                    ajaxParam: {
                        url: '',
                        hasCache: false
                    },
                    isShowBomLoading: false,
                    //uniqueFiled: 'id',
                    isToast: true,
                    // tip: {
                    //     tipPos: '',
                    //     tipData: {},
                    //     userId: '',
                    // }
                },
                // load native返回参数
                needparam: '',
                // 是否显示中部load
                isShowComListMid: false,
                page: 1, //分页页数
                from: Util.getQueryString('from') || '',//获取url from参数对应值
                filterOptionsStrs: '', //埋点筛选参数
                isYouxuan: false //此页面不加优选标签
            }
        },
        methods: {
            /**
             * [comListNextFun 下一页]
             * @return {[type]} [description]
             */
            comListNextFun() {
                let self = this;
                self.loadListDataBefore('nextList');
            },
            /**
             * [getOptions 获取服务端参数]
             * @param  {Function} callback [description]
             * @return {[type]}            [description]
             */
            getOptions(callback) {
                KClistPage.getOptions(function(data) {
                    if (Util.isFunction(callback)) callback(data);
                });
            },
           /**
             * [loadListDataBefore 发请求之前处理]
             * @return {[type]} [description]
             */
            loadListDataBefore(pre) {
                let self = this;
                if (!self.comListArgs.ajaxParam.hasCache) {
                    if (self.comListArgs.dataList.length != 0) {
                        self.comListArgs.ajaxParam.hasCache = true;
                    }
                }
                self.getOptions(function(data) {
                    if (Util.isObject(data)) {
                        self.optData = data;
                        if(!!data.pv_param){
                            self.filterOptionsStrs = 'item=' + data.pv_param.district + ';' + data.pv_param.job_type + ';' + data.pv_param.order + ';' +data.pv_param.filter;
                            delete data.pv_param;
                        }
                        self.comListArgs.ajaxParam.url = `/listmore?${Util.json2url(data)}&platform=${Util.OS()}&token=''`;
                    }
                    self.comListQueryRecognition = `${pre}-${Date.now()}`;
                });
            },
            /**
             * [ajaxCallBack ajax回调]
             * @param  {[type]} type [类型 success error noNetwork]
             * @param  {[type]} data [数据]
             * @param  {[type]} page [当前页]
             * @return {[type]}      [description]
             */
            ajaxCallBack(type, data, page) {
                let pre = this.comListQueryRecognition.split('-')[0];
                // 隐藏mid loading
                this.isShowComListMid = false;
                if (+page === 1) {
                    KClistPage.listDataLoadFinished();
                    KClistPage.dataDownloadFinished();
                }
                if (type === 'success') {
                    let dinfo = data.data;
                    if (+page === 1) {
                        KCcache.setCache('listData', data, 10 * 24 * 60 * 60);
                        if(data.data.data.length === 0){ //过滤筛选无数据 显示native 无数据页面
                            this.isShowList = false;
                            KClistPage.loadPageStatus('noData');
                        } else {
                            this.isShowList = true;
                        }
                    }
                    // 显示bom loading
                    this.comListArgs.isShowBomLoading = true;
                    // 执行回调处理
                    if (typeof this[`${pre}CallBack`] === 'function') this[`${pre}CallBack`](data, page);
                    // 渲染
                    this.comListArgs.dataList = dinfo.data;
                }
            },
            /**
             * [loadCallBack 页面加载回调]
             * @param  {[type]} data  [数据]
             * @param  {[type]} page  [当前页]
             * @return {[type]}       [description]
             */
            loadPageCallBack(data, page) {
                let self = this;
                self.page = page;
                self.filterOptionsStr(self.optData, data, page, self.needparam);
            },
            /**
             * [filterListCallBack 过滤回调]
             * @param  {[type]} data  [数据]
             * @param  {[type]} page  [当前页]
             * @return {[type]}       [description]
             */
            filterListCallBack(data, page) {
                let self = this;
                self.page = page;
                self.filterOptionsStr(self.optData, data, page);
            },
            /**
             * [loadCallBack 过滤回调]
             * @param  {[type]} data  [数据]
             * @param  {[type]} page  [当前页]
             * @return {[type]}       [description]
             */
            nextListCallBack(data, page) {
                let self = this;
                self.page = page;
                self.filterOptionsStr(self.optData, data, page);
            },
            /**
             * 点击职位列表埋点
             * @param  {[type]} id    [职位id]
             * @param  {[type]} index [下标]
             * @param  {[type]} item  [当前职位]
             * @return {[type]}       [description]
             */
            logEvent (index, item){
                let self = this;
                let id = item.id;

                KCucApi.getUserInfo(function(data){
                    if(data.userId != 0){
                        KCloggerApi.addLog('0','兼职列表页_访问详情页&登录状态&{"状态":"已登录"}');
                    }else{
                        KCloggerApi.addLog('0','兼职列表页_访问详情页&登录状态&{"状态":"未登录"}');
                    }
                });

                KCloggerApi.addLog('0','兼职列表页_访问详情页&来源&{"来源":"列表页"}');
                if(self.page <= 2){
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+ self.from +'@ca_from=post_list@post_id='+id+'@ca_kw='+index + '@' + self.filterOptionsStrs);
                    
                }else{
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from='+ self.from +'@ca_from=post_list@post_id='+id + '@' + self.filterOptionsStrs);
                }
               window.location = `doumi://jobdetail?job_id=${item.id}&urdData=${item.urd_data}&from=postlist_sy&readed_from=${this.comListArgs.fromStr}`;
            },
            //过滤埋点
            filterOptionsStr(optData, data, page, needparam) {
                let foStr = this.filterOptionsStrs;
                let dinfo = data.data;
                let showStr = '';
                //构建职位详情跳转参数
                for (var i = 0; i < dinfo.data.length; i++) {
                    //曝光埋点
                    dinfo.data[i].tjStr = foStr;
                    if (i + 1 == dinfo.data.length) {
                        showStr += `{"id":${dinfo.data[i].id},"ca_kw":${(i+1)}}`;
                    } else {
                        showStr += `{"id":${dinfo.data[i].id},"ca_kw":${(i+1)}},`;
                    }

                    dinfo.data[i].urd_data = encodeURIComponent("title=" + dinfo.data[i].title + "&hire_number=" + dinfo.data[i].hire_number +
                        "&payment_type_str=" + dinfo.data[i].payment_type_str + "&job_type_str=" + dinfo.data[i].job_type_str +
                        "&salary=" + dinfo.data[i].salary + "&salary_type_str=" + dinfo.data[i].salary_type_str +
                        "&is_wages_guarantee=" + dinfo.data[i].is_wages_guarantee + "&has_subsidy=" + dinfo.data[i].has_subsidy +"&ad_types=" + dinfo.data[i].ad_types);
                }
                KCloggerApi.addLog('2', '@atype=show@ca_name=doumi@ca_source=app@ca_from=post_show@show_post_id=' + showStr + '@' + foStr);
                // 统计
                this.tjFn(optData, foStr, page);
            },
            //统计数据拼装
            tjFn(optData, foStr, page) {
                let data = optData;
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
                // /jianzhi/[区域]/[职位类型]/[排序类型]/[筛选项]/list/
                var tj_Str = '/jianzhi/' + citydomain + '/' + job_type + '/' + order + '/' + more + '/list/&pn=' + page + '&' + foStr;
                KCloggerApi.addLog('1', tj_Str);
            }
        },
        beforeCreate() {
            let self = this;
            // native 过滤调用
            window.loadData = function(needparam) {
                KClistPage.loadPageStatus('loadSuccess');
                if(needparam == 1){ //过滤时调用
                    // 隐藏底部加载态
                    self.comListArgs.isShowBomLoading = false;
                    // 禁止上拉
                    self.$store.commit(comlist_mt.SET_CANNEXTREQUEST, false);
                    // 加载过滤列表数据
                    self.loadListDataBefore('filterList');
                } else if(needparam == 0){ //下拉刷新时调用
                    self.needparam = needparam;
                    // 禁止上拉
                    self.$store.commit(comlist_mt.SET_CANNEXTREQUEST, false);
                    // 加载列表数据
                    self.loadListDataBefore('loadPage');
                }
            };
        },
        created() {
            var self = this;
            // 显示中间加载态 第一次进入页面加载时调用
            KClistPage.getOptions(function(data) {
                KCcache.getCache('listData',function(data) {
                    if(!!data && !!data.data && !!data.data.data){ //有缓存
                        // 有缓存先读取缓存，并刷新数据
                        self.comListArgs.dataList = data.data.data;
                        self.comListArgs.ajaxParam.hasCache = true;
                        // 禁止上拉
                        // self.$store.commit(comlist_mt.SET_CANNEXTREQUEST, false);
                        // 加载列表数据
                        // KClistPage.refreshPage();
                        self.loadListDataBefore('loadPage');
                    }else{ //没有缓存
                        // 显示中间加载态
                        self.isShowComListMid = true;
                        self.comListArgs.ajaxParam.hasCache = false;
                        // 禁止上拉
                        self.$store.commit(comlist_mt.SET_CANNEXTREQUEST, false);
                        // 加载列表数据
                        self.loadListDataBefore('loadPage');
                    }
                });
            });
        }
    }  
    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/list.css"></style>

<style type="text/css">
    .readed div h3 span{
        color:#808080;
    }
    .read{
        color:#808080;
    }
    [v-cloak] {
      display: none;
    }
</style>



