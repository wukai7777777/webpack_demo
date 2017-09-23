<template>
    <!-- page start -->
    <div class="mod-page js-body">
        <section class="mod-content js-mod-body index">
            <div v-bind:style="{ height: slideImgHeight + 'px' }"></div>
            <!-- index-nav-case -->
            <index-nav-case :nav-case-data="navCaseData"></index-nav-case>
            <!-- com-advertisement -->
            <com-advertisement :adv-data="advData"></com-advertisement>
            <!-- 为你优选 -->
            <div class="mod-column bc-main com-space youxuan" v-show="showSelectivePerference" :style="{minHeight: selectiveperfectMinHeight}">
                <div class="mod-column-head">
                    <h2 class="mod-column-title">为你优选</h2>
                    <a href='doumi:///selectiveperfect-list.html' class="mod-column-tool" @click="setYouxuanLog('selectiveperfect-list')" v-show="isTouch">更多</a>
                </div>
                <div class="mod-column-body">
                    <!-- <a href="doumi://perfect-resume?webViewId={{pageId}}" @click="setYouxuanLog('perfect-resume')" class="mod-guide" v-show="showResumePercent">
                        <div class="mod-guide-icon">
                            <div class="mod-grogress" :class="{active: resumePercent != 0}">
                                <template v-if="resumePercent == 0">
                                    <i class="mod-grogress-range"><b>{{resumePercent}}</b>%</i>
                                </template>
                                <template v-else>
                                    <span class="mod-grogress-value"><b>{{resumePercent}}</b>%</span>
                                    <div class="mod-grogress-range"><i :style="{height: resumePercent + '%'}"></i></div>
                                </template>
                            </div>
                        </div>
                        <p class="mod-guide-text">
                            <template v-if="resumePercent == 0">填写基础信息和求职偏好，</template>
                            <template v-else>简历完善度<b>{{resumePercent}}%</b>，完善剩余信息</template>
                            <br>即可为你每天推荐个人专属兼职</p>
                    </a> -->
                    <!-- 推荐列表 -->
                    <div class="product-list scroll-x" id="youxuan" v-show="perferenceList.length > 0">
                        <!-- min-width 计算规则：.youxuan .mod-list  min-width: 504px; (列表宽度 504/2 ＊ list.length) + (margin-left: 12px;以及 padding-left: 8px;)  -->
                        <ul class="mod-list iscroll" :style="{'min-width': ((perferenceList.length * 252) + 20) + 'px'}">
                            <li class="mod-list-item youxuan-list" v-for="item in perferenceList">
                                <a :href="`doumi://jobdetail?job_id=${item.id}&urdData=${item.urd_data}&from=wnyx_sy&readed_from=wnyx_list`" class="mod-list-info product-info" @click="setYouxuanLog('jobdetail', $index, item.id)">
                                    <h3 class="product-title"><span>{{item.title}}</span></h3>
                                    <div class="product-meta">
                                        <span class="fl fc-gray">{{item.post_area}}</span>
                                    </div>
                                    <div class="product-label">
                                        <span v-if="!!item.zhipin_str" class="label">{{item.zhipin_str}}</span>
                                        <span v-if="!!item.payment_type_str" class="label">{{item.payment_type_str}}</span>
                                        <span v-if="!!item.has_commission && item.has_commission == 1" class="label">提成</span>
                                       <!--  <span class="label">日结</span>
                                        <span class="label">提成</span> -->
                                    </div>
                                    <div class="product-price" ><b>{{item.salary}}</b>元/{{item.salary_type_str}}</div>
                                    <!-- <div class="product-price" v-else><b>{{item.salary_unit}}</b>元/{{item.unit_type_str}}</div> -->
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- index-filter-menu 只是占位,没有交互-->
            <!-- <index-filter-menu v-if="!pageLoadingStatus" id="menuNav" :filter-data="filterData"></index-filter-menu> -->
            <div class="mod-filter bc-main com-space" id="menuNav">
                <nav class="filter-nav">
                    <ul class="mod-list mod-flex com-border-bottom">
                        <li class="mod-list-item mod-flex-item" v-for="item in filterData">
                            <a href="javascript:;" class="mod-list-info">{{item}}</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="mod-column bc-main recommend" style="position:relative;" :style="{ minHeight: warpHeight + 'px' }">
                <!-- com-mid-loading -->
                <com-list-mid-loading top="35%" :is-show-com-list-mid="isShowComListMid"/>
                <div class="mod-column-body" v-show="isShowList">
                    <!-- com-list -->
                    <keep-alive>
                        <com-list :com-list-args="comListArgs" :com-list-query-recognition="comListQueryRecognition" @ajaxCallBack="ajaxCallBack" :com-list-next-fun="comListNextFun" @clickItemEvent="clickItemEvent"/>
                    </keep-alive>
                </div>
            </div>
        </section>
    </div>
    <!-- page end -->
