<template>
    <!-- page start -->
    <div class="mod-page js-body">
        <section class="mod-content js-mod-body index">
            <div v-bind:style="{ height: slideImgHeight + 'px' }"></div>
            <!--普通运营位-->
            <navcase></navcase>
            <!--特殊运营位-->
            <advertisement></advertisement>
            <!--精品职位-->
            <boutique></boutique>
            <!--职位列表模块-->
            <joblist ref="joblist" @err="indexAjaxErrorFn" @nonetwork="indexAjaxNoNetworkFn"></joblist>
            <!--热门职位-->
            <hotjob ref="hotjob" @err="indexAjaxErrorFn" @nonetwork="indexAjaxNoNetworkFn"></hotjob>
        </section>
    </div>
    <!-- page end -->
</template>

<script>
    /**
     *  引入工具类库 或 模块API
     */
    import Util from 'tool/widget/Util'
    import KCindexPage from 'clientApi/KCindexPage'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCwidget from 'clientApi/KCwidget'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'

    /**
     *  引入组件 以及 组件mutation
     */
    import navcase from 'components/nav-case/nav-case'
    import advertisement from 'components/com-advertisement/com-advertisement'
    import boutique from 'components/index-boutique/index-boutique'
    import joblist from 'components/index-joblist/index-joblist'
    import hotjob from 'components/index-hotjob/index-hotjob'
    import * as navcase_mt from 'components/nav-case/nav-case-mutation-types'
    import * as advertisement_mt from "components/com-advertisement/com-advertisement-mutation-types"
    import * as boutique_mt from 'components/index-boutique/index-boutique-mutation-types'

    const hotList = [{
            "title": "斗米直聘",
            "urd": "doumi://browser/https://m.doumi.com/zhipin/index/"
        },
        {
            "title": "职位订阅",
            "urd": "doumi://userpreferences"
        },
        {
            "title": "展会协助",
            "urd": ""
        },
        {
            "title": "学生专享",
            "urd": "doumi://prefecture?key=hot_post&value=534&urdData=imageUrl%3Dhttps%3A%2F%2Fcdn.doumistatic.com%2F18%2C2dfd7919fcff31.jpg%26log%3Dxsjz"
        },
        {
            "title": "临时工",
            "urd": ""
        },
        {
            "title": "服务员",
            "urd": ""
        },
        {
            "title": "传单派发",
            "urd": ""
        },
        {
            "title": "家教助教",
            "urd": ""
        }
    ]
    /**
     *  组件实例对象
     */
    export default {
        components: {
            navcase,
            advertisement,
            boutique,
            joblist,
            hotjob
        },
        data (){
            return {
                hasCacheData : false,
                errCount: 0, //记录请求错误数
                noNetworkCount: 0, //记录请求无网数
                pageId: '',
                citydomain: 'bj',
                slideImgHeight : Math.ceil(document.documentElement.clientWidth * 290 / 750)
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
                 //设置四个入口的读取状态记录
                KCcache.setMemoryCache('prefecture_readedIds',[]); //专区
                KCcache.setMemoryCache('detail_readedIds',[]);     //详情
                KCcache.setMemoryCache('joblist_readedIds',[]);    //职位列表

                KCcache.getCache('indexAdvData', function(data){
                    if(!!data){
                        self.hasCacheData = true;
                        KCclientUI.setBannerView(0, 0, self.slideImgHeight, data.focus_imgs);
                        self.$store.commit(navcase_mt.SET_NAVCASE_DATA, data.case_list);

                        if(!!data.opr_conf){
                            self.$store.commit(advertisement_mt.SET_LISTDATA, data.opr_conf.items);
                        }

                        if (!!data.delicate_list) {
                            self.$store.commit(boutique_mt.SET_BOUTIQUE_DATA, data.delicate_list);
                        }
                        
                        if(Util.OS() == 'android'){
                            setTimeout(function(){
                                KCindexPage.refreshPage();
                            }, 0);
                        }else{
                            KCindexPage.refreshPage();
                        }
                    }else{
                        self.loadAdvData();
                    }
                });

                /**
                 * 获取页面唯一标记
                 * @param  {[type]} (data [description]
                 * @return {[type]}       [description]
                 */
                KCindexPage.getWebViewID((data)=>{
                    self.pageId = data;
                    KCcache.setCache('indexWebViewID',{'WebViewID': data}, 3 * 24 * 60 * 60);
                });
                
                if(window.localStorage){
                    window.localStorage.clear();
                    window.localStorage.setItem('prefecture_readedIds',[]); //专区
                    window.localStorage.setItem('detail_readedIds',[]);     //详情
                    window.localStorage.setItem('joblist_readedIds',[]);    //职位列表
                    window.localStorage.setItem('nearbylist_readedIds',[]);    //职位列表
                }
                //清空专区页面缓存数据中的读取状态.
                KCcache.getCache('prefectureData',function(data){
                    if(data){
                        for(var i = 0 ; i < data.data.data.length ; i++){
                            data.data.data[i].show = false;
                        }
                        KCcache.setCache('prefectureData',data);
                    }
                });
            },

            /**
             * 加载数据
             * @method loadAdvData
             * @public
             * @return {Null} void
             */
            loadAdvData (){
                var self = this;
                Util.ajax({
                    apiPath: '/api/v3/client',
                    url: "/index/exploreoperation?citydomain=" + self.citydomain,
                    timeout: 10000,
                    success: function(data){
                        // console.log(data)
                        // 获取理想数据
                        if (!!data && data.code == 1000 && !!data.data) {
                            //对运营位url处理
                            data.data.case_list.forEach((item, item_index) => {
                                item.forEach((navcase, navcase_index) => {
                                    if(navcase.url!=''){
                                        if(/doumi:/.test(navcase.url)){
                                            var hArgu = decodeURIComponent(navcase.url).indexOf('?')
                                            if(hArgu !== -1){
                                                navcase.url = navcase.url+'&title='+encodeURIComponent(navcase.title)+'&dmalog='+encodeURIComponent(navcase.dmalog)
                                            }else{
                                                navcase.url = navcase.url+'?title='+encodeURIComponent(navcase.title)+'&dmalog='+encodeURIComponent(navcase.dmalog)
                                            }
                                            
                                        }else{
                                            navcase.url='doumi://browser/'+encodeURIComponent(navcase.url);
                                        }
                                    }else{
                                        item.url='javascript:;';
                                    }
                                });
                            });

                            self.$store.commit(navcase_mt.SET_NAVCASE_DATA, data.data.case_list);
                            
                            // url编码处理
                            $.each(data.data.focus_imgs, function(i, item){
                                if(/doumi:\/\//.test(item.url)){
                                    data.data.focus_imgs[i].url=item.url;
                                }else{
                                    data.data.focus_imgs[i].url = encodeURIComponent(item.url);
                                }
                                
                            });

                            //特殊运营位
                            if(!!data.data.opr_conf){
                                data.data.opr_conf.items  = self.setAdvertisementList(data.data.opr_conf.items)
                                data.data.opr_conf.items.forEach(function(item,i){

                                    //曝光埋点
                                    // @atype=show@ca_name=doumi@ca_source=app@ca_from=yyw_sptg_[位置]_[顺序]_[运营位名称缩写]
                                    let randomIndex = item.randomIndex + 1;
                                    if(item.show_rate == 100){
                                        randomIndex = 100;
                                    }
                                    KCloggerApi.addLog('2','@atype=show@ca_name=doumi@ca_source=app@ca_from=yyw_sptg_'+ (i+1) +'_'+ randomIndex +'_'+ item.dmalog);

                                    if(/doumi:\/\//.test(item.link_to)){
                                        data.data.opr_conf.items[i].link_to=item.link_to; 
                                    }else{
                                        data.data.opr_conf.items[i].link_to = 'doumi://browser/'+encodeURIComponent(item.link_to);
                                    }
                                });
                                self.$store.commit(advertisement_mt.SET_LISTDATA, data.data.opr_conf.items);
                            }

                            //精品职位
                            self.$store.commit(boutique_mt.SET_BOUTIQUE_DATA, data.data.delicate_list);

                            KCclientUI.setBannerView(0, 0, self.slideImgHeight, data.data.focus_imgs);

                            if(!data.data.default){
                                data.data.default = {};
                                data.data.default.sex = '';
                                data.data.default.identity = '';
                            }else{
                                if(!data.data.default.sex){
                                    data.data.default.sex = '';
                                }
                                if(!data.data.default.identity){
                                    data.data.default.identity = '';
                                }
                            }
                            
                            KCindexPage.setFilterMenuForExplore(data.data.default.sex, data.data.default.identity);

                            //首页缓存不过期
                            KCcache.setCache('indexAdvData', data.data, 10000 * 24 * 60 * 60);
                        }else{
                            self.indexAjaxErrorFn();
                        }

                        KCindexPage.dataDownloadFinished();
                    },
                    error: function(xhr, status){
                        self.indexAjaxErrorFn();
                    },
                    noNetwork: function(){
                        self.indexAjaxNoNetworkFn();
                    }
                });
            },
            /**
             * 根据概率计算显示特殊运营位
             * @param {[list]} data [原数组]
             */
            setAdvertisementList(data) {
                let resultList = [];
                let rate,randomNum;
                data.map((obj) => {
                    if(Array.isArray(obj)) {
                        rate = 0;
                        randomNum = Math.random() * 100;
                        for(let i = 0; i < obj.length; i++) {
                            var item = obj[i];
                            rate += Number(item.show_rate);
                            if(randomNum < rate) {
                                item.randomIndex = i;
                                resultList.push(item);
                                break;
                            }
                        }
                    }else {
                        resultList.push(obj);
                    }
                });
                return resultList;
            },
            /**
             * 请求错误处理
             * @method indexAjaxErrorFn
             * @public
             * @return {Null} void
             */
            indexAjaxErrorFn () {
                let self = this;
                KCindexPage.dataDownloadFinished();
                if (self.errCount == 0) {
                    KCwidget.toast('数据加载异常');
                }
                self.errCount++;
            },
            /**
             * 请求无网处理
             * @method indexAjaxNoNetworkFn
             * @public
             * @return {Null} void
             */
            indexAjaxNoNetworkFn () {
                let self = this;
                KCindexPage.dataDownloadFinished();
                if (self.noNetworkCount == 0) {
                    KCwidget.toast('网络异常');
                }
                self.noNetworkCount++;
            }
        },
        beforeCreate() {
            
        },
        created(){
            let self = this;
            // 挂载客户端调用接口
            window.loadData = function(){
                // console.log('window.loadData')
                //设置搜索热词
                KCindexPage.hotKeyWords(hotList);
                
                KCindexPage.getOptions((optionData) => {
                    // console.log(optionData);
                    if (!!optionData) {
                        self.citydomain = optionData.citydomain;
                        let filterObj = {
                            citydomain: optionData.citydomain
                        };
                        if(!!optionData) {
                            if(!!optionData.gender) {
                                filterObj.gender = optionData.gender;
                            }
                            if(!!optionData.identity) {
                                filterObj.identity = optionData.identity;
                            }
                        }
                        self.errCount = 0;
                        self.noNetworkCount = 0;
                        self.loadAdvData();
                        self.$refs.joblist.loadData(filterObj);
                        self.$refs.hotjob.getHotJobType();
                    }
                });
            };
            
            self.initFun();
        }
    }    
</script>
<style src="static/style/discovery_index.css"></style>