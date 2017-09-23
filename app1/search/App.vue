<template>
    <div class="mod-page">
        <com-mid-loading :com-mid-is-show="pageLoadingStatus" />
          <!-- section start -->
        <section class="mod-content index">
            <!-- column start -->
            <div class="mod-column bc-main recommend">
                <div class="mod-column-body">
                    <ul class="mod-list J_mod-list">
                        <li class="mod-list-item com-border-bottom" v-for="(item, index) in searchObj">
                            <a :href="'doumi://jobdetail?job_id=' + item.id + '&urdData=' + item.urd_data + '&from=postlist_ss'" class="mod-list-info product-info" @click="EVlog('postlist',item.id, index)">
                                <h3 class="product-title">
                                    <span>
                                        {{item.title}}
                                    </span>
                                </h3>
                                <div class="product-price">
                                    <span class="fl">
                                        <b class="fc-red">{{item.salary}}</b>元/{{item.salary_type_str}}
                                    </span>
                                </div>
                                <div class="product-meta">
                                    <span class="fl fc-gray">
                                        <i class="icon icon-location-sm"></i>{{item.post_area}}
                                    </span>
                                    <span class="fl fc-gray">
                                        <i class="icon icon-date-sm"></i>{{item.date}}</span>
                                </div>
                                <div class="product-label" :class="{readed:item.show}">
                                    <i class="icon icon-danbao" v-if="item.is_wages_guarantee == 1">企业担保</i>
                                    <i v-if="!!item.payment_type_str" class="fl line icon-label" :title="item.payment_type_str">{{item.payment_type_str}}</i>
                                    <i v-if="item.ad_types==1" class="icon icon-remen" title="热门">热门</i>
                                    <i v-if="item.ad_types==2" class="icon icon-renqi" title="人气">人气</i>
                                    <i v-if="item.ad_types==3" class="icon icon-jizhao" title="急招">急招</i>
                                    <i v-if="item.has_subsidy==1" class="icon icon-tuijian" title="推荐">推荐</i>
                                    <i v-if="item.ad_types == 0 && item.has_subsidy == 0 && !!item.operate_label && item.operate_label.indexOf('zhipin') != -1" class="icon icon-zhipin" title="直聘">直聘</i>
                                    <i class="icon icon-youxian" v-if="item.ad_types==12" title="优先">优先</i>
                                </div>
                            </a>
                        </li>
                    </ul>
                    <com-bom-loading :load-fn="loadFunc"/>
                </div>
            </div>
            <!-- column end -->
        </section>
          <!-- section end -->
    </div>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCsearchPage from 'clientApi/KCsearchPage'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCcityApi from 'clientApi/KCcityApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCwidget from 'clientApi/KCwidget'
    
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
                searchObj:[],
                page:1,
                pageSize:20,
                // canNextRequest:true,
                // loadStatus:false,
                // loadingStatus:false,
                // moreStatus:false,
                pageLoadingStatus:true,
                cityid:12,
                text:''
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
            initFun (){
                var self=this;
                self.mountingWindow();
                KCcityApi.getValidCity(function(data){
                    var cityid=data.cityid;
                    self.cityid=data.cityid;
                    KCsearchPage.searchKey(function(data){
                        var searchKey=encodeURIComponent(data.searchKey);
                        self.text=encodeURIComponent(data.searchKey);
                        self.loadData(cityid,searchKey);
                    });
                }); 
            },
            loadData(cityid,text){
                var self=this;
                Util.ajax({
                    url:'/text/list?page='+self.page+'&size=20&city_id='+cityid+'&text='+text,
                    timeout:10000,
                    ctrlStatus: {
                        loading: self.page,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        KCsearchPage.dataDownloadFinished();
                        self.pageLoadingStatus=false;
                        self.$store.commit(combomloading_mt.SET_LOADING, false);
                        self.$store.commit(combomloading_mt.SET_NOMORE, false);
                        
                        //构建职位详情跳转参数
                        let showStr = '';
                        for(var i = 0;i < data.data.length;i++){
                            if (i + 1 == data.data.length) {
                                showStr += `{"id":${data.data[i].id},"ca_kw":${(i+1)}}`;
                            } else {
                                showStr += `{"id":${data.data[i].id},"ca_kw":${(i+1)}},`;
                            }

                            data.data[i].urd_data = encodeURIComponent("title=" + data.data[i].title + "&hire_number=" + data.data[i].hire_number + 
                                "&payment_type_str=" + data.data[i].payment_type_str + "&job_type_str=" + data.data[i].job_type_str + 
                                    "&salary=" + data.data[i].salary + "&salary_type_str=" + data.data[i].salary_type_str + "&is_wages_guarantee=" + data.data[i].is_wages_guarantee + "&has_subsidy=" + data.data[i].has_subsidy + "&ad_types=" + data.data[i].ad_types);
                        }
                        KCloggerApi.addLog('2','@atype=show@ca_name=doumi@ca_source=app@ca_from=post_show@show_post_id='+ showStr);

                        if(!!data && !!data.data && data.data.length>0){
                            if(self.page==1){
                                self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                                self.searchObj=[];
                                self.searchObj=data.data;
                            }else{
                                self.searchObj=self.searchObj.concat(data.data);
                            }
                            // self.canNextRequest=true;
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            KCloggerApi.addLog('1','/jianzhi/search/index&pn='+self.page);


                            if(data.curent_page == data.last_page){
                                self.pageLoadingStatus=false;
                                // self.loadingStatus=false;
                                self.$store.commit(combomloading_mt.SET_LOADING, false);
                                // self.loadStatus=false;
                                // self.moreStatus=true;
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                // self.canNextRequest=false;
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                            }
                            self.page++;
                        }else if(!!data && !!data.data && data.data.length==0){
                            // self.canNextRequest=false;
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                            if(self.page==1){
                                self.searchObj=[];
                                KCsearchPage.loadPageStatus('noData','暂无符合条件的职位');
                                KCloggerApi.addLog('1','/jianzhi/search/noresult');
                            }else{
                                // self.loadingStatus=false;
                                self.$store.commit(combomloading_mt.SET_LOADING, false);
                                // self.loadStatus=false;
                                // self.moreStatus=true;
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                            }
                        }else{
                            KCloggerApi.addLog('1','/jianzhi/search/errorpage');
                            // self.canNextRequest=true;
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            if(self.page==1){
                                self.searchObj=[];
                                KCsearchPage.loadPageStatus('loadFailed');
                            }else{
                                KCwidget.toast('服务器异常');
                            }
                        }
                    },
                    error:function(xhr,status){
                        KCsearchPage.dataDownloadFinished();
                        KCloggerApi.addLog('1','/jianzhi/search/errorpage');
                        self.pageLoadingStatus=false;
                        // self.canNextRequest=true;
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        // if(self.page==1){
                        //     self.searchObj=[];
                        //     KCsearchPage.loadPageStatus('loadFailed');
                        // }else{
                        //     KCwidget.toast('服务器异常');
                        // }
                    },
                    noNetwork:function(){
                        KCsearchPage.dataDownloadFinished();
                        KCloggerApi.addLog('1','/jianzhi/search/errorpage');
                        self.pageLoadingStatus=false;
                        // self.canNextRequest=true;
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        // if(self.page==1){
                        //     self.searchObj=[];
                        //     KCsearchPage.loadPageStatus('netWorkFailed');
                        // }else{
                        //     KCwidget.toast('网络异常');
                        // }
                    }
                });
            }, 
            //2.8.5
            EVlog(evValue,postId, index){
                // @atype=click@ca_name=doumi@ca_source=app@ca_from=postlist@post_id=[职位id]@ca_kw=[帖子排序]
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from='+evValue+ '@post_id=' + postId + '@ca_kw=' + (index+1));
            },
            /**
             * 在window上挂载供Native调用接口的方法
             * @method mountingWindow
             * @public
             * @return {Null} void
             */
            mountingWindow (){
                var self = this;
                window.loadData=function(){
                    self.page=1;
                    KCcityApi.getValidCity(function(data){
                        var cityid=data.cityid;
                        self.cityid=data.cityid;
                        KCsearchPage.searchKey(function(data){
                            var searchKey=encodeURIComponent(data.searchKey);
                            self.text=encodeURIComponent(data.searchKey);
                            self.loadData(cityid,searchKey);
                        });
                        // self.loadData(cityid,'兼职');
                    });
                }
            },
            loadFunc() {
                var self = this;
                // 加载下一页数据
                self.loadData(self.cityid,self.text);
            }
        },
        beforeCreate() {

        },
        created() {
            let self=this;
            self.initFun();
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/index.css"></style>