</template>

<script>
    'use strict'
    /**
     *  引入工具类库 或 模块API
     */
    import Util from 'tool/widget/Util'
    import KCindexPage from 'clientApi/KCindexPage'
    import KCucApi from 'clientApi/KCucApi'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCwidget from 'clientApi/KCwidget'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCPageCompleteResume from 'clientApi/KCPageCompleteResume'


    /**
     *  引入组件 以及 组件接口(Action)
     */
    import comAdvertisement from 'components/com-advertisement/com-advertisement'
    import indexNavCase from 'components/index-nav-case/index-nav-case'
    import comList from 'components/com-list/com-list'
    import comListMidLoading from 'components/com-list-mid-loading/com-list-mid-loading'
    import * as comlist_mt from 'components/com-list/com-list-mutation-types';

    const hotList = [{
            "title": "斗米直聘",
            "urd": "doumi://browser/https://m.doumi.com/zhipin/index/"
        }, {
            "title": "职位订阅",
            "urd": "doumi://userpreferences"
        }, {
            "title": "展会协助",
            "urd": ""
        }, {
            "title": "学生专享",
            "urd": "doumi://prefecture?key=hot_post&value=534&urdData=imageUrl%3Dhttps%3A%2F%2Fcdn.doumistatic.com%2F18%2C2dfd7919fcff31.jpg%26log%3Dxsjz"
        }, {
            "title": "临时工",
            "urd": ""
        }, {
            "title": "服务员",
            "urd": ""
        }, {
            "title": "传单派发",
            "urd": ""
        }, {
            "title": "家教助教",
            "urd": ""
        }]
    let touchFlag = false;//为你优选touch事件
        /**
         *  组件实例对象
         */
    export default {
        components: {
            indexNavCase,
            comListMidLoading,
            comList,
            comAdvertisement
        },
        data: function() {
            return {
                navCaseData: [],
                advData: [],
                perferenceList: [],
                hasCacheData: false,
                showSelectivePerference: false,
                showPerferenceList: false,
                resumePercent: 0,
                isLogin: false,
                dataDefaultSex: '',
                dataDefaultIdentity: '',
                isTouch: false,
                filterData: ["区域", "职位类型", "职位排序", "筛选"],
                isShowList: true,
                warpHeight: document.documentElement.clientHeight,
                slideImgHeight: Math.ceil(document.documentElement.clientWidth * 290 / 750),
                selectiveperfectMinHeight: Math.round(document.documentElement.clientWidth * 126 / 360) + 'px',
                // 请求加载数据状态
                comListQueryRecognition: '',
                // com list 参数
                comListArgs: {
                    dataList: [],
                    fromStr: 'index',
                    ajaxParam: {
                        url: ''
                    },
                    isShowBomLoading: false,
                    uniqueFiled: 'id',
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
                isShowComListMid: false,
                optData: {}//,
                // count: 0
            }
        },
        methods: {
            /**
             * 初始化
             * @method initFun
             * @public
             * @return {Null} void
             */
            initFun() {
                var self = this;
                //设置四个入口的读取状态记录
                KCcache.setMemoryCache('index_readedIds', []); //首页入口
                KCcache.setMemoryCache('prefecture_readedIds', []); //专区
                KCcache.setMemoryCache('detail_readedIds', []); //详情
                KCcache.setMemoryCache('joblist_readedIds', []); //职位列表

                // // 调用添加埋点事件函数
                // self.logEvent();

                KCcache.getCache('indexData', function(data) {
                    self.getOptions(function(optionData) {
                        // 默认北京
                        if (!optionData || Util.isEmptyObject(optionData)) {
                            self.optData = {};
                            self.optData.citydomain = 'bj';
                        } else {
                            self.optData = optionData;
                        }
                        
                        if (!!self.optData.filterMenuStr) {
                            self.filterData = self.optData.filterMenuStr;
                        }
                        
                        if (!Util.isEmptyObject(data)) {
                            self.hasCacheData = true;
                            KCclientUI.setBannerView(0, 0, self.slideImgHeight, data.focus_imgs);
                            self.navCaseData = data.case_list;

                            if (!!data.opr_conf) {
                                self.advData = data.opr_conf.items;
                            }

                            KCucApi.getUserInfo(function(userInfo) {
                                if (userInfo.userId != '0') {
                                    //登录
                                    self.isLogin = true;
                                } else {
                                    //未登录
                                    self.isLogin = false;
                                }

                                // 为你优选
                                if (!!data.resume) {
                                    self.setSelectivePerfect(data.resume, self.optData);
                                }

                                if (!data.default) {
                                    data.default = {};
                                    data.default.sex = '';
                                    data.default.identity = '';
                                } else {
                                    if (!data.default.sex) {
                                        data.default.sex = '';
                                    } else {
                                        self.dataDefaultSex = data.default.sex;
                                    }
                                    if (!data.default.identity) {
                                        data.default.identity = '';
                                    } else {
                                        self.dataDefaultIdentity = data.default.identity;
                                    }
                                }

                                KCcache.getCache('indexListData', function(indexListData) {
                                    if (Util.isObject(indexListData)) {
                                        self.comListArgs.dataList = indexListData.data;
                                        self.setADBanner(indexListData);
                                    }
                                });

                                if (Util.OS() == 'android') {
                                    setTimeout(function() {
                                        KCindexPage.refreshPage();
                                    }, 0);
                                } else {
                                    KCindexPage.refreshPage();
                                }
                                // KCwidget.toast('refreshPage')

                                
                                self.setFilterMenuFn(data.default.sex, data.default.identity);
                            });
                        } else {
                            self.hasCacheData = false;
                            self.loadData();
                            // 显示中间加载态
                            self.isShowComListMid = true;
                            // 隐藏底部加载态
                            self.comListArgs.isShowBomLoading = false;
                            // 禁止上拉
                            self.$store.commit(comlist_mt.SET_CANNEXTREQUEST, false);
                        }
                    });
                });

                /**
                 * 获取页面唯一标记
                 * @param  {[type]} (data [description]
                 * @return {[type]}       [description]
                 */
                KCindexPage.getWebViewID((data) => {
                    KCcache.setCache('indexWebViewID', {
                        'WebViewID': data
                    }, 3 * 24 * 60 * 60);
                });

            },

            /**
             * 加载数据
             * @method loadData
             * @public
             * @return {Null} void
             */
            loadData() {
                var self = this;

                KCucApi.getUserInfo(function(userInfo) {
                    if (userInfo.userId != '0') {
                        //登录
                        self.isLogin = true;
                    } else {
                        //未登录
                        self.isLogin = false;
                    }

                    // 请求首页接口
                    Util.ajax({
                        url: "/index?set_opr_config=1&citydomain=" + self.optData.citydomain,
                        timeout: 10000,
                        ctrlStatus: {
                            loading: 1,
                            cache: self.hasCacheData,
                            errNum: 0,
                            netNum: 0
                        },
                        success: function(data) {
                            // console.log(data)
                            // 获取理想数据
                            if (!!data && data.cityInfo && typeof(data) == 'object') {
                                //对运营位url处理
                                data.case_list.forEach(function(item, index) {
                                    if (item.url != '') {
                                        if (/doumi:/.test(item.url)) {
                                            var hArgu = decodeURIComponent(item.url).indexOf('?')
                                            if (hArgu !== -1) {
                                                item.url = item.url + '&title=' + encodeURIComponent(item.title) + '&dmalog=' + encodeURIComponent(item.dmalog)
                                            } else {
                                                item.url = item.url + '?title=' + encodeURIComponent(item.title) + '&dmalog=' + encodeURIComponent(item.dmalog)
                                            }
                                        } else {
                                            item.url = 'doumi://browser/' + encodeURIComponent(item.url);
                                        }
                                    } else {
                                        item.url = 'javascript:;';
                                    }
                                });
                                data.case_list = Util.arrayChunks(data.case_list, 4);
                                self.navCaseData = data.case_list;

                                //清空专区页面缓存数据中的读取状态.
                                for(let v of data.case_list) {
                                    for(let vv of v) {
                                        if (vv.dmalog !== '') {
                                            KCcache.getCache(`prefectureData_${vv.dmalog}`, function(data) {
                                                if (Util.isObject(data)) {
                                                    for (var i = 0; i < data.data.data.length; i++) {
                                                        data.data.data[i].show = false;
                                                    }
                                                    KCcache.setCache(`prefectureData_${vv.dmalog}`, data, 10 * 24 * 60 * 60);
                                                }
                                            })
                                        }
                                    }
                                }

                                // url编码处理
                                $.each(data.focus_imgs, function(i, item) {
                                    if (/dbredirect/.test(item.url)) {
                                        var index = item.url.lastIndexOf('?');
                                        var dbredirect = item.url.substring(index);
                                        var urlStr = encodeURIComponent('modules/duiba/duiba.html' + dbredirect);
                                        data.focus_imgs[i].url = "doumi://duiba/" + urlStr;
                                    } else if (/doumi:\/\//.test(item.url)) {
                                        data.focus_imgs[i].url = item.url;
                                    } else {
                                        data.focus_imgs[i].url = encodeURIComponent(item.url);
                                    }

                                });



                                //特殊运营位
                                if (!!data.opr_conf) {
                                    data.opr_conf.items = self.setAdvertisementList(data.opr_conf.items)
                                    data.opr_conf.items.forEach(function(item, i) {

                                        //曝光埋点
                                        // @atype=show@ca_name=doumi@ca_source=app@ca_from=yyw_sptg_[位置]_[顺序]_[运营位名称缩写]
                                        let randomIndex = item.randomIndex + 1;
                                        if (item.show_rate == 100) {
                                            randomIndex = 100;
                                        }
                                        KCloggerApi.addLog('2', '@atype=show@ca_name=doumi@ca_source=app@ca_from=yyw_sptg_' + (i + 1) + '_' + randomIndex + '_' + item.dmalog);

                                        if (/doumi:\/\//.test(item.link_to)) {
                                            data.opr_conf.items[i].link_to = item.link_to;
                                        } else {
                                            data.opr_conf.items[i].link_to = 'doumi://browser/' + encodeURIComponent(item.link_to);
                                        }
                                    });
                                    self.advData = data.opr_conf.items;
                                }

                                KCclientUI.setBannerView(0, 0, self.slideImgHeight, data.focus_imgs);
                                // 为你优选
                                self.setSelectivePerfect(data.resume, self.optData);

                                if (!data.default) {
                                    data.default = {};
                                    data.default.sex = '';
                                    data.default.identity = '';
                                } else {
                                    if (!data.default.sex) {
                                        data.default.sex = '';
                                    }
                                    if (!data.default.identity) {
                                        data.default.identity = '';
                                    }
                                }

                                self.setFilterMenuFn(data.default.sex, data.default.identity);
                                KCcache.setCache('indexData', data, 10 * 24 * 60 * 60);
                            } else {
                                KCindexPage.dataDownloadFinished();
                                if (self.hasCacheData) {
                                    KCwidget.toast('服务器异常')
                                } else {
                                    KCindexPage.loadPageStatus('loadFailed');
                                }
                            }
                        },
                        error: function(xhr, status) {
                            KCindexPage.dataDownloadFinished();
                            
                            if (Util.OS() == 'android') {
                                setTimeout(function() {
                                    self.setFilterMenuFn(self.dataDefaultSex, self.dataDefaultIdentity);
                                }, 100);
                            } else {
                                self.setFilterMenuFn(self.dataDefaultSex, self.dataDefaultIdentity);
                            }
                        },
                        noNetwork: function() {
                            KCindexPage.dataDownloadFinished();
                            if (Util.OS() == 'android') {
                                setTimeout(function() {
                                    self.setFilterMenuFn(self.dataDefaultSex, self.dataDefaultIdentity);
                                }, 100);
                            } else {
                                self.setFilterMenuFn(self.dataDefaultSex, self.dataDefaultIdentity);
                            }
                        }
                    });
                });
            },
            /**
             * 通知客户端筛选栏位置
             * @method setFilterMenuFn
             * @public
             * @return {Null} void
             */
            setFilterMenuFn(sex, identity) {
                let self = this;
                self.$nextTick(function() {
                    //通知客户端menu数据和高度
                    if (Util.OS() == 'android') {
                        setTimeout(function() {
                            var headerNavHeight = $('#menuNav').offset().top;
                            KCindexPage.setFilterMenu(headerNavHeight, self.slideImgHeight, sex, identity);
                        }, 50)
                    } else {
                        var headerNavHeight = $('#menuNav').offset().top;
                        KCindexPage.setFilterMenu(headerNavHeight, self.slideImgHeight, sex, identity);
                    }
                });
            },
            /**
             * 根据概率计算显示特殊运营位
             * @param {[list]} data [原数组]
             */
            setAdvertisementList(data) {
                let resultList = [];
                let rate, randomNum;
                data.map((obj) => {
                    if (Array.isArray(obj)) {
                        rate = 0;
                        randomNum = Math.random() * 100;
                        for (let i = 0; i < obj.length; i++) {
                            var item = obj[i];
                            rate += Number(item.show_rate);
                            if (randomNum < rate) {
                                item.randomIndex = i;
                                resultList.push(item);
                                break;
                            }
                        }
                    } else {
                        resultList.push(obj);
                    }
                });
                return resultList;
            },
            /**
             * 设置为你优选模块显示
             * @param {[Object]} data [简历信息／推荐列表]
             * @param {[number]} resumePercent [未登录状况下获取的native的百分比]
             */
            setSelectivePerfect(data, optionData) {
                var self = this;
                // if(self.isLogin){
                // 登陆
                // if(!!data && !!data.data) {
                // if(data.data.is_complete) {
                // 简历已经完善，显示推荐列表
                //获取推荐列表登出状态，当作未登录处理
                if (!!data && !!data.data && !!data.data.list && !!data.data.list.data && data.data.list.data.length > 1) {
                    self.isTouch = data.data.list.is_touch;
                    self.showSelectivePerference = true;
                    self.perferenceList = data.data.list.data;
                    //构建职位详情跳转参数
                    let logStr = '@atype=show@ca_name=doumi@ca_source=app@from=wnyx_list@ca_from=post_show@show_post_id='
                    for (var i = 0; i < self.perferenceList.length; i++) {
                        if (i == self.perferenceList.length - 1) {
                            logStr += `{''id'':${self.perferenceList[i].id},''ca_kw'':${i}}`
                        } else {
                            logStr += `{''id'':${self.perferenceList[i].id},''ca_kw'':${i}},`
                        }
                        self.perferenceList[i].urd_data = encodeURIComponent("title=" + self.perferenceList[i].title + "&hire_number=" + self.perferenceList[i].hire_number +
                            "&payment_type_str=" + self.perferenceList[i].payment_type_str + "&job_type_str=" + self.perferenceList[i].job_type_str +
                            "&salary=" + self.perferenceList[i].salary + "&salary_type_str=" + self.perferenceList[i].salary_type_str +
                            "&is_wages_guarantee=" + self.perferenceList[i].is_wages_guarantee + "&has_subsidy=" + self.perferenceList[i].has_subsidy + "&ad_types=" + self.perferenceList[i].ad_types);
                    }
                    // 帖子曝光
                    // @atype=show@ca_name=doumi@ca_source=app@from=wnyx_list@ca_from=post_show@show_post_id={''id'':1234567,''ca_kw'':1},{''id'':2345678,''ca_kw'':2}
                    KCloggerApi.addLog('2', logStr);
                    if(!touchFlag) {
                         self.$nextTick(function() {
                            touchFlag = true;
                            self.setEvent();
                        });
                    }
                   
                } else {
                    //推荐列表长度不足2条，不显示
                    self.showSelectivePerference = false;
                }
                // }else {
                //     // 简历未完善，显示简历完善百分比
                //     self.setResumePercent(data.data,optionData)
                // }
                // }else {
                //     self.showSelectivePerference = false;
                // }
                // }else {
                //     //未登录 todo
                //     self.resumePercent = 0;
                //     if(!!optionData) {
                //         if(!!optionData.gender) {
                //             self.resumePercent += 20;
                //         }
                //         if(!!optionData.identity) {
                //             self.resumePercent += 20;
                //         }
                //         if(!!optionData.birth && optionData.birth != 0) {
                //             self.resumePercent += 20;
                //         }
                //         if(!!optionData.name) {
                //             self.resumePercent += 20;
                //         }
                //     }
                //     self.showSelectivePerference = true;
                //     self.showResumePercent = true;
                //     self.perferenceList = [];
                // }
            },
            /**
             * 计算用户简历完善度
             * @param {[type]} data [description]
             */
            // setResumePercent(data,optionData) {

            //     if(data.audit_status) {
            //         // 实名认证用户
            //         this.resumePercent = data.score;
            //     }else {
            //         //非实名认证用户(客户端拿到的数据优先级高)
            //         this.resumePercent = 0;
            //         if(data.job_prefer) {
            //             this.resumePercent = 20;
            //         }
            //         if(!!optionData) {
            //             if(!!optionData.gender || data.gender) {
            //                 this.resumePercent += 20;
            //             }
            //             if(!!optionData.identity || data.at_school) {
            //                 this.resumePercent += 20;
            //             }
            //             if((!!optionData.birth && optionData.birth != 0) || data.birth_date) {
            //                 this.resumePercent += 20;
            //             }
            //             if(!!optionData.name  || data.real_name) {
            //                 this.resumePercent += 20;
            //             }
            //         }
            //     }
            //     this.perferenceList = [];
            //     this.showSelectivePerference = true;
            //     this.showResumePercent = true;
            // },
            /**
             * 为你优选模块相关埋点
             * @param {[String]} type  点击部分
             * @param {[number]} index 点击职位的横向位置
             */
            setYouxuanLog(type, index, id) {
                if (type == 'selectiveperfect-list') {
                    //点击更多
                    //@atype=click@ca_name=doumi@ca_source=app@from=wnyx_list@ca_from=prefermore
                    KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@from=wnyx_list@ca_from=prefermore');
                }
                // else if(type == 'perfect-resume') {
                //     //点击完善简历
                //     KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@ca_from=edit_info');
                // }
                else {
                    //点击列表职位 
                    //@atype=click@ca_name=doumi@ca_source=app@from=wnyx_sy@ca_from=preferpost@ca_kw=[横向位置]@post_id=[职位id]              
                    KCloggerApi.addLog('2', `@atype=click@ca_name=doumi@ca_source=app@from=wnyx_sy@ca_from=preferpost@ca_kw=${index}@post_id=${id}`);
                }
            },
            setEvent() {
                let el = document.getElementById('youxuan');
                let kw = 1;
                // el.addEventListener('touchend', function(e) {
                //     setTimeout(function() {
                //         let item = $($('.youxuan-list')[0]);
                //         let itemWidth = item.offset().width + Number(item.css('margin-left').split('px')[0]);
                //         kw = Math.ceil((el.clientWidth + el.scrollLeft - 20) / itemWidth) - 1;
                //         kw = kw > 4 ? 4 : (kw < 1 ? 1 : kw);
                //         // console.log(`@atype=click@ca_name=doumi@ca_source=app@ca_from=slide@ca_kw=${kw}`)
                //         KCloggerApi.addLog('2', `@atype=click@ca_name=doumi@ca_source=app@ca_from=slide@ca_kw=${kw}`);
                //     }, 1000);
                // });
                // 
                let timer;
                el.addEventListener('scroll', function() {
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        let scrollLeftMaxwidth = $('.iscroll').offset().width - el.clientWidth;
                        let scrollLeft = el.scrollLeft;
                        if(scrollLeft >= 0 && scrollLeft <= scrollLeftMaxwidth) {
                            let item = $($('.youxuan-list')[0]);
                            let itemWidth = item.offset().width + Number(item.css('margin-left').split('px')[0]);
                            kw = Math.ceil((el.clientWidth + scrollLeft - 20) / itemWidth) - 1;
                            kw = kw > 4 ? 4 : (kw < 1 ? 1 : kw);
                            // console.log(`@atype=click@ca_name=doumi@ca_source=app@ca_from=slide@ca_kw=${kw}`)
                            KCloggerApi.addLog('2', `@atype=click@ca_name=doumi@ca_source=app@ca_from=slide@ca_kw=${kw}`); 
                        }
                    },1000);
                }, false);

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
             * [getOptions 获取服务端参数]
             * @param  {Function} callback [description]
             * @return {[type]}            [description]
             */
            getOptions(callback) {
                KCindexPage.getOptions(function(data) {
                    if (Util.isFunction(callback)) callback(data);
                });
            },
            /**
             * [loadListDataBefore 发请求之前处理]
             * @return {[type]} [description]
             */
            loadListDataBefore(pre) {
                let self = this;
                self.comListArgs.ajaxParam.hasCache = true;
                self.comListArgs.ajaxParam.url = `/listmore?${Util.json2url(self.optData.param)}`;
                self.comListQueryRecognition = `${pre}-${Date.now()}`;
            },
            /**
             * [setWarpHeight 设置外层高度]
             */
            setWarpHeight(load) {
                let height = 0;
                let self = this;
                if (load) height = 54;
                self.$nextTick(function() {
                    self.warpHeight = +document.documentElement.clientHeight + height;
                });
            },
            /**
             * [setADBanner 设置广告]
             */
            setADBanner(dinfo = {}) {
                let {
                    jobprefer_tip,
                    data: dlist
                } = dinfo;
                let self = this;

                function setAdState(closeData) {
                    if (closeData) {
                        //不显示
                        self.comListArgs.tip.tipPos = false;
                    } else {
                        if (jobprefer_tip.status == 1 && Util.isArray(dlist)) {
                            self.comListArgs.tip.tipData = jobprefer_tip;
                            if (dlist.length == 0) {
                                self.comListArgs.tip.tipPos = 0;
                            } else if (dlist.length > 0 && dlist.length <= 4) {
                                self.comListArgs.tip.tipPos = dlist.length - 1;
                            } else {
                                //在第五个显示
                                self.comListArgs.tip.tipPos = 3;
                            }
                        } else if (jobprefer_tip.status == 0 && Util.isArray(dlist)) {
                            self.comListArgs.tip.tipPos = false;
                        }
                    }
                }
                if (Util.isObject(jobprefer_tip)) {
                    KCucApi.getUserInfo(function(userInfo) {
                        if (userInfo.userId != '0') { //已登录
                            self.comListArgs.tip.userId = userInfo.userId;
                            KCcache.getCache(userInfo.userId + 'close', function(closeData) {
                                setAdState(closeData);
                            });

                        } else {
                            //没登录 显示
                            KCcache.getCache('close', function(closeData) {
                                setAdState(closeData);
                            });
                        }
                    });
                }
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
                    KCindexPage.listDataLoadFinished();
                    KCindexPage.dataDownloadFinished();
                }
                if (type === 'success') {
                    let dinfo = data.data;
                    // init data
                    if (+page === 1) {
                        this.setADBanner(dinfo);
                        KCcache.setCache('indexListData', dinfo, 10 * 24 * 60 * 60);
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
                this.setWarpHeight(true);
                filterOptionsStr(this.optData, data, page, this.needparam);
            },
            /**
             * [filterListCallBack 过滤回调]
             * @param  {[type]} data  [数据]
             * @param  {[type]} page  [当前页]
             * @return {[type]}       [description]
             */
            filterListCallBack(data, page) {
                this.isShowList = true;
                this.setWarpHeight();
                filterOptionsStr(this.optData, data, page);
            },
            /**
             * [loadCallBack 过滤回调]
             * @param  {[type]} data  [数据]
             * @param  {[type]} page  [当前页]
             * @return {[type]}       [description]
             */
            nextListCallBack(data, page) {
                filterOptionsStr(this.optData, data, page);
            },
            /**
             * [clickItem 点击item]
             * @param  {[type]} index [索引]
             * @param  {[type]} item  [数据]
             * @return {[type]}       [description]
             */
            clickItemEvent(index, item) {
                KCucApi.getUserInfo(function(data) {
                    if (data.userId != 0) {
                        KCloggerApi.addLog('0', '兼职列表页_访问详情页&登录状态&{"状态":"已登录"}');
                    } else {
                        KCloggerApi.addLog('0', '兼职列表页_访问详情页&登录状态&{"状态":"未登录"}');
                    }
                });

                KCloggerApi.addLog('0', '兼职列表页_访问详情页&来源&{"来源":"职位首页"}');
                KCloggerApi.addLog('2', `@atype=click@ca_name=doumi@ca_source=app@from=postlist_sy@ca_from=post_list@post_id=${item.id}@ca_kw=${index}@item=${item.tjStr}`);
                window.location = `doumi://jobdetail?job_id=${item.id}&urdData=${item.urd_data}&from=postlist_sy&readed_from=${this.comListArgs.fromStr}`;
            }
        },
        beforeCreate() {
            let self = this;
            // native 下拉调用
           
            window.loadData = function(needparam) {
                // KCwidget.toast(self.count++);
                // console.log('window loadData, needparam===' + needparam)
                self.needparam = needparam;
                //设置搜索热词
                KCindexPage.hotKeyWords(hotList);
                self.getOptions(function(optionData) {
                    // 默认北京
                    if (!optionData || Util.isEmptyObject(optionData)) {
                        self.optData = {};
                        self.optData.citydomain = 'bj';
                    } else {
                        self.optData = optionData;
                    }

                    // 加载首页数据
                    self.loadData();
                    // 禁止上拉
                    self.$store.commit(comlist_mt.SET_CANNEXTREQUEST, false);
                    // 加载列表数据
                    self.loadListDataBefore('loadPage');
                });
            }
            // native 过滤调用
            window.loadListData = function() {
                // 列表隐藏
                self.isShowList = false;
                // 显示中间加载态
                self.isShowComListMid = true;
                // 隐藏底部加载态
                self.comListArgs.isShowBomLoading = false;
                // 禁止上拉
                self.$store.commit(comlist_mt.SET_CANNEXTREQUEST, false);
                self.getOptions(function(optionData) {
                    if (Util.isObject(optionData)) {
                        self.optData = optionData;
                        // 加载过滤列表数据
                        self.loadListDataBefore('filterList');
                    }
                });
            };
        },
        created() {
            var self = this;
            this.initFun();
            if (window.localStorage) {
                window.localStorage.clear();
                window.localStorage.setItem('index_readedIds', []); //首页入口
                window.localStorage.setItem('prefecture_readedIds', []); //专区
                window.localStorage.setItem('detail_readedIds', []); //详情
                window.localStorage.setItem('joblist_readedIds', []); //职位列表
                window.localStorage.setItem('nearbylist_readedIds', []); //职位列表
            }
            //清空joblist中读取状态，全部置为未读。1：未读，2：已读
            KCcache.getCache('listData', function(data) {
                if (data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].show = 1
                    }
                    KCcache.setCache('listData', data);
                }
            })
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

    function filterOptionsStr(optData, data, page, needparam) {
        let foStr = '';
        let dinfo = data.data;
        let showStr = '';
        if (dinfo.data.length) {
            // &item=[城市_区域;职位类型;排序类型;筛选]
            // "pv_param":{"district":"北京","order":"推荐排序","filter":"不限;女生可做;非学生可做;全部","job_type":"全部兼职"}
            // pv,ev埋点，带筛选参数
            //首次启动的时候optData是null
            if (!!optData.pv_param) {
                if (!!needparam) {
                    if (!!data.default) {
                        if (data.default.sex == 0 && data.default.identity == 0) {
                            foStr = optData.pv_param.district + ';' + optData.pv_param.job_type + ';' + optData.pv_param.order + ';' + optData.pv_param.filter;
                        } else {
                            let sexStr = '';
                            let identityStr = '';
                            if (data.default.sex == 0) {
                                sexStr = '';
                            } else if (data.default.sex == 1) {
                                sexStr = '男生可做;';
                            } else if (data.default.sex == 2) {
                                sexStr = '女生可做;';
                            }

                            if (data.default.identity == 0) {
                                identityStr = '';
                            } else if (data.default.identity == 1) {
                                identityStr = '学生可做';
                            } else if (data.default.identity == 3) {
                                identityStr = '非学生可做';
                            }
                            foStr = optData.pv_param.district + ';' + optData.pv_param.job_type + ';' + optData.pv_param.order + ';' + sexStr + identityStr;
                        }
                    } else {
                        foStr = optData.pv_param.district + ';' + optData.pv_param.job_type + ';' + optData.pv_param.order + ';' + optData.pv_param.filter;
                    }
                } else {
                    foStr = optData.pv_param.district + ';' + optData.pv_param.job_type + ';' + optData.pv_param.order + ';' + optData.pv_param.filter;
                }

            }
            
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
                    "&is_wages_guarantee=" + dinfo.data[i].is_wages_guarantee + "&has_subsidy=" + dinfo.data[i].has_subsidy + "&ad_types=" + dinfo.data[i].ad_types);
            }
            KCloggerApi.addLog('2', '@atype=show@ca_name=doumi@ca_source=app@ca_from=post_show@show_post_id=' + showStr + '@' + foStr);
            // 统计
            tjFn(optData, foStr, page);
        }
    }
</script>

<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/index.css"></style>
<style type="text/css">
.scroll-x {
    overflow-x: auto !important;
    overflow-y: hidden !important;
    -webkit-overflow-scrolling: touch !important;
}
.scroll-x::-webkit-scrollbar {
    display: none;
}
</style>