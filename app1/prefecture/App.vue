<template>
    <!-- page start -->
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content index" v-cloak>
            <div class="mod-banner" v-if="!!headImgUrl"><a href="javascript:;"><img :src="headImgUrl" alt="" v-bind:style="{height:imgHeight}"></a></div>
            <div class="mod-filter" id="filterMenu" v-show="hideFilter != 1">
                <nav class="filter-nav bc-main">
                    <ul class="mod-list mod-flex com-border-bottom">
                        <li class="mod-list-item mod-flex-item" v-for="filterName in filterMenuArr">
                            <a href="javascript:;" class="mod-list-info">{{filterName}}</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <!-- filter end -->
            <!-- column start -->
            <div class="mod-column bc-main recommend" style="position:relative;" :style="{ minHeight: warpHeight + 'px' }">
                <!-- com-mid-loading -->
                <com-list-mid-loading top="35%" :is-show-com-list-mid="isShowComListMid"/>
                <div class="mod-column-body" v-show="isShowList">
                    <!-- com-list -->
                    <keep-alive>
                        <com-list :com-list-args="comListArgs" :com-list-query-recognition="comListQueryRecognition" @ajaxCallBack="ajaxCallBack" :com-list-next-fun="comListNextFun" @clickItemEvent="clickItemEvent" @pullUpNetWork="pullUpNetWork" @pullUpNoNetWork="pullUpNoNetWork" />
                    </keep-alive>
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
    import KCprefecturePage from 'clientApi/KCprefecturePage'
    import KCcache from 'clientApi/KCcache'
    import KCwidget from 'clientApi/KCwidget'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCcityApi from 'clientApi/KCcityApi' 
    import KCclientInfo from 'clientApi/KCclientInfo'
    
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import comList from 'components/com-list/com-list'
    import comListMidLoading from 'components/com-list-mid-loading/com-list-mid-loading'
    import * as comlist_mt from 'components/com-list/com-list-mutation-types';

    /**
     *  组件实例对象
     */
    export default {
        components: {
            comList,
            comListMidLoading
        },
        data: function() {
            return {
                filterMenuArr: [
                    "区域",
                    "职位类型",
                    "职位排序",
                    "筛选"
                ],
                from:'',
                isFilterMenuRefresh: false,
                loadStatus:false,
                param: '',
                domain: 'bj',
                headImgUrl: '',
                clientHeight: document.documentElement.clientHeight,
                imgHeight: Math.floor(document.documentElement.clientWidth / 1.975) + 'px',//'160px'//
                hideFilter: 0,//默认显示 （ 0或空：显示，1:不显示）
                filterOptionsStr: '',
                title: '',
                // 列表外层高度
                warpHeight: document.documentElement.clientHeight,
                // 是否显示列表      
                isShowList: true,
                // 不同专区
                dmalog: '',
                // 请求加载数据状态
                comListQueryRecognition: '',
                // com list 参数
                comListArgs: {
                    dataList: [],
                    fromStr: 'prefecture',
                    ajaxParam: {
                        url: '',
                        apiPath: '/api/v3/client'
                    },
                    isShowBomLoading: false,
                    isToast: true,
                    tip: {
                        tipPos: '',
                        tipData: {},
                        userId: '',
                    }
                },
                // load native返回参数
                needparam: '',
                // 是否显示中部load
                isShowComListMid: false
            }
        },
        computed: {

        },
        methods: {
            //统计数据拼装
            tjFn(data, filterOptionsStr){
                var self=this;
                var citydomain=data.citydomain;
                var job_type=data.job_type || 0;
                var order=data.order || 0;
                var more=data.more;
                var arr=[0,0,0,0];
                if(/y/.test(more)){
                    arr[0]=1;
                }
                if(/c/.test(more)){
                    arr[1]=1;
                }
                if(/j/.test(more)){
                    arr[2]=1;
                }
                if(/w/.test(more)){
                    arr[3]=1;
                }
                more=arr.join('_');
                // console.log(more);
                // /jianzhi/[区域]/[职位类型]/[排序类型]/[筛选项]/list/
                var tj_Str='/jianzhi/'+citydomain+'/'+job_type+'/'+order+'/'+more+'/list/&pn='+self.page + '&' + filterOptionsStr;
                // console.log(tj_Str);
                KCloggerApi.addLog('1',tj_Str)
            },
            /**
             * [addUrdAndLog 添加urd并埋点]
             * @param {[type]} dlist [数据列表]
             */
            addUrdAndLog(dinfo) {
                //v3.1曝光埋点拼接参数变量
                let self = this;
                var showStr = '';
                //构建职位详情跳转参数
                for (var i = 0; i < dinfo.data.length; i++) {
                    if (i + 1 == dinfo.data.length) {
                        showStr += `{"id":${dinfo.data[i].id},"ca_kw":${(i+1)}}`;
                    } else {
                        showStr += `{"id":${dinfo.data[i].id},"ca_kw":${(i+1)}},`;
                    }
                    // KCloggerApi.addLog('2','@atype=show@ca_name=doumi@ca_source=app@from='+ self.from +'@ca_from=post_show@post_id='+ dinfo.data[i].id + '@pn=' + self.page +'@ca_kw='+ (i+1) +'@' + self.filterOptionsStr);
                    dinfo.data[i].urd_data = encodeURIComponent("title=" + dinfo.data[i].title + "&hire_number=" + dinfo.data[i].hire_number +
                        "&payment_type_str=" + dinfo.data[i].payment_type_str + "&job_type_str=" + dinfo.data[i].job_type_str +
                        "&salary=" + dinfo.data[i].salary + "&salary_type_str=" + dinfo.data[i].salary_type_str +
                        "&is_wages_guarantee=" + dinfo.data[i].is_wages_guarantee + "&has_subsidy=" + dinfo.data[i].has_subsidy + "&ad_types=" + dinfo.data[i].ad_types);
                }
                KCloggerApi.addLog('2', `@atype=show@ca_name=doumi@ca_source=app@from=yyw_${self.dmalog}$@ca_from=post_show@show_post_id=${showStr}`);
            },
            /**
             * [getOptions 获取服务端参数]
             * @param  {Function} callback [description]
             * @return {[type]}            [description]
             */
            getOptions(callback) {
                KCprefecturePage.getOptions(function(data) {
                    if (Util.isFunction(callback)) callback(data);
                });
            },
            /**
             * [loadListDataBefore 发请求之前处理]
             * @return {[type]} [description]
             */
            loadListDataBefore(pre) {
                let self = this;
                //首次进度无缓存，后续拉取到数据后，此时还要判断是否已经渲染出了数据
                if (!self.comListArgs.ajaxParam.hasCache) {
                    if (self.comListArgs.dataList.length != 0) {
                        self.comListArgs.ajaxParam.hasCache = true;
                    }
                }
                self.getOptions(function(data) {
                    if (Util.isObject(data)) {
                        if (Util.isObject(data.pv_param)) {
                            self.filterOptionsStr = `item=${data.pv_param.district};${data.pv_param.job_type};${data.pv_param.order};${data.pv_param.filter}`;
                            delete data.pv_param;
                        }
                        // 默认北京
                        if (!data || Util.isEmptyObject(data)) {
                            data = {};
                        }
                        // 统计
                        self.tjFn(data, self.filterOptionsStr);
                    }
                    self.comListArgs.ajaxParam.url = `/prefecture/list?${Util.json2url(data)}`;
                    self.comListQueryRecognition = `${pre}-${Date.now()}`;
                });
            },
            /**
             * [comListNextFun 下一页]
             * @return {[type]} [description]
             */
            comListNextFun() {
                let self = this;
                self.loadListDataBefore('nextList');
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
                this.isShowList = true;
                if (+page === 1) {
                    KCprefecturePage.listDataLoadFinished();
                    KCprefecturePage.dataDownloadFinished();
                }
                if (type === 'success') {
                    let dinfo = data.data;
                    // init data
                    if (+page === 1) {
                        KCcache.setCache(`prefectureData_${this.dmalog}`, data, 10 * 24 * 60 * 60);
                    }
                    // 显示bom loading
                    this.comListArgs.isShowBomLoading = true;
                    // 添加urd并埋点
                    this.addUrdAndLog(dinfo);
                    // 执行回调处理
                    if (typeof this[`${pre}CallBack`] === 'function') this[`${pre}CallBack`](data, page);
                    // 渲染
                    this.comListArgs.dataList = dinfo.data;
                }
                // 是否过滤菜单刷新
                this.isFilterMenuRefresh = true;
            },
            /**
             * [filterListCallBack 过滤回调]
             * @param  {[type]} data  [数据]
             * @param  {[type]} page  [当前页]
             * @return {[type]}       [description]
             */
            filterListCallBack(data, page) {
                this.isShowList = true;
            },
            /**
             * [clickItem 点击item]
             * @param  {[type]} index [索引]
             * @param  {[type]} item  [数据]
             * @return {[type]}       [description]
             */
            clickItemEvent(index, item) {
                KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@from=' + this.from + '@ca_from=post_list@post_id=' + item.id + '@ca_kw=' + index + '@' + self.filterOptionsStr);
                window.location = `doumi://jobdetail?job_id=${item.id}&urdData=${item.urd_data}&from=${this.from}&readed_from=${this.comListArgs.fromStr}`;
            },
            pullUpNetWork() {
                if(this.isFilterMenuRefresh){
                    this.isFilterMenuRefresh = false;
                }
            },
            pullUpNoNetWork() {
                this.isFilterMenuRefresh = true;
            }
        },
        beforeCreate() {
            let self = this;
            // native 下拉调用
            window.loadData = function(type) {
                // 禁止上拉
                self.$store.commit(comlist_mt.SET_CANNEXTREQUEST, false);
                // 是否过滤菜单刷新
                self.isFilterMenuRefresh = false;
                // 类型
                if(type == 2) {
                    // console.log(2);
                    self.isFilterMenuRefresh = true;
                    // 显示中间加载态
                    self.isShowComListMid = true;
                    // 列表隐藏
                    self.isShowList = false;
                    // 加载过滤列表数据
                    self.loadListDataBefore('filterList');
                } else {
                    self.isFilterMenuRefresh = false;
                    // 加载列表数据
                    self.loadListDataBefore('loadPage');
                }
            }
        },
        created() {
            var self = this;
            
            //取头图地址
            var urd_data = Util.getQueryString('urdData');
            // query title
            self.title = decodeURIComponent(Util.getQueryString('title'));
            // query dmalog
            self.dmalog = decodeURIComponent(Util.getQueryString('dmalog'));
            // console.log(self.dmalog,555555);
            // set titlex
            document.getElementById('title').innerHTML = self.title;
            // query hideFilter
            self.hideFilter = Util.getQueryString('hideFilter');
            // 头图设置
            if (urd_data != null) {
                if (Util.OS() == 'ios') {
                    urd_data = decodeURIComponent(urd_data);
                } else {
                    urd_data = decodeURIComponent(decodeURIComponent(urd_data));
                }
                var urd_data_arr = urd_data.split('&');
                var param_item = [];
                urd_data_arr.forEach(function(item, index) {
                    param_item.push(item.split('='));
                });
                self.headImgUrl = param_item[0][1];
                // if(!!param_item[1][1]){
                //     if(/dmlg/.test(param_item[1][1])){
                //         KCloggerApi.addLog('1','/jianzhi/dmlg/qydb/index');
                //     }else{
                //         KCloggerApi.addLog('1','/jianzhi/'+param_item[1][1]+'/index');
                //     } 
                //     KCloggerApi.addLog('0','专区页面展现量&专区页面展现量&{"专区":"'+param_item[1][1]+'"}');
                // }
                if (!!param_item[1]) {
                    self.from = 'yyw_' + param_item[1][1];
                }
            }
            // native 下拉调用
            KCprefecturePage.canPullWebView(true);
            // 获取数据cache
            KCcache.getCache('prefectureData_' + self.dmalog, function(data) {
                if (Util.isObject(data)) {
                    if (!!data) {
                        self.comListArgs.ajaxParam.hasCache = true;
                        let dinfo = data.data;
                        Util.setListClicked(dinfo.data, self.comListArgs.fromStr, function(dlist) {
                            self.comListArgs.dataList = dlist;
                        });
                        self.isShowList = true;
                    } else {
                        self.comListArgs.ajaxParam.hasCache = false;
                    }
                }
                KCprefecturePage.refreshPage();
            });
            // 设置列表外层调试及过滤菜单位置
            self.$nextTick(function () {
                var filterMenuHeight = $('#filterMenu').height();
                self.warpHeight = self.clientHeight - filterMenuHeight + 'px';

                var filterMenuOffset = $('#filterMenu').offset().top;
                if(self.hideFilter != 1) {
                    KCprefecturePage.setFilterMenuOffset(parseInt(filterMenuOffset));
                }
            });
            // 获取domain
            KCcityApi.getValidCity(function(info){
                if(info){
                    if(info.citydomain != '0'){
                        self.domain = info.citydomain;
                    }
                }
            });

            if((document.body.scrollHeight > self.clientHeight) && Util.OS()!='ios'){
                self.loadStatus = true;
            }
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style>
    .readed{
        color:#808080;
    }
</style>
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/list.css"></style>