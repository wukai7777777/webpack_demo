<template>
<div>
    <!-- 组件的模板 -->
    <com-mid-loading :com-mid-is-show="pageLoadingStatus"/>
    <div class="mod-column bc-main">
        <div class="mod-column-body">
            <ul class="mod-list " id="perfectList">
                <template v-for="(item,index) in listData">
                    <li class="mod-list-item com-border-bottom">
                        <a :href="`doumi://jobdetail?job_id=${item.id}&urdData=${item.urd_data}&from=wnyx_list&readed_from=wnyx_list`" class="mod-list-info product-info mod-flex">
                            <div class="product-image"><img v-bind:src="item.image" alt=""></div>
                            <div class="product-content mod-flex-item">
                                <h3 class="product-title">
                                        <span  :class="{readed:item.show}">
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
                                       <!--  <span v-else class="fl">
                                            <b class="fc-red">{{item.salary_unit}}</b>元/{{item.unit_type_str}}
                                        </span> -->
                                        <i v-if="item.is_wages_guarantee == 1" class="icon icon-danbao">工资保障</i>
                                        <i v-if="!!item.payment_type_str" class="fl line icon-label" :title="item.payment_type_str">{{item.payment_type_str}}</i>
                                        <i v-if="item.ad_types==1" class="icon icon-remen" title="热门">热门</i>
                                        <i v-if="item.ad_types==2" class="icon icon-renqi" title="人气">人气</i>
                                        <i v-if="item.ad_types==3" class="icon icon-jizhao" title="急招">急招</i>
                                        <i v-if="item.has_subsidy==1" class="icon icon-tuijian" title="推荐">推荐</i>
                                        <i v-if="item.ad_types == 0 && item.has_subsidy == 0 && !!item.operate_label && item.operate_label.indexOf('zhipin') != -1" class="icon icon-zhipin" title="直聘">直聘</i>
                                    </div>
                                <!-- <h3 class="product-title">
                                    <span  :class="{readed:item.show}">
                                    <i v-if="item.ad_types==1" class="icon icon-remen">热门</i>
                                    <i class="icon icon-renqi" v-if="item.ad_types==2">人气</i>
                                    <i class="icon icon-jizhao" v-if="item.ad_types==3">急招</i>
                                    <i v-if="item.has_subsidy==1" class="icon icon-tuijian">推荐</i>
                                    {{item.title}}
                                    </span>
                                </h3>
                                <div class="product-meta">
                                    <span class="fl fc-gray">
                                        <i class="icon icon-location-sm"></i>{{item.post_area}}
                                    </span>
                                    <span class="fl fc-gray">
                                        <i class="icon icon-date-sm"></i>{{item.date}}</span>
                                </div>
                                <div class="product-meta" :class="{readed:item.show}">
                                    <span class="fl">
                                        <b class="fc-red">{{item.salary}}</b>元/{{item.salary_type_str}}
                                    </span>
                                    <span v-if="!!item.payment_type_str" class="fl line">{{item.payment_type_str}}</span>-->
                                    <!-- is_deposit==1 企业担保  
                                    (cooperation_type==2 || cooperation_type==3)&& is_deposit!=1  工资担保 -->
                                    <!--<i v-if="item.is_deposit == 1 || item.cooperation_type==2 ||  item.cooperation_type==3 ||  item.cooperation_type==4 ||  item.cooperation_type==5 ||  item.cooperation_type==6" class="icon icon-danbao">工资保障</i>
                                </div> -->
                            </div>
                        </a>
                    </li>
                </template>
            </ul>
        </div>
        <com-bom-loading :load-fn="loadData"/>
    </div>
        <!-- column end -->
