<template>
    <!-- page start -->
    <div class="mod-page">
        <section class="mod-content detail">
            <!-- <detail></detail> -->
            <!-- detail start -->
            <div class="product-detail bc-main" v-if="!!detailObj.title">
                <h1 class="product-title">{{detailObj.title}}</h1>
                <div class="product-info">
                    <template v-if="detailObj.salary != undefined">
                        <div class="product-price"><b>{{detailObj.salary}}</b>元 / {{detailObj.salary_type_str}}</div>
                        <!-- <div class="product-price" v-if="detailObj.salary==0"><b>{{detailObj.salary_unit}}</b>元 / {{detailObj.unit_type_str}}</div> -->
                    </template>
                    <!-- <div v-else class="product-price"><b>0</b>元 / 天</div> -->
                    <div class="product-meta">
                        <span class="fl line" v-if="!!detailObj.payment_type_str">{{detailObj.payment_type_str}}</span>
                        <span class="fl line" v-if="!!detailObj.job_type_str">{{detailObj.job_type_str}}</span>
                        <span class="fl line" v-if="!!detailObj.hire_number">{{detailObj.hire_number}}人</span>
                    </div>
                    <ul class="product-topic mod-list">
                        <li class="mod-list-item" v-if="!!detailObj.is_wages_guarantee && detailObj.is_wages_guarantee == 1">
                            <a href="javascript:;" class="mod-list-info"><i class="icon icon-danbao-lg" @click="goToTagPage(0, '点击工资担保标签')"></i>工资保障</a>
                        </li>
