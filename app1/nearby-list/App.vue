<template>
    <!-- section start -->
    <section class="mod-content list" v-cloak>
        <!-- location start -->
        
        <div class="location bc-main" v-show="!showFailFlag">
            <span>当前定位：</span>
            <b v-show="!loadLocation">{{address}}</b>
            <i v-show="!loadLocation" class="icon icon-refresh" @click="getLocation(true)">刷新</i>
            <b v-show="loadLocation">加载中</b>
            <i v-show="loadLocation" class="icon icon-refresh active">刷新</i>
        </div>
        <div v-show="showFailFlag">
            <div class="location bc-main">
                <span>当前定位：</span><b>未获取到当前位置</b>
            </div>
            <div class="location-status active">
                <p>{{failText}}</p>
                <button class="btn btn-primary btn-large" type="button" @click="setFailBut">{{failButton}}</button>
            </div>
        </div>
        <com-error :show-error="!showFailFlag && showError" :error-type="errorType" :error-msg="errorMsg" :reload-fun="getData"></com-error>
        <!-- location end -->
        <com-mid-loading :com-mid-is-show="isShowPageloading"/>
        <!-- column start -->
        <div class="mod-column bc-main com-space" v-show="!showFailFlag && partTimeJobList.length > 0 && !showError" >
            <div class="mod-column-body">
                <ul class="location-list mod-list">
                    <li class="mod-list-item com-border-bottom" v-for="(item, index) in partTimeJobList" :key="index" @click="goToJobDetail(item.id, item.urd_data, item.distance, index, item)">
                        <a href="javascript:;" class="mod-list-info product-info">
                            <h3 class="product-title"><span>{{item.title}}</span></h3>
                            <div class="product-price"><b>{{item.salary}}</b>元/{{item.salary_type_str}}</div>
                            <div class="product-meta">
                                <span class="fl fc-gray"><i class="icon icon-location-sm"></i>{{item.distance}} {{item.post_area}}</span>
                                <span class="fl fc-gray"><i class="icon icon-date-sm"></i>{{item.date}}</span>
                            </div>
                            <div class="product-label">
                                <i v-if="item.is_wages_guarantee == 1" class="icon icon-danbao" title="工资保障">工资保障</i>
                                <i v-if="!!item.payment_type_str" class="icon icon-label" :title="item.payment_type_str">{{item.payment_type_str}}</i>
                                <i v-if="item.ad_types==1" class="icon icon-remen" title="热门">热门</i>
                                <i v-if="item.ad_types==2" class="icon icon-renqi" title="人气">人气</i>
                                <i v-if="item.ad_types==3" class="icon icon-jizhao" title="急招">急招</i>
                                <i v-if="item.has_subsidy==1" class="icon icon-tuijian" title="推荐">推荐</i>
                                <i v-if="item.ad_types == 0 && item.has_subsidy == 0 && !!item.operate_label && item.operate_label.indexOf('zhipin') != -1" class="icon icon-zhipin" title="直聘">直聘</i>
                            </div>
                            <!-- <h3 class="product-title">
                                <span :class="{readed:item.show}">
                                    <i v-if="item.ad_types==1" class="icon icon-remen" title="热门">热门</i>
                                    <i v-if="item.ad_types==2" class="icon icon-renqi" title="人气">人气</i>
                                    <i v-if="item.ad_types==3" class="icon icon-jizhao" title="急招">急招</i>
                                    <i v-if="item.has_subsidy==1" class="icon icon-tuijian" title="推荐">推荐</i>
                                    <i v-if="item.ad_types == 0 && item.has_subsidy == 0 && !!item.operate_label && item.operate_label.indexOf('zhipin') != -1" class="icon icon-zhipin" title="直聘">直聘</i>{{item.title}}
                                </span>
                            </h3>
                            <div class="product-meta">
                                <span class="fl fc-gray"><i class="icon icon-location-sm"></i>{{item.post_area}}</span>
                                <span class="fl fc-gray"><i class="icon icon-date-sm"></i>{{item.date}}</span>
                            </div>
                            <div class="product-meta" :class="{readed:item.show}">
                                <span class="fl"><b class="fc-red">{{item.salary}}</b>元/{{item.salary_type_str}}</span>
                                <span class="fl line" v-if="!!item.payment_type_str">{{item.payment_type_str}}</span>
                                <i v-if="is_wages_guarantee == 1" class="icon icon-danbao"></i>
                            </div>
                            <div class="product-ds" v-if="!!item.distance"><span class="fc-gray">{{item.distance}}</span></div> -->
                        </a>
                    </li>
                </ul>
                <com-bom-loading :load-fn="loadFunc"/>
            </div>
        </div>
        
        <!-- column end -->
    </section>
    <!-- section end -->        
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KClocationApi from 'clientApi/KClocationApi'
    import KCwidget from 'clientApi/KCwidget'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCdeviceApi from 'clientApi/KCdeviceApi'
    import KCindexPage from 'clientApi/KCindexPage'
    import KCcityApi from 'clientApi/KCcityApi'
    import KCucApi from 'clientApi/KCucApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCnearbyListPage from 'clientApi/KCnearbyListPage'
    import KCcache from 'clientApi/KCcache'
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import comError from 'components/com-error/com-error'
    import comBomLoading from 'components/com-bom-loading/com-bom-loading'
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'
    import * as combomloading_mt from "components/com-bom-loading/com-bom-loading-mutation-types"

    let page = 1;
    const pageSize = 20;
    // let canNextRequest = true;
    let lat = '';
    let lng = '';
    let failFlag = false;//开启定位 入口标识 true：页面开启按钮，false：弹窗开启按钮
    /**
     *  组件实例对象
     */
    export default {
        components: {
            comError,
            comBomLoading,
            comMidLoading
        },
        data: function() {
            return {
                address: '',
                citydomain: '',
                loadLocation: false,
                showFailFlag: false,
                failText:'',
                failButton:'',
                partTimeJobList: [],
                isShowPageloading: false,
                showError: false,
                errorType: '',
                errorMsg: '加载失败',
                isAgain: false  
            }
        },
        computed: {

        },
        methods: {
            /**
             * 定位
             * @param  {[json]} (data [status 结果(－1 未开启定位  0失败 1成功) lon经度  lat纬度  
             * address  地址］
             * @return {[type]}       [null]
             */
            getLocation(isClick) {
                var self = this;
                if(self.isShowPageloading) {
                    return
                }
                
                self.$store.commit(combomloading_mt.SET_LOADING, false);
                self.showError = false;
                self.showFailFlag = false;
                self.isShowPageloading = false;
                self.loadLocation = true;
                // again
                self.isAgain = false;
                KCclientInfo.getNetworkType(function(networkData){
                    if(networkData.network != 'invalid'){
                        self.partTimeJobList = [];
                        if(isClick){
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=position_1@from=yyw_fjjz');
                            KCloggerApi.addLog('0','附近兼职运营位列表_顶部定位点击&附近兼职运营位列表_顶部定位点击&');
                        }
                        KCcityApi.getValidCity(function(data){
                            self.citydomain = data.citydomain;
                        });
                        KClocationApi.requestLocation((data) => {
                            // KCwidget.toast(JSON.stringify(data));
                            // self.address = '';
                            self.loadLocation = false;
                            if(self.partTimeJobList.length == 0) {
                                self.isShowPageloading = true;
                            }
                            if(data && data.status == 1 && data.address && data.lat && data.lon) {
                                failFlag = false;
                                self.showFailFlag = false;
                                self.address = data.address;
                                lat = data.lat;
                                lng = data.lon;
                                //定位成功 复原职位列表  partTimeJobList设置[]，page 设置1
                                page = 1;
                                // 更新职位列表数据 
                                self.getData();
                            }else if(data && data.status == -1) {
                                self.isShowPageloading = false;
                                if(!failFlag) {
                                    self.address = '未获取到当前位置';                  
                                    KCclientUI.showDialog('定位服务未开启','请在系统设置中开启定位服务',(data) => {
                                        //data.status  0 取消 1 确定
                                        if(data.status == 1) {
                                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=open_setting@from=yyw_fjjz');
                                            KCloggerApi.addLog('0','附近兼职运营位列表_开启设置点击&附近兼职运营位列表_开启设置点击&');
                                            // 调用客户端调起开启定位
                                            KCdeviceApi.openGPSSetting();
                                        }else{
                                            self.isAgain = true;
                                            if(self.partTimeJobList.length == 0) {
                                                self.failText = '当前位置不可用，请检查你的定位设置';
                                                self.failButton = '开启设置';
                                                self.showFailFlag = true;
                                            }
                                        }
                                    },'开启','暂不','Location')
                                }else {
                                    failFlag = false;
                                    self.failText = '当前位置不可用，请检查你的定位设置';
                                    self.failButton = '开启设置';
                                    self.showFailFlag = true;
                                }
                            }else {
                                self.isShowPageloading = false;
                                failFlag = false;
                                //已有职位列表，定位失败弹toast
                                if(self.partTimeJobList.length) {
                                    self.address = '未获取到当前位置';
                                    KCwidget.toast('定位失败');
                                }else {
                                    self.failText = '位置加载失败，请重新获取当前位置';
                                    self.failButton = '重新定位';
                                    self.showFailFlag = true;
                                }
                            }
                        });
                    } else {
                        setTimeout(function() {
                            self.loadLocation = false;
                            self.address = '未获取到当前位置';
                            if(self.partTimeJobList.length) {
                                KCwidget.toast('网络异常');
                            }else {
                                self.isShowPageloading = false;
                                self.showError = true;
                                self.errorType = 'netWorkFailed';
                            }
                        },100);
                    }
                    
                })
                
            },
            setFailBut() {
                if(this.failButton == '开启设置') {
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=open_setting@from=yyw_fjjz');
                    KCloggerApi.addLog('0','附近兼职运营位列表_开启设置点击&附近兼职运营位列表_开启设置点击&');
                    // 调用客户端调起开启定位
                    KCdeviceApi.openGPSSetting();
                    failFlag = true;
                }else if(this.failButton == '重新定位') {
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=position_2@from=yyw_fjjz');
                    KCloggerApi.addLog('0','附近兼职运营位列表_重新定位点击&附近兼职运营位列表_重新定位点击&');
                    this.showFailFlag = false;
                    this.getLocation();
                }
            },
             /**
             * 获取附近兼职列表
             * @return null
             */
            getData(loadNextPage) {
                var self = this;
                self.showError = false;
                if(self.address == '未获取到当前位置' || !self.address) {
                    self.getLocation();
                }else {
                    if(page == 1) {
                        self.isShowPageloading = true;
                    }
                    Util.ajax({
                        url:'/list/nearby',
                        data:{
                           page: page,
                           pageSize: pageSize,
                           lat: lat,
                           lng: lng,
                           citydomain: self.citydomain,
                        },
                        timeout:10000,
                        ctrlStatus: {
                            loading: 0,
                            cache: true,
                            isToastErr: false,
                            errNum: 0,
                            netNum: 0,
                        },
                        success:function(data) {
                            // console.log(data)
                            //show为判断读取状态参数，请求到的数据先添加为未读状态
                            for(let i = 0 ; i < data.data.data.length ; i++){
                                data.data.data[i].show = false
                            }
                            //获取缓存中的读过的id修改读取状态然后插入数据
                            KCcache.getMemoryCache('nearbylist_readedIds',function(arr){

                                if(arr){
                                    
                                    for(let i = 0 ; i < data.data.data.length ; i++){
                                        for(let a = 0 ; a < arr.length ; a++){
                                            if(arr[i] == data.data.data[a].id){
                                                data.data.data[a].show = true
                                            }
                                        }
                                    }
                                }
                                if(page == 1) {
                                    self.isShowPageloading = false;
                                    KCnearbyListPage.listDataLoadFinished();
                                }
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                                if(data && data.code == 1000) {
                                    try{
                                        let list = data.data.data;
                                        if(list && list.length > 0) {
                                            self.$store.commit(combomloading_mt.SET_LOADING, false);
                                            //构建职位详情跳转参数
                                            let showStr = '';
                                            for(var i = 0;i < list.length;i++){
                                                if (i + 1 == list.length) {
                                                    showStr += `{"id":${list[i].id},"ca_kw":${(i+1)}}`;
                                                } else {
                                                    showStr += `{"id":${list[i].id},"ca_kw":${(i+1)}},`;
                                                }
                                                list[i].urd_data = encodeURIComponent("title=" + list[i].title + "&hire_number=" + list[i].hire_number + 
                                                    "&payment_type_str=" + list[i].payment_type_str + "&job_type_str=" + list[i].job_type_str + 
                                                        "&salary=" + list[i].salary + "&salary_type_str=" + list[i].salary_type_str + 
                                                            "&is_wages_guarantee=" + list[i].is_wages_guarantee + "&has_subsidy=" + list[i].has_subsidy + "&ad_types=" + list[i].ad_types);
                                            }
                                            KCloggerApi.addLog('2','@atype=show@ca_name=doumi@ca_source=app@from=fjjz_yyw@ca_from=post_show@show_post_id='+ showStr);
                                            if(data.data.last_page == 1 || data.data.last_page == data.data.curent_page) {
                                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                            }
                                            if(page == 1) {
                                                self.partTimeJobList = list;
                                            }else {
                                                self.partTimeJobList = self.partTimeJobList.concat(list);
                                            }
                                            page++;
                                        }else if(list && list.length === 0) {
                                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                            if(page == 1) {
                                                self.showError = true;
                                                self.errorType = 'noData';
                                            }else {
                                                self.$store.commit(combomloading_mt.SET_LOADING, false);
                                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                            }
                                        } 
                                    }catch(e) {
                                        if(page == 1) {
                                            self.showError = true;
                                            self.errorMsg = '服务器异常';
                                            self.errorType = 'loadFailed';
                                        }else {
                                            KCwidget.toast('服务器异常');
                                        }
                                    }
                                }else if(data && data.msg){
                                    if(page == 1) {
                                        self.showError = true;
                                        self.errorMsg = data.msg;
                                        self.errorType = 'loadFailed';
                                    }else {
                                        KCwidget.toast(data.msg);
                                    }
                                }else {
                                    if(page == 1) {
                                        self.showError = true;
                                        self.errorMsg = '服务器异常';
                                        self.errorType = 'loadFailed';
                                    }else {
                                        KCwidget.toast('服务器异常');
                                    }
                                }
                            })
                            
                        },
                        error:function(xhr, status){
                            if(page == 1) {
                                self.isShowPageloading = false;
                            }
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);

                            if(status == 'timeout'){
                                if(page == 1){
                                    self.showError = true;
                                    self.errorMsg = '网络请求超时';
                                    self.errorType = 'loadFailed';
                                }else {
                                    KCwidget.toast('网络请求超时');
                                }
                            }else{
                                if(xhr.status==400) {
                                    let err=JSON.parse(xhr.responseText);
                                    if(err.code==-100) {//登录超时
                                        KCucApi.logOut();
                                    }else {
                                        if(page == 1){
                                            self.showError = true;
                                            self.errorMsg = err.message;
                                            self.errorType = 'loadFailed';
                                        }else {
                                            KCwidget.toast(err.message)
                                        }
                                    }
                                }else {
                                    if(page == 1){
                                        self.showError = true;
                                        self.errorMsg = '服务器异常';
                                        self.errorType = 'loadFailed';
                                    }else {
                                        KCwidget.toast('服务器异常')
                                    }
                                }
                            }
                        },
                        noNetwork: function(){
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            if(page == 1) {
                                setTimeout(function() {
                                    self.isShowPageloading = false;
                                    self.showError = true;
                                    self.errorType = 'netWorkFailed';
                                },100)
                            }else {
                                KCwidget.toast('网络异常');
                            }
                            
                        }
                    });
                }
            },
            /**
             *  跳转至职位详情页面
             * @param  {[type]} jobId   [职位id]
             * @param  {[type]} urdData []
             * @return {[type]}         [description]
             */
            goToJobDetail(jobId,urdData,distance,index,item){
                item.show = true
                KCloggerApi.addLog('2',`@atype=click@ca_name=doumi@ca_source=app@ca_from=post@from=yyw_fjjz@post_id=${jobId}@ca_kw=${index+1}`);
                KCloggerApi.addLog('0','附近兼职运营位列表_访问详情页&来源&{"来源":"附近兼职运营位列表"}');
                window.location.href = 'doumi://jobdetail?job_id=' + jobId + '&urdData=' + urdData + '&distance=' + distance + '&from=yyw_fjjz&readed_from=nearbylist';
            },
            /**
             * 上拉加载下一页
             * @return {[type]} [description]
             */
            loadFunc() {
                this.getData(true);
            }
        },
        beforeCreate() {
            let self = this;
            // native call - 是否获取定位
            window.checkIsOpenLocation = function(isopen) {
                if (isopen && self.isAgain) {
                    self.getLocation();
                }
            };
            // native call - 双击获取定位
            window.dClickFun = function() {
                self.getLocation();
            }
        },
        created() {
            var self = this;
            self.$store.commit(combomloading_mt.SET_ISSHOW, true);
            window.refreshNearbyJobPage = self.getLocation;

            self.getLocation();
            
            KCloggerApi.addLog('0','附近兼职运营位_展现量&附近兼职运营位_展现量&');
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style type="text/css">
    [v-cloak] {
      display: none;
    }
    .readed{
        color:#808080;
    }
</style>
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/list.css"></style>
<style src="static/css/location.css"></style>