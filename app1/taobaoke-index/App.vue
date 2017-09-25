<template>
    <section class="dm-app-wrap">
        <!-- com-mid-loading -->
        <com-mid-loading top="43%" :com-mid-is-show="comMidIsShow"/>
        <!-- page start -->
        <div class="mod-page" v-show="isShowPage">
            <!-- section start -->
            <section class="mod-content index">
                <!-- nav start -->
                <nav class="menu mod-nav com-border-bottom" v-if="'orders' in topInfo">
                    <ul class="mod-flex">
                        <li class="mod-flex-item active">
                            <a href="doumi://taobaokeorder" class="mod-nav-item">
                                <span class="menu-title">待结算订单</span>
                                <span class="menu-value"><b>{{topInfo.orders.num}}</b>个</span>
                            </a>
                        </li>
                        <li class="mod-flex-item">
                            <a href="doumi://taobaokeincome" class="mod-nav-item">
                                <span class="menu-title">待结算收入</span>
                                <span class="menu-value"><b>{{topInfo.orders.income}}</b>元</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <!-- nav end -->
                <!-- banner start -->
                <div class="mod-banner" v-if="'banner' in topInfo">
                    <a :href="topInfo.banner[0].link" :style="{ height: bannerHeight + 'px' }" style="padding-bottom: 16px;">
                        <img :src="topInfo.banner[0].img" alt="" style="height: 100%;">
                    </a>
                </div>
                <!-- banner end -->
                <!-- nav start -->
    <!--             <nav class="mod-nav bc-main com-border-bottom">
                    <ul class="mod-flex">
                        <li class="mod-flex-item active">
                            <a href="javascript:;" class="mod-nav-item"><img src="http://sta.doumi.com/src/image/jianzhi/mobile/c/app/v2/nav_member.png" alt="">章鱼会员</a>
                        </li>
                        <li class="mod-flex-item">
                            <a href="javascript:;" class="mod-nav-item"><img src="http://sta.doumi.com/src/image/jianzhi/mobile/c/app/v2/nav_tmall.png" alt="">积分商城</a>
                        </li>
                        <li class="mod-flex-item">
                            <a href="javascript:;" class="mod-nav-item"><img src="http://sta.doumi.com/src/image/jianzhi/mobile/c/app/v2/nav_tegong.png" alt="">斗米特工</a>
                        </li>
                    </ul>
                </nav> -->
                <!-- nav end -->
                <!-- column start -->
                <div class="mod-column com-space product">
                    <div class="mod-column-head" id="filterMenu" style="padding-left: 15px;">
                        <nav class="mod-nav mod-tab">
                            <ul class="mod-list mod-flex">
                                <li class="mod-list-item mod-flex-item" :class="curChannel == item.channel ? 'active' : ''" v-for="item of categoryArr" data-role="tabTitle" data-for="#list_all">
                                    <a href="javascript:;" class="mod-nav-item">{{item.text}}</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div class="mod-column-body" id="list_all" style="position: relative;" v-bind:style="{ minHeight: listMinHeight + 'px' }">
                        <!-- com-list-mid-loading -->
                        <com-list-mid-loading top="45%" :is-show-com-list-mid="isShowComListMid"/>
                        <!-- taobaoke-commodit-list -->
                        <taobaoke-commodit-list ref="tclist" :commodit-list="commoditList" :cur-channel="curChannel" @commoditShare="commoditShare" @ajaxCallBack="ajaxCallBack" :has-cache="hasCache"/>
                        <!-- com-bom-loading -->
                        <com-bom-loading :load-fn="loadNext"/>
                    </div>
                </div>
                <!-- column end -->
            </section>
            <!-- section end -->
        </div>
        <!-- page end -->
    </section>   
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import { KCpageInstances } from 'clientApi/KCpage'
    import KCtbkIndexPage from 'clientApi/KCtbkIndexPage'
    import KCcache from 'clientApi/KCcache'
    import KCwidget from 'clientApi/KCwidget'
    import KCsocialApi from 'clientApi/KCsocialApi'
    import KCucApi from 'clientApi/KCucApi'
    import Vue from 'vue'
    
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import comBomLoading from 'components/com-bom-loading/com-bom-loading'
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'
    import comListMidLoading from 'components/com-list-mid-loading/com-list-mid-loading'
    import taobaokeCommoditList from 'components/taobaoke-commodit-list/taobaoke-commodit-list'
    import * as combomloading_mt from "components/com-bom-loading/com-bom-loading-mutation-types"

    /**
     * 公共变量
     */
    let filterTimer = null;
    let shareTimer = null;
    window.tbkPageObj = {
        xhr: {}
    }

    /**
     *  组件实例对象
     */
    export default {
        components: {
            comBomLoading,
            comMidLoading,
            comListMidLoading,
            taobaokeCommoditList
        },
        data: function() {
            return {
                isShowPage: false,
                comMidIsShow: false,
                isShowComListMid: false,
                isShowCommoditList: true,
                hasCache: false,
                topInfo: {},
                listMinHeight: 100,
                commoditList: {},
                curChannel: '',
                categoryArr: [],
                pageCache: {
                    commoditList: {}
                },
                isLoadPage: true,
                bannerHeight: Math.ceil(document.documentElement.clientWidth * 184 / 670),
                shareing: false
            }
        },
        computed: {

        },
        methods: {
            /**
             * [getTopInfo 获取顶部信息]
             * @return {[type]} [description]
             */
            getTopInfo() {
                let self = this;
                Util.ajax({
                    url: `/tbk/top`,
                    apiPath: '/api/v3/client',
                    timeout:10000,
                    getXhrObj(xhr) {
                        window.tbkPageObj.xhr.topInfo = xhr;
                    },
                    ctrlStatus: {
                        loading: 1,
                        cache: self.hasCache,
                        errNum: 0,
                        netNum: 0
                    },
                    success(data) {
                        if (Util.isObject(data) && Util.isObject(data.result)) {
                            // 清空
                            self.topInfo = {};
                            if ('banner' in data.result && Util.isArray(data.result.banner)) {
                                // banner
                                self.topInfo.banner = data.result.banner;
                            }
                            if ('orders' in data.result && Util.isObject(data.result.orders)) {
                                // orders
                                self.topInfo.orders = data.result.orders;
                            }
                            // 缓存topInfo
                            self.pageCache.topInfo = data.result;
                        }
                    },
                    error(xhr, status) {
                        // self.ajaxAllCase();
                    },
                    noNetwork() {
                        // self.ajaxAllCase();
                    }
                });
            },
            getCategory() {
                let self = this;
                Util.ajax({
                    url: `/tbk/category`,
                    apiPath: '/api/v3/client',
                    timeout:10000,
                    getXhrObj(xhr) {
                        window.tbkPageObj.xhr.category = xhr;
                    },
                    ctrlStatus: {
                        loading: 0,
                        cache: self.hasCache,
                        errNum: 0,
                        netNum: 0
                    },
                    success(data) {
                        if (Util.isObject(data) && Util.isArray(data.result)) {
                            if (!self.curChannel) {
                                self.curChannel = data.result[0].channel;
                                // 缓存第一个channel
                                self.pageCache.firstCate = data.result[0].channel;
                            }
                            // 商品分类数组
                            self.categoryArr = data.result;
                            // 获取商品列表
                            setTimeout(function() {
                                self.$refs.tclist.getCommoditList(true);
                            }, 0)
                        } else {
                            KCwidget.toast('获取分类错误');
                        }
                    },
                    error(xhr, status) {
                        // self.ajaxAllCase();
                        KCpageInstances.listDataLoadFinished();
                        KCpageInstances.dataDownloadFinished();
                    },
                    noNetwork() {
                        // self.ajaxAllCase();
                        KCpageInstances.listDataLoadFinished();
                        KCpageInstances.dataDownloadFinished();
                    }
                });
            },
            /**
             * [setFilterMenuPos 设置过滤菜单位置]
             */
            setFilterMenuPos() {
                this.$nextTick(function() {
                    let offsetTop = $('#filterMenu').offset().top;
                    if (this.categoryArr.length) {
                        KCtbkIndexPage.setFilterMenu(offsetTop, this.categoryArr);
                    }
                });
            },
            /**
             * [ajaxAllCase ajax所有状态的回调]
             * @return {[type]} [description]
             */
            ajaxCallBack(type, page, dlist) {
                let self = this;
                // 允许上拉
                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                // 隐藏列表加载状态
                self.isShowComListMid = false;
                if (self.isLoadPage) {
                    // 结束下拉状态
                    if (page === 1) {
                        KCpageInstances.listDataLoadFinished();
                        KCpageInstances.dataDownloadFinished();
                    }
                    // 添加下拉刷新控件
                    KCpageInstances.canPullWebView(true);
                    // 隐藏页面加载状态
                    self.comMidIsShow = false;
                    // 显示页面
                    self.isShowPage = true;
                    // 设置过滤菜单位置
                    self.setFilterMenuPos();
                }
                // 设置列表最小高
                this.listMinHeight = this.isLoadPage ? document.documentElement.clientHeight + 10 : document.documentElement.clientHeight - 44;
                // 加载页面标志
                self.isLoadPage = false;
                // 请求成功时调用
                if (type === 'success' && page === 1) {
                    // 缓存处理
                    self.pageCache.has = true;
                    self.pageCache.commoditList[self.curChannel] = dlist;
                    KCcache.setCache('tbkIndex', self.pageCache, 10 * 24 * 60 * 60);
                }
            },
            /**
             * [commoditShare 商品分享]
             * @param  {[type]} item [商品信息]
             * @return {[type]}      [description]
             */
            commoditShare(item) {
                let self = this;
                console.log(self.shareing);
                if (self.shareing) return;
                // 检测用户登陆状态
                KCucApi.getUserInfo(function(userInfo) {
                    if (userInfo.userId != '0') {
                        KCtbkIndexPage.loadPageStatus('loading');
                        //登录
                        Util.ajax({
                            url: `/tbk/share`,
                            apiPath: '/api/v3/client',
                            timeout:10000,
                            type: 'POST',
                            data: item,
                            ctrlStatus: {
                                loading: 0,
                                cache: self.hasCache,
                                errNum: 0,
                                netNum: 0
                            },
                            success(data) {
                                KCtbkIndexPage.loadPageStatus('loadSuccess');
                                self.shareing = false;
                                switch(+data.code) {
                                    case -606:
                                        window.location.href = 'doumi://login';
                                        break;
                                    case 1000:
                                        if (Util.isObject(data.result)) KCsocialApi.share(data.result.text, 'tbk', 0);
                                        break;
                                    default:
                                        KCwidget.toast(data.message);
                                }
                            },
                            error(xhr, status) {
                                self.shareing = false;
                                // self.ajaxAllCase();
                            },
                            noNetwork() {
                                self.shareing = false;
                                // self.ajaxAllCase();
                            }
                        });
                    } else {
                        //未登录
                        window.location.href = 'doumi://login';
                    }
                });
            },
            /**
             * [loadNext 加载下一页]
             * @return {[type]} [description]
             */
            loadNext() {
                this.$refs.tclist.getCommoditList();
            }
        },
        beforeCreate() {
            let self = this;
            // native 下拉调用
            window.loadData = function() {
                // 加载页面标志
                self.isLoadPage = true;
                // 获取顶部信息
                self.getTopInfo();
                // 获取商品分类
                self.getCategory();
            }
            // native 切换过滤菜单
            window.switchFilterMenu = function(channel) {
                // 当前分类id
                self.curChannel = channel;
                // 清除定时器
                if (filterTimer) clearTimeout(filterTimer);
                // 中断ajax请求, 避免多次不必要的请求, 只保留最近一次
                if (Util.isObject(window.tbkPageObj.xhr.commoditList) && +window.tbkPageObj.xhr.commoditList.readyState != 4) {
                    console.log(`ajax ${window.tbkPageObj.xhr.commoditList.readyState}`);
                    window.tbkPageObj.xhr.commoditList.abort();
                }

                // 隐藏上拉状态
                self.$store.commit(combomloading_mt.SET_ISSHOW, false);

                // 创建定时器, 避免快速点击, 重复获取
                filterTimer = setTimeout(function() {
                    console.log(12123)
                    // 有缓存
                    if (channel in self.commoditList) {
                        console.log('has cache')
                    } else {
                        // 显示列表加载状态
                        self.isShowComListMid = true;
                    }
                    // 获取商品列表
                    self.$refs.tclist.getCommoditList(true);
                }, 500);
            }
        },
        created() {
            let self = this;
            // 读取页面缓存
            // KCcache.setCache('tbkIndex', null);
            KCcache.getCache('tbkIndex', function(data) {
                console.log(data);
                if (Util.isObject(data) && data.has) {
                    // 当前分类
                    self.curChannel = data.firstCate || 'zonghe';
                    // 渲染商品列表
                    self.commoditList = data.commoditList;
                    // 渲染topInfo
                    if ('topInfo' in data) self.topInfo = data.topInfo;
                    // 显示页面
                    self.isShowPage = true;
                    // 添加下拉刷新控件
                    KCpageInstances.canPullWebView(true);
                    // 页面有缓存
                    self.hasCache = true;
                    // 刷新页面
                    KCpageInstances.refreshPage();
                } else {
                    // 显示页面加载状态
                    self.comMidIsShow = true;
                    // 页面无缓存
                    self.hasCache = false;
                    // 获取顶部信息
                    self.getTopInfo();
                    // 获取商品分类
                    self.getCategory();
                }
            });
        }
    }
</script>

<!-- CSS 样式 -->
<style src="static/style/taobaoke_index.css"></style>
<style>
    .mod-tab .mod-nav-item {
        padding: 0 15px;
    }
    #filterMenu.mod-column-head {
        padding-left: 15px;
    }
</style>