<!--                         <li class="mod-list-item" v-if="(detailObj.cooperation_type == 2 || detailObj.cooperation_type == 3 || detailObj.cooperation_type == 4 || detailObj.cooperation_type == 5 || detailObj.cooperation_type == 6) && detailObj.is_deposit != 1">
                            <a href="javascript:;" class="mod-list-info"><i class="icon icon-danbao-lg" @click="goToTagPage(1, '点击工资担保标签')"></i>工资保障</a>
                        </li> -->
                        <!-- <li class="mod-list-item" >
                            <a href="javascript:;" class="mod-list-info"><i class="icon icon-renqi-lg"></i>人气职位</a>
                        </li>
                        <li class="mod-list-item">
                            <a href="javascript:;" class="mod-list-info"><i class="icon icon-remen-lg"></i>热门职位</a> -->
                        </li>
                        <li class="mod-list-item" v-if="!!detailObj.has_subsidy && detailObj.has_subsidy==1">
                            <a href="javascript:;" class="mod-list-info"><i class="icon icon-tuijian-lg" @click="goToTagPage(2, '点击推荐标签')"></i>推荐职位</a>
                        </li>
                        <li class="mod-list-item" v-if="!!detailObj.ad_types && detailObj.ad_types==3">
                            <a href="javascript:;" class="mod-list-info"><i class="icon icon-jizhao-lg" @click="goToTagPage(3, '点击急招标签')"></i>急招职位</a>
                        </li>
                    </ul>
                </div>
            </div>
            <detailLoading></detailLoading>
            <div class="product-status mod-status-box" v-show="isNoNetwork">
                <div class="mod-status active">
                    加载失败
                    <button class="btn btn-primary" type="button" v-on:click="loadData()">重试</button>
                </div>
            </div>
            <div class="product-summary mod-column bc-main com-space" v-show="!!detailObj.post_detail_content && isShow">
                <div class="mod-column-head">
                    <h2 class="mod-column-title">职位描述</h2>
                </div>
                <div class="mod-column-body">
                    <div class="product-text">
                        <p class="desc-text" :class="{'js-show': expendItemObj[0].isExpend, 'js-hide-jobdesc': expendItemObj[0].isHide}" v-html="detailObj.post_detail_content"></p>
                        <div class="mod-flexible needsclick" :class="{active: expendItemObj[0].isActive, toggle: expendItemObj[0].isExpend}" @click="moreInfo(0)">{{expendItemObj[0].expText}}</div>
                    </div>
                </div>
            </div>
            <div class="product-welfare mod-column bc-main com-border-top" v-if="detailObj.post_type != '5' && detailObj.special_adv_type != '1' && detailObj.special_adv_type != '10' && !!detailObj.tab_treatment && isShow">
                <div class="mod-column-head">
                    <h2 class="mod-column-title">薪资福利</h2>
                </div>
                <div class="mod-column-body">
                    <div class="product-tag" v-if="detailObj.tab_treatment.length > 0">
                        <span class="product-tag-item" :class="{active: detailObj.tab_treatment.indexOf('1') != -1}"><i class="icon icon-meal"></i>工作餐</span>
                        <span class="product-tag-item" :class="{active: detailObj.tab_treatment.indexOf('2') != -1}"><i class="icon icon-board"></i>包吃住</span>
                        <span class="product-tag-item" :class="{active: detailObj.tab_treatment.indexOf('3') != -1}"><i class="icon icon-travel"></i>交通补助</span>
                        <span class="product-tag-item" :class="{active: detailObj.tab_treatment.indexOf('4') != -1}"><i class="icon icon-income"></i>有提成</span>
                    </div>
                    <div class="product-remark">
                        <p>{{detailObj.salary_text}}</p>
                    </div>
                </div>
            </div>
            <div class="product-worktime mod-column bc-main com-space" v-show="isShow">
                <div class="mod-column-head">
                    <h2 class="mod-column-title">工作时间</h2>
                </div>
                <div class="mod-column-body">
                    <p class="product-text" v-if="detailObj.post_type == '5' || detailObj.special_adv_type == '1' || detailObj.special_adv_type == '10'">
                        <span>{{detailObj.work_day_str}}</span>
                    </p>
                    <template v-else>
                        <dl class="product-dlist mod-flex">
                            <dt class="product-dlist-dt">开始日期</dt>
                            <dd class="product-dlist-dd mod-flex-item">
                                <p><b>{{detailObj.date_start_str_standard}}</b></p>
                                <p>{{detailObj.work_day_str}}</p>
                                <div class="product-dlist-wrap desc-text" :class="{'js-show': expendItemObj[1].isExpend, 'js-hide-wordhour': expendItemObj[1].isHide}">
                                    <dl class="mod-flex" v-if="!!detailObj.working_hours_arr && !!detailObj.working_hours_arr['1']">
                                        <dt>白班</dt>
                                        <dd class="mod-flex-item">
                                            <template v-for="day_hours in detailObj.working_hours_arr['1']">
                                                <span>{{day_hours.am_time}} - {{day_hours.pm_time}}</span>
                                            </template>
                                        </dd>
                                    </dl>
                                    <dl class="mod-flex" v-if="!!detailObj.working_hours_arr && !!detailObj.working_hours_arr['2']">
                                        <dt>夜班</dt>
                                        <dd class="mod-flex-item">
                                            <template v-for="night_hours in detailObj.working_hours_arr['2']">
                                                <span>{{night_hours.am_time}} - {{night_hours.pm_time}}</span>
                                            </template>
                                        </dd>
                                    </dl>
                                </div>
                                <div class="mod-flexible needsclick" :class="{active: expendItemObj[1].isActive, toggle: expendItemObj[1].isExpend}" @click="moreInfo(1)">{{expendItemObj[1].expText}}</div>
                            </dd>
                        </dl>
                        <dl class="product-dlist mod-flex">
                            <dt class="product-dlist-dt">结束日期</dt>
                            <dd class="product-dlist-dd mod-flex-item">
                                <p><b>{{detailObj.date_end_str_standard}}</b></p>
                            </dd>
                        </dl>
                    </template>
                    
                </div>
            </div>
            <div class="product-address mod-column bc-main com-space" v-show="!!detailObj.post_addr_list && isShow">
                <div class="mod-column-head">
                    <h2 class="mod-column-title">工作地点</h2>
                </div>
                <div class="mod-column-body" :class="{'mod-flex': detailObj.post_type != '5' && detailObj.special_adv_type != '1' && detailObj.special_adv_type != '10'}" v-if="!!detailObj.post_addr_list && detailObj.post_addr_list.length != 0">
                    <p class="product-text" v-if="detailObj.post_type == '5' || detailObj.special_adv_type == '1' || detailObj.special_adv_type == '10'">
                        <span>{{detailObj.post_addr_list[0].city_name}}{{detailObj.post_addr_list[0].district_name}}{{detailObj.post_addr_list[0].street_name}}{{detailObj.post_addr_list[0].address}}</span>
                    </p>
                    <template v-else>
                        <div class="product-image"><img :src="detailObj.post_addr_image" alt=""></div>
                        <div class="product-info mod-flex">
                            <i class="icon icon-location"></i>
                            <p class="product-title mod-flex-item"><span class="product-location" v-if="nearestDistance != -1"><i class="icon icon-needle-sm"></i>{{nearestDistance}}</span>{{detailObj.post_addr_list[0].city_name}}{{detailObj.post_addr_list[0].district_name}}{{detailObj.post_addr_list[0].street_name}}{{detailObj.post_addr_list[0].address}}</p>
                            <a href="javascript:;" class="product-opt" @click="goToAllAddress()" v-if="!!detailObj.post_addr_list && detailObj.post_addr_list.length > 1">全部{{detailObj.post_addr_list.length > 1 ? '(' + detailObj.post_addr_list.length + ')' : ''}}</a>
                        </div>
                    </template>
                </div>
            </div>
            <div class="product-interview mod-column bc-main" v-if="(detailObj.post_type != '5' && detailObj.special_adv_type != '1' && detailObj.special_adv_type != '10') && !!detailObj.interview_addr_list && detailObj.interview_addr_list.length != 0 && detailObj.is_interview != '0' && isShow">
                <div class="mod-column-head">
                    <h2 class="mod-column-title">面试地点</h2>
                </div>
                <div class="mod-column-body">
                    <ul class="mod-list">
                        <template v-for="(interview_addr, index) in detailObj.interview_addr_list">
                            <li class="mod-list-item" v-if="index <= 1 ">{{interview_addr.city_name}}{{interview_addr.district_name}}{{interview_addr.street_name}}{{interview_addr.address}}</li>
                            <li class="mod-list-item" v-if="index > 1 && expendItemObj[2].isExpend">{{interview_addr.city_name}}{{interview_addr.district_name}}{{interview_addr.street_name}}{{interview_addr.address}}</li>
                        </template>
                    </ul>
                    <div class="mod-flexible needsclick" :class="{active: expendItemObj[2].isActive, toggle: expendItemObj[2].isExpend}" @click="moreInfo(2)">{{expendItemObj[2].expText}}</div>
                    
                </div>
            </div>
            <div class="product-company mod-column bc-main com-space" v-if="!!detailObj.corp_name && isShow">
                <div class="mod-column-head">
                    <h2 class="mod-column-title">公司信息</h2>
                </div>
                <div class="mod-column-body">
                    <dl class="product-dlist mod-flex">
                        <dt class="product-dlist-dt">公司名称</dt>
                        <dd class="product-dlist-dd mod-flex-item">
                            <p><i class="icon icon-cert" v-if="detailObj.is_company_certified == 1">企业认证</i><a href="javascript:;">{{detailObj.corp_name}}</a></p>
                        </dd>
                    </dl>
                </div>
            </div>
            <div class="product-complain bc-main com-space" v-if="!detailObj.applyed_status && isShow">
                <div class="product-tips">
                    <p class="mod-flex-item">防骗警示：未标明收费的职位不会收取任何费用，若商家要求缴纳费用或押金，请提高警惕并第一时间向我们举报！</p>
                </div>
            </div>
            <div class="product-complain bc-main com-space" v-if="detailObj.applyed_status && isShow">
                <div class="product-tips mod-flex">
                    <p class="mod-flex-item">正规兼职不会收取任何费用！如遇虚假职位请投诉</p>
                    <a href="javascript:;" class="fc-blue" @click="goToComplain(detailObj.id, detailObj.applyed_status.list_status, detailObj.applyed_status.list_status_str, detailObj.title)">去投诉</a>
                </div>
            </div>
            <div class="product-list mod-column bc-main com-space" v-if="!!detailObj.recommendList && detailObj.recommendList.length > 0">
                <div class="mod-column-head">
                    <h2 class="mod-column-title">推荐职位</h2>
                </div>
                <div class="mod-column-body">
                    <ul class="mod-list">
                        <li class="mod-list-item com-border-bottom" v-for="(recommend, index) in detailObj.recommendList">
                            <a href="javascript:;" class="mod-list-info product-info" @click="goToJobDetail(index, recommend)">
                                <h3 class="product-title">
                                        <span :class="{readed: recommend.show}">
                                            {{recommend.title}}
                                        </span>
                                    </h3>
                                    <div class="product-price">
                                        <span class="fl">
                                            <b class="fc-red">{{recommend.salary}}</b>元/{{recommend.salary_type_str}}
                                        </span>
                                    </div>
                                    <div class="product-meta">
                                        <span class="fl fc-gray"><i class="icon icon-location-sm"></i>{{recommend.post_area}}</span>
                                        <span class="fl fc-gray"><i class="icon icon-date-sm"></i>{{recommend.date}}</span>
                                    </div>
                                    <div class="product-label" :class="{readed: recommend.show}">
                                        <i class="icon icon-danbao" v-if="recommend.is_wages_guarantee == 1">企业担保</i>
                                        <i class="fl line icon-label" v-if="!!recommend.payment_type_str" :title="recommend.payment_type_str">{{recommend.payment_type_str}}</i>
                                        <i v-if="recommend.ad_types==1" class="icon icon-remen" title="热门">热门</i>
                                        <i v-if="recommend.ad_types==2" class="icon icon-renqi" title="人气">人气</i>
                                        <i v-if="recommend.ad_types==3" class="icon icon-jizhao" title="急招">急招</i>
                                        <i v-if="recommend.has_subsidy==1" class="icon icon-tuijian" title="推荐">推荐</i>
                                        <i v-if="recommend.ad_types == 0 && recommend.has_subsidy == 0 && !!recommend.operate_label && recommend.operate_label.indexOf('zhipin') != -1" class="icon icon-zhipin" title="直聘">直聘</i>
                                    </div>
                                <!-- <h3 class="product-title">
                                    <span :class="{readed: recommend.show}">
                                        <i class="icon icon-jizhao" v-if="recommend.ad_types==3">急招</i>
                                        <i class="icon icon-tuijian" v-if="recommend.has_subsidy == 1">推荐</i>
                                        <i class="icon icon-remen" v-if="recommend.ad_types == 1">热门</i>
                                        <i class="icon icon-renqi" v-if="recommend.ad_types == 2">人气</i>
                                        {{recommend.title}}
                                    </span>
                                </h3>
                                <div class="product-meta">
                                    <span class="fl fc-gray"><i class="icon icon-location-sm"></i>{{recommend.post_area}}</span>
                                    <span class="fl fc-gray"><i class="icon icon-date-sm"></i>{{recommend.date}}</span>
                                </div>
                                <div class="product-meta" :class="{readed: recommend.show}">
                                    <span class="fl" v-if="recommend.salary > 0">
                                        <b class="fc-red">{{recommend.salary > 0 ? recommend.salary : recommend.salary_unit}}</b>元/{{recommend.salary > 0 ? recommend.salary_type_str : recommend.unit_type_str}}
                                    </span>
                                    <span class="fl line" v-if="!!recommend.payment_type_str">{{recommend.payment_type_str}}</span>
                                    <i class="icon icon-danbao" v-show="recommend.is_deposit==1 || recommend.cooperation_type==2 || recommend.cooperation_type==3 || recommend.cooperation_type==4 || recommend.cooperation_type==5 || recommend.cooperation_type==6">企业担保</i>
                                </div> -->
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- detail end -->
        </section>
    </div>
    <!-- page end -->
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCdetailPage from 'clientApi/KCdetailPage'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCcache from 'clientApi/KCcache'
    import KCucApi from 'clientApi/KCucApi'
    import KCwidget from 'clientApi/KCwidget'
    import KCucPage from 'clientApi/KCucPage'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCcityApi from 'clientApi/KCcityApi'
    import KClocationApi from 'clientApi/KClocationApi'
    
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import detailLoading from 'components/detail-loading/detail-loading'
    import * as detailLoading_mt from 'components/detail-loading/detail-loading-mutation-types'

    /**
     *  组件实例对象
     */
    export default {
        components: {
            detailLoading
        },
        data () {
            return {
                expendItemObj: {
                    0: {
                        isExpend: true,
                        expText: '',
                        isActive: false,
                        isHide: false
                    },
                    1: {
                        isExpend: true,
                        expText: '',
                        isActive: false,
                        isHide: false
                    },
                    2: {
                        isExpend: true,
                        expText: '',
                        isActive: false,
                        isHide: false
                    }
                },
                detailObj: {
                    post_type: '',
                    special_adv_type: '',
                    interview_addr_list: [],
                    is_interview: '',
                    working_hours_arr: {
                        '1': [],
                        '2':[]
                    },
                    post_addr_list: [
                        {
                            city_name: '',
                            district_name: '',
                            street_name: '',
                            address:''
                        }
                    ]
                },
                interviewAddrCount: '',
                isNoNetwork: false,
                hasUrdData: true,
                pushtjStr: '',
                isShow: false,
                domain: 'bj',
                nearestDistance: !!Util.getQueryString('distance') ? decodeURIComponent( Util.getQueryString('distance') ) : -1,
                from: Util.getQueryString('from'),
                readedFrom: Util.getQueryString('readed_from'),//获取进入详情页的入口
                urd_data: Util.getQueryString('urdData'),
                id: Util.getQueryString('job_id')//'103931';
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
            initFun () {
                let self = this;

                let push_id = Util.getQueryString('push_id') || '-',
                    messageType = Util.getQueryString('messageType') || '-',
                    business_date = Util.getQueryString('business_date') || '-',
                    push_channel = Util.getQueryString('push_channel') || '-',//v3.2
                    uuid='-',
                    dmuser='-',
                    city_id='-';
                
                //获取职位基本信息
                KCloggerApi.addLog('0','职位详情页_展现量&来源&{"来源":"' + self.from + '"}');
                self.saveReadedId(self.id);//对详情页的职位id进行存储，用于标记已读状态
                // console.log(self.id)

                if(self.urd_data != null){
                    // self.isShowBlandTitle = false;
                    if(Util.OS() == 'ios'){
                        self.urd_data = decodeURIComponent( self.urd_data );
                    }else{
                        self.urd_data = decodeURIComponent( decodeURIComponent(self.urd_data) );
                    }

                    var urd_data_arr = self.urd_data.split('&');
                    var key_value_arr = [];
                    for (let param of urd_data_arr) {
                        var param_item = param.split('=');
                        key_value_arr.push(param_item);
                    }
                    // console.log(key_value_arr);
                    var urd_data_map = new Map(key_value_arr);
                    
                    self.detailObj.title = urd_data_map.get('title');
                    self.detailObj.job_type_str = urd_data_map.get('job_type_str');
                    self.detailObj.hire_number = urd_data_map.get('hire_number');
                    self.detailObj.payment_type_str = urd_data_map.get('payment_type_str');
                    self.detailObj.salary = urd_data_map.get('salary');
                    self.detailObj.salary_type_str = urd_data_map.get('salary_type_str');
                    self.detailObj.has_subsidy = urd_data_map.get('has_subsidy');
                    self.detailObj.is_wages_guarantee = urd_data_map.get('is_wages_guarantee');
                    self.detailObj.ad_types = urd_data_map.get('ad_types');                
                }

                // console.log(self.detailObj);

                KCclientInfo.getNetworkType(function(networkData){
                    if (networkData.network != 'invalid') {
                        self.loadData();
                        window.loadData = function(){
                            self.loadData();
                        }
                        KCucApi.getUserInfo(function(data){
                            if (data.userId != 0) {
                                KCloggerApi.addLog('0','职位详情页_展现量&已登录&{"详情页展现":"已登录"}');
                                dmuser = data.userId;
                                // console.log(self.from);
                                if (self.from == 'push') { //预留字段
                                    KCclientInfo.getDeviceToken(function(tokenData){
                                        uuid = tokenData.deviceToken;
                                        KCcityApi.getValidCity(function(info){
                                            if (info) {
                                                if (info.citydomain != '0') {
                                                    self.domain = info.citydomain;
                                                    city_id = info.cityid;
                                                }
                                            }
                                            self.pushtjStr='@push_id='+push_id+'@uuid='+uuid+'@dmuser='+dmuser+'@city='+city_id+'@messageType='+messageType+'@business_date'+business_date+'push_channel'+push_channel;
                                            // console.log(self.pushtjStr);
                                        });
                                    });
                                }
                            } else {
                                KCloggerApi.addLog('0','职位详情页_展现量&未登录&{"详情页展现":"未登录"}');
                            }
                        });
                        // self.getCacheData(self.id);
                    } else {
                        self.isNoNetwork = true;
                        self.isShow = false;
                    }
                });
                 /**
                 * 获取页面唯一标记
                 * @param  {[type]} (data [description]
                 * @return {[type]}       [description]
                 */
                KCdetailPage.getWebViewID((data)=>{
                    KCcache.setCache('detailWebViewID',{'WebViewID': data}, 3 * 24 * 60 * 60);
                });
            },
            /**
             * 获取职位详情数据
             * @method loadData
             * @public
             * @return {Null} void
             */
            loadData () {
                let self = this;
                self.isNoNetwork = false;
                // self.setLoadingDisplay(true);
                self.$store.commit(detailLoading_mt.SET_DISPLAY, true);
                Util.ajax({
                    apiPath: '/api/v3/client',
                    url:'/detail/' + self.id,
                    // url:'/index?citydomain=bj',
                    timeout:10000,
                    ctrlStatus: {
                        loading: 1,
                        cache: !!self.urd_data,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        // console.log(data)
                        if (!!data && data.code == 1000) {
                            // self.setLoadingDisplay(false);
                            self.$store.commit(detailLoading_mt.SET_DISPLAY, false);
                            
                            //处理职位描述
                            if (!!data.data.post_detail_content && data.data.post_detail_content.length != 0) {
                                data.data.post_detail_content = data.data.post_detail_content.replace(/\r\n|\n/g,'<br />');
                            }
                            
                            //处理工作时间次日格式
                            for (let key in data.data.working_hours_arr)
                            {
                                data.data.working_hours_arr[key].forEach((hour) => {
                                    if (Util.compareTime(hour.am_time, hour.pm_time) == 1 && hour.pm_time != '00:00') {
                                        hour.pm_time = `次日${hour.pm_time}`;
                                    }
                                });
                            }

                            var tj_Str = '/jianzhi/' + data.data.job_type + '/detail/index@city=' + data.data.cityInfo.id + '&post_id='+ data.data.id + '&post_title=' + data.data.title + '&is_deposit=' + data.data.is_deposit + '&cooperation_type=' + data.data.cooperation_type + '&is_wages_guarantee=' + data.data.is_wages_guarantee + '&reward_flag=' + data.data.reward_flag + '&ad_type='+data.data.ad_types + '&source=' + data.data.source;
                            KCloggerApi.addLog('1',tj_Str);

                            //构建职位详情跳转参数
                            let showStr = '';
                            for (var i = 0; i < data.data.recommendList.length; i++) {

                                if (i + 1 == data.data.length) {
                                    showStr += `{"id":${data.data.recommendList[i].id},"ca_kw":${(i+1)}}`;
                                } else {
                                    showStr += `{"id":${data.data.recommendList[i].id},"ca_kw":${(i+1)}},`;
                                }

                                //添加show
                                data.data.recommendList[i].show = false;

                                data.data.recommendList[i].urd_data = encodeURIComponent("title=" + data.data.recommendList[i].title + "&hire_number=" + data.data.recommendList[i].hire_number + 
                                    "&payment_type_str=" + data.data.recommendList[i].payment_type_str + "&job_type_str=" + data.data.recommendList[i].job_type_str + 
                                        "&salary=" + data.data.recommendList[i].salary + "&salary_type_str=" + data.data.recommendList[i].salary_type_str + "&is_wages_guarantee=" + data.data.recommendList[i].is_wages_guarantee + "&has_subsidy=" + data.data.recommendList[i].has_subsidy + "&ad_types=" + data.data.recommendList[i].ad_types);
                            }
                            KCloggerApi.addLog('2','@atype=show@ca_name=doumi@ca_source=app@ca_from=post_show@show_post_id='+ showStr);

                            //不管是不是从附近兼职跳转来的都去计算距离
                            if (self.detailObj.post_addr_list.length > 0) {
                                self.computeDistance();
                            }
                            
                            self.headImage = data.data.post_addr_image;

                            self.detailObj = data.data;

                            self.descController();

                            /**
                            *给客户端准备的数据 
                            *start
                            */
                            //工作地址列表
                            function postList(){
                                var postListLen = 0;
                                if (!!data.data.post_addr_list) {
                                    postListLen = data.data.post_addr_list.length;
                                }
                                var addList = data.data.post_addr_list;
                                var arr = [];
                                for (var i = 0; i < postListLen; i++) {
                                    var json = {};
                                    json.name = addList[i].city_name + addList[i].district_name + addList[i].street_name + addList[i].address;
                                    json.postId = addList[i].id;
                                    arr.push(json);
                                }
                                return arr;
                            };

                            window.jobInfo = function(){
                                return {
                                    jobId: data.data.id,
                                    postList: postList(),//工作地址array
                                    contact_phone: data.data.contact_phone,
                                    contact_person: data.data.contact_person,//联系人
                                    consulting: data.data.consulting, //所有联系方式
                                    source: data.data.source, //帖子来源
                                    cooperation_type: data.data.cooperation_type,//合作类型，包招等
                                    isCollectedPost: data.data.isCollectedPost, //收藏状态
                                    company_is_active: data.data.company_is_active, //抓取帖商家激活状态
                                    user_id: data.data.user_id, //用户id
                                    title: data.data.title, //帖子title
                                    job_type: data.data.job_type, //帖子类型
                                    city: data.data.cityInfo.domain,//发帖城市
                                    reward_flag: data.data.reward_flag, //帖子有奖状态
                                    im_group_id: data.data.im_group_id, //创建的讨论组id
                                    extra_requirement: data.data.extra_requirement, //限制信息字段
                                    is_resume_complete: data.data.is_resume_complete, //简历是否完整
                                    ad_types: data.data.ad_types, //是否为黄展帖子
                                    apply_show_str: data.data.apply_show_str, // 报名button展示文案
                                    from: self.from
                                }
                            };
                            KCdetailPage.dataDownloadFinished();

                            self.isShow = true;

                            //更改推荐列表职位样式
                            KCcache.getMemoryCache('detail_readedIds',(arr)=>{
                                for (let i = 0 ;i < data.data.recommendList.length ; i++) {
                                    for (let a = 0 ; a < arr.length ; a++) {
                                        if (arr[a] == data.data.recommendList[i].id) {
                                            data.data.recommendList[i].show = true
                                        }
                                    }
                                }
                            });
                        } else {
                            if (self.urd_data != null) {
                                self.isNoNetwork = true;
                                self.isShow = false;
                            } else {
                                KCucPage.loadPageStatus('loadFailed');
                            }
                        }
                    },
                    error:function(xhr, status){
                        // self.setLoadingDisplay(false);
                        self.$store.commit(detailLoading_mt.SET_DISPLAY, false);
                        if (self.urd_data != null) {
                            self.isNoNetwork = true;
                            self.isShow = false;
                        }
                    },
                    noNetwork: function(){
                        // self.setLoadingDisplay(false);
                        self.$store.commit(detailLoading_mt.SET_DISPLAY, false);
                        if (self.urd_data != null) {
                            self.isNoNetwork = true;
                            self.isShow = false;
                        }
                    }
                });
            },
            goToTagPage (tagId, info) {
                let self = this;
                KCloggerApi.addLog('0','职位详情页_标签点击&' + info + '&{"详情页":"' + info + '"}'); 

                if (tagId == 0 ) {//工资担保，企业担保 || tagId == 1 v3.3.0直接跳转工资担保页面（李灵溪）
                    // @atype=click@ca_name=doumi@ca_source=app@from=postlist_ss@ca_from=gzbz@post_id=[职位id]
                    let href = `https://m.doumi.com/qydb/${self.domain}`;
                    // if (tagId == 1) {
                    //     href = 'https://sta.doumi.com/att/project/touch/guarantee_payment/index.html';
                    // }
                    window.location.href='doumi://browser/' + encodeURIComponent(href);
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + self.from + '@ca_from=gzbz@post_id=' + self.id + self.pushtjStr);
                } else if (tagId == 2) {//推荐
                    window.location.href = 'doumi://joblist?key=special_job&value=2&from=tuijian';
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + self.from + '@ca_from=tuijian@post_id=' + self.id + self.pushtjStr);
                } else if (tagId == 3) {//急招 
                    window.location.href = 'doumi://joblist?key=special_job&value=1&from=jizhao';
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + self.from + '@ca_from=jizhao@post_id=' + self.id + self.pushtjStr);
                }
            },
            /**
             * 跳转到职位详情页
             * @method goToJobDetail
             * @public
             * @return {Null} void
             */
            goToJobDetail (index, item) {
                var self = this;
                item.show = true;
                index = index + 1;
                KCloggerApi.addLog('0','职位详情页_推荐职位点击&点击推荐职位&{"职位位置":"' + index + '"}');
                // @atype=click@ca_name=doumi@ca_source=app@from=postlist_sy@ca_from=postlist_tuijian@post_id=[职位id]@ca_kw=[帖子排序]
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + self.from + '@ca_from=postlist_tuijian@ca_kw='+ index +'@post_id=' + item.id + self.pushtjStr); 
                window.location.href = 'doumi://jobdetail?job_id=' + item.id + '&urdData=' + item.urd_data + '&from=tjw'+'&readed_from=detail';
            },
            /**
             * 展开/收缩
             * @method moreInfo
             * @public
             * @return {Null} void
             */
            moreInfo (type) {
                let self = this;

                if (self.expendItemObj[type].isExpend) {
                    self.expendItemObj[type].expText = `展开${type == '2' ? self.interviewAddrCount : ''}`;
                    self.expendItemObj[type].isExpend = false;
                } else {
                    self.expendItemObj[type].expText = '收起';
                    self.expendItemObj[type].isExpend = true;
                }
            },
            /**
             * 根据需要显示收起按钮
             * @method descController
             * @public
             * @return {Null} void
             */
            descController(){
                let self = this;
                self.$nextTick(function(){
                    //处理面试地点
                    self.interviewAddrCount = '';
                    
                    if (self.detailObj.interview_addr_list.length > 2) {
                        self.interviewAddrCount = `(${self.detailObj.interview_addr_list.length})`;
                        self.expendItemObj[2].expText = `展开${self.interviewAddrCount}`;
                        self.expendItemObj[2].isExpend = false;
                        self.expendItemObj[2].isHide = true;
                        self.expendItemObj[2].isActive = true;
                    }

                    //处理其他
                    let moreItems = $('.desc-text');
                    moreItems.forEach((moreItem, index) => {
                        let lineHeight = parseInt($(moreItem).css('line-height').split('px')[0]);
                        let rowCount = 4;
                        if (index == 0) {
                            rowCount = 10;
                        }
                        let triggerHeight = lineHeight * rowCount;
                        let contentHeight = $(moreItem).height();

                        // console.log(contentHeight + ',' +triggerHeight)
                       
                        if(contentHeight > triggerHeight){
                            // 显示收起按钮
                            self.expendItemObj[index].expText = '展开';
                            self.expendItemObj[index].isExpend = false;
                            self.expendItemObj[index].isHide = true;
                            self.expendItemObj[index].isActive = true;
                        }
                    });
                });
            },
            /**
             * 计算距离，根据距离排序
             * @method computeDistance
             * public
             * @return {Null} void
             */
            computeDistance () {
                let self = this;
                KClocationApi.getCachedLocation((data) => {
                    if (!!data && data.lat && data.lon) {
                        let currentLocation = {'lat': data.lat, 'lng': data.lon};
                        let distance = -1;
                        if (!!self.detailObj.post_addr_list && self.detailObj.post_addr_list.length == 1 && self.detailObj.post_addr_list[0].lat !== undefined && self.detailObj.post_addr_list[0].lng !== undefined) {
                            distance = Util.getDistance(currentLocation, {'lat': self.detailObj.post_addr_list[0].lat, 'lng': self.detailObj.post_addr_list[0].lng});
                        } else if (!!self.detailObj.post_addr_list && self.detailObj.post_addr_list.length > 1) {
                            self.detailObj.post_addr_list.sort((addr1, addr2) => {
                                if (addr1.lat !== undefined && addr1.lng !== undefined) {
                                    addr1.distance = Util.getDistance(currentLocation, {'lat': addr1.lat, 'lng': addr1.lng});
                                } else {
                                    addr1.distance = -1;
                                }
                                if(addr2.lat !== undefined && addr2.lng !== undefined) {
                                    addr2.distance = Util.getDistance(currentLocation, {'lat': addr2.lat, 'lng': addr2.lng});
                                } else {
                                    addr2.distance = -1;
                                }
                                
                                return addr1.distance - addr2.distance;
                            });
                            distance = self.detailObj.post_addr_list[0].distance;
                            
                        }

                        //如果是从附近兼职跳进的，直接更改首项的距离
                        if (self.nearestDistance != -1) {
                            self.detailObj.post_addr_list[0].distance = self.nearestDistance;
                        } else {
                            if (distance != -1) {
                                if (distance >= 1000) {
                                    distance = `${(distance / 1000).toFixed(1)}km`;
                                } else {
                                    distance = `${parseInt(distance)}m`;
                                }
                            }
                            
                            self.nearestDistance = distance;
                        }
                    }
                    //如果工作地点大于1个，就将全部工作地点缓存以来，供工作地点页面使用
                    let cachePostAddr = {
                        nearest_distance: self.nearestDistance,
                        head_image: self.detailObj.post_addr_image,
                        post_addr_list: self.detailObj.post_addr_list
                    };

                    KCcache.setMemoryCache(`detail_post_addrs_${self.detailObj.id}`, cachePostAddr);
                });
            },
            /**
             * 跳转去投诉
             * @method goToComplain
             * public
             * @return {Null} void
             */
            goToComplain (post_id, status, status_str, post_title) {
                let self = this;
                KCloggerApi.addLog('0', '投诉按钮点击&来源&{"来源":"报名后职位详情页"}');
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=complain@from=' + self.from + '@post_id=' + post_id);
                window.location.href = `doumi://complain?id=${post_id}&status=${status}&status_str=${status_str}&from=${self.from}&fromForComplain='detail&post_title=${post_title}'`;
            },
            /**
             * 跳转去全部工作地址
             * @method goToAllAddress
             * public
             * @return {Null} void
             */
            goToAllAddress () {
                let self = this;
                window.location.href = `doumi:///detail-address.html?post_id=${self.detailObj.id}`;
            },
            /**
             * 存储从各个入口进入的职位id用于标记已读状态
             * @method saveReadedId
             * public
             * @return {Null} void
             */
            saveReadedId(dataId){
                var self = this;
                var indexId = [];
                if(window.localStorage){
                    var arr = window.localStorage.getItem(self.readedFrom+'_readedIds');
                    if(arr){
                        arr = arr.split(',');
                    }else{
                        arr = [];
                    }
                    arr.push(dataId);
                    arr = Array.from(new Set(arr));
                    window.localStorage.setItem(self.readedFrom+'_readedIds',arr);
                }
                KCcache.getMemoryCache(self.readedFrom+'_readedIds',(data)=>{
                    if(data){
                        indexId = data;
                    }
                    indexId.push(dataId);
                    indexId = Array.from(new Set(indexId));
                    KCcache.setMemoryCache(self.readedFrom+'_readedIds',indexId);
                });

            },
            upDateGoBack(){
                KCucPage.updateTitleBar({
                    backAction: 'checkChange', //安卓
                    leftDisplay: false,
                    leftText: '',
                    leftAction: 'checkChange', //ios
                    rightDisplay: false,
                    rightText: '',
                    rightAction: ''
                });
                window.checkChange = ()=>{
                    KCucPage.goBack();
                }
            }
        },
        beforeCreate() {

        },
        created() {
            this.initFun();
        }
    }
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/btn.css"></style>
<style src="static/css/detail_v2.css"></style>
<style type="text/css">
    .readed{
        color:#808080;
    }
    /* remark
    ---------------------------------- */
    .desc-text {

        /*height: 22px;*/
        overflow: hidden;
    }

    .desc-text.js-hide {
        height: 66px;
    }

    .desc-text.js-hide-wordhour {
        height: 80px;
    }

    .desc-text.js-hide-jobdesc {
        height: 220px;
    }

    .desc-text.js-hide-interviewaddr {
        height: 80px;
    }

    .desc-text.js-show {
        height: auto;
    }

    .title-title {
        background: #f5f5f5;
        width: 140px;
        margin: 10px 0;
        height: 30px;
    }

    .title-tag {
        background: #f5f5f5;
        width: 60px;
        height: 20px;
    }

    .title-price {
        background: #f5f5f5 !important;
        width: 60px;
    }

    .tag-a {
        background: #f5f5f5;
        width: 95%;
        height: 20px;
    }

    .fade-enter {

        /*animation: fade-in .1s;*/
        opacity: 1;
    }

    .fade-leave {
        animation: fade-out .1s;
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }

        10% {
            opacity: 0.1;
        }

        20% {
            opacity: 0.2;
        }

        30% {
            opacity: 0.3;
        }

        40% {
            opacity: 0.4;
        }

        50% {
            opacity: 0.5;
        }

        60% {
            opacity: 0.6;
        }

        70% {
            opacity: 0.7;
        }

        80% {
            opacity: 0.8;
        }

        90% {
            opacity: 0.9;
        }

        100% {
            opacity: 1;
        }

    }

    @keyframes fade-out {
        0% {
            opacity: 1;
        }

        10% {
            opacity: 0.9;
        }

        20% {
            opacity: 0.8;
        }

        30% {
            opacity: 0.7;
        }

        40% {
            opacity: 0.6;
        }

        50% {
            opacity: 0.5;
        }

        60% {
            opacity: 0.4;
        }

        70% {
            opacity: 0.3;
        }

        80% {
            opacity: 0.2;
        }

        90% {
            opacity: 0.1;
        }

        100% {
            opacity: 0;
        }

    }

    .offline-noData {
        text-align: center;
        padding: 0 12px;
        padding-top: 25%;
    }

    .offline-noData .noData-txt {
        color: #808080;
        font-size: 14px;
    }

    .noData-btn {
        padding: 0 28px;
        margin-top: 32px;
    }

    .loading {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 9999;
    }
</style>