</div>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCcache from 'clientApi/KCcache'
    import KCucApi from 'clientApi/KCucApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCwidget from 'clientApi/KCwidget'
    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */
    import comBomLoading from 'components/com-bom-loading/com-bom-loading'
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'
    import * as combomloading_mt from "components/com-bom-loading/com-bom-loading-mutation-types"

    const pageSize = 20;
    let page = 1;
    // let canNextRequest = true;
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
                pageLoadingStatus: false,
                listData: [],
                hasCache: false
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
             * 初始化
             * @method initFun
             * @public
             * @return {Null} void
             */
            initFun (){
                var self = this;

                KCucPage.canPullWebView(true);
                window.loadData = function(){
                    page = 1;
                    // canNextRequest = false;
                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                    self.loadData();
                };

                KCcache.getCache('selectivePerfect_listData', function(data){
                    if(!!data && data != 'null'){
                        self.hasCache = true;
                        self.pageLoadingStatus = false;
                        self.listData = data.data;
                        KCucPage.refreshPage();
                    }else {
                        self.hasCache = false;
                        self.pageLoadingStatus = true;
                        self.loadData();
                    }
                });
            },
            loadData() {
                var self=this;
                Util.ajax({
                    url:'/user/recommendlist?page=' + page + 'pageSize=' + pageSize,
                    apiPath: '/api/v3/client',
                    timeout:10000,
                    ctrlStatus: {
                        loading: page,
                        cache: self.hasCache,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function (data) {
                        // console.log(data)
                        self.pageLoadingStatus = false;
                        self.$store.commit(combomloading_mt.SET_LOADING, false);
                        self.$store.commit(combomloading_mt.SET_NOMORE, false);
                        KCucPage.dataDownloadFinished();
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(!!data && !!data.data) {
                            if(data.data.length > 0) {
                                for(var i = 0;i < data.data.length;i++){
                                    data.data[i].urd_data = encodeURIComponent("title=" + data.data[i].title + "&hire_number=" + data.data[i].hire_number + 
                                        "&payment_type_str=" + data.data[i].payment_type_str + "&job_type_str=" + data.data[i].job_type_str + 
                                            "&salary=" + data.data[i].salary + "&salary_type_str=" + data.data[i].salary_type_str + 
                                                "&is_wages_guarantee=" + data.data[i].is_wages_guarantee + "&has_subsidy=" + data.data[i].has_subsidy + "&ad_types=" + data.data[i].ad_types);
                                }
                                if(data.data.length < pageSize) {
                                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                    self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                                    self.$store.commit(combomloading_mt.SET_LOADING, false);
                                    self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                }
                                if(page == 1) {
                                    self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                                    KCcache.setCache('selectivePerfect_listData', data, 10 * 24 * 60 * 60);
                                    self.listData = data.data;
                                }else {
                                    self.listData = self.listData.concat(data.data);
                                }
                                page++;
                            }else if(data.data.length == 0) {
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                if(page == 1) {
                                    KCcache.setCache('selectivePerfect_listData', null, 10 * 24 * 60 * 60);
                                    KCucPage.loadPageStatus('noData');
                                    self.listData = [];
                                }else {
                                    self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                                    self.$store.commit(combomloading_mt.SET_LOADING, false);
                                    self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                }
                            }
                                
                        }else {
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            if(!!data && data.msg) {
                                if(page == 1) {
                                    KCucPage.loadPageStatus('loadFailed');
                                }else {
                                    KCwidget.toast(data.msg);
                                } 
                            }else {
                                if(page == 1) {
                                    KCucPage.loadPageStatus('loadFailed');
                                }else {
                                    KCwidget.toast('服务器异常');
                                }
                            }
                        }
                    },
                    error:function (xhr,status) {
                        self.$store.commit(combomloading_mt.SET_LOADING, false);
                        self.$store.commit(combomloading_mt.SET_NOMORE, false);
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        KCucPage.dataDownloadFinished();
                        // if(page == 1){
                        //     Util.ajaxErrorFn(KCwidget,xhr,status,false,KCucApi);
                        // }else{
                        //     Util.ajaxErrorFn(KCwidget,xhr,status,true,KCucApi);
                        // } 
                    },
                    noNetwork:function () {
                        self.$store.commit(combomloading_mt.SET_LOADING, false);
                        self.$store.commit(combomloading_mt.SET_NOMORE, false);
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        KCucPage.dataDownloadFinished();
                        // if(page == 1) {
                        //     KCucPage.loadPageStatus('netWorkFailed');
                        // }else {
                        //     KCwidget.toast('网络异常');
                        // }
                    }
                });
            }
        },
        created(){
            this.initFun();
        }
        
    }

</script>

<!-- CSS 样式 -->
<!-- <style src="static/css/global.css"></style> -->

<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/list.css"></style>
<style type="text/css">
    [v-cloak] {
      display: none;
    }
</style>
