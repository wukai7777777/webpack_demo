<template>
    <!-- page start -->
    <div class="mod-page" v-cloak>
        <!-- section start -->
        <section class="mod-content detail">
            <div class="product-detail bc-main com-border-bottom" v-if="!!taskDetailData.title">
                <div class="product-info" :class="{'rise': taskDetailData.tag_status == 1}">
                    <h1 class="product-title">{{taskDetailData.title}}</h1>
                    <div class="product-meta">
                        <span class="fl line">任务剩余{{taskDetailData.left_stock}}次</span>
                        <span class="fl line">{{taskDetailData.deadline}}</span>
                    </div>
                    <div class="product-price"><b>{{taskDetailData.amount}}</b>元<del v-if="taskDetailData.tag_status == 1">{{taskDetailData.old_amount}}元</del></div>
                </div>
            </div>
            <detailLoading></detailLoading>
            <section class="mod-content offline-noData" v-show="isNoNetwork">
                <div class="noData-txt">加载失败，请重试</div>
                <div class="noData-btn">
                    <button class="btn btn-primary btn-large js-touch-state" type="button" @click="getTaskDetial()">重试</button>
                </div>
            </section>
            <div class="product-pannel bc-main com-border-bottom" v-if="isShowContent">
                <div class="product-option com-border-bottom">
                    <dl class="product-dlist mod-flex">
                        <dt class="product-dlist-dt">任务总数：</dt>
                        <dd class="product-dlist-dd mod-flex-item">
                            <p>{{taskDetailData.total_number}}次</p>
                        </dd>
                    </dl>
                    <dl class="product-dlist mod-flex">
                        <dt class="product-dlist-dt">审核时间：</dt>
                        <dd class="product-dlist-dd mod-flex-item">
                            <p>最多{{taskDetailData.audit_type}}小时</p>
                        </dd>
                    </dl>
                    <dl class="product-dlist mod-flex">
                        <dt class="product-dlist-dt">任务限制：</dt>
                        <dd class="product-dlist-dd mod-flex-item">
                            <p>{{taskDetailData.task_limit}}</p>
                        </dd>
                    </dl>
                </div>
                <div class="product-option com-border-bottom">
                    <dl class="product-dlist">
                        <dt class="product-dlist-dt">任务介绍</dt>
                        <dd class="product-dlist-dd">
                            <p class="desc-text" :class="{'js-show': isExpend, 'js-hide': isHide}" v-html="taskDetailData.description"></p>
                            <div class="mod-flexible needsclick" :class="{active: isActive, toggle: isExpend}" @click="moreDes()">{{expText}}</div>
                        </dd>
                    </dl>
                </div>
            </div>
            <div class="product-pannel product-step bc-main com-border-bottom" v-if="isShowContent && !!taskDetailData.steps && taskDetailData.steps.length > 0">
                <div class="product-option com-border-bottom">
                    <dl class="product-dlist">
                        <dt class="product-dlist-dt">任务步骤</dt>
                        <dd class="product-dlist-dd">
                            <ol class="mod-list com-border-top">
                                <li class="mod-list-item" v-for="step in taskDetailData.steps">
                                    <h3 class="product-step-title">第{{step.numBig}}步</h3>
                                    <p class="product-step-ds" v-html="step.desc"></p>
                                    <div class="product-step-opt">
                                        <template v-if="!!step.images && step.images.length > 0" >
                                            <div class="product-step-opt-item" v-for="(image, index) in step.images">
                                                <img :src="image.small" class="product-step-image" alt="" @click="lookBigPic(step.images, index)">
                                            </div>
                                        </template>
                                        <template v-if="!!step.urls && step.urls.length > 0">
                                            <div class="product-step-opt-item" v-for="url in step.urls">
                                                <a href="javascript:;" class="product-step-link" @click="goToLink(url)">链接</a>
                                            </div>
                                        </template>
                                    </div>
                                </li>
                            </ol>
                        </dd>
                    </dl>
                </div>
            </div>
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
    import KCclientInfo from 'clientApi/KCclientInfo'
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCucApi from 'clientApi/KCucApi'
    import KCclientUI from 'clientApi/KCclientUI'
    
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
                taskDetailData: {},
                isExpend: true,
                expText: '展开',
                isActive: false,
                isHide: false,
                urd_data: Util.getQueryString('urdData'),
                isNoNetwork: false,
                isShowContent: false
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

                if(self.urd_data != null){
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
                    
                    var urd_data_map = new Map(key_value_arr);
                    
                    self.taskDetailData.tag_status = urd_data_map.get('tag_status');
                    self.taskDetailData.title = urd_data_map.get('title');
                    self.taskDetailData.left_stock = urd_data_map.get('left_stock');
                    self.taskDetailData.deadline = urd_data_map.get('deadline');
                    self.taskDetailData.amount = urd_data_map.get('amount');
                    self.taskDetailData.old_amount = urd_data_map.get('old_amount');
                }

                self.getTaskDetial();

                window.loadData=function(){
                    self.getTaskDetial();
                };

                window.leftStock=function(){
                    let left_stock = parseInt(self.taskDetailData.left_stock);
                    if(left_stock > 0){
                        left_stock = left_stock - 1;
                    }else if(left_stock == 0){
                        left_stock = 0
                    }
                    self.taskDetailData.left_stock = left_stock;
                };

                KCucApi.getUserInfo(function (data) {
                    if(!!data.userId){
                        KCloggerApi.addLog('0','特工详情页_展现&登录状态&{"登录状态":"已登录"}');
                    }else{
                        KCloggerApi.addLog('0','特工详情页_展现&登录状态&{"登录状态":"未登录"}');
                    }
                });
            },
            /**
             * 获取特工详情数据
             * @method getTaskDetial
             * @public
             * @return {Null} void
             */
            getTaskDetial () {
                let self = this;
                self.isNoNetwork = false;
                // self.setLoadingDisplay(true);
                self.$store.commit(detailLoading_mt.SET_DISPLAY, true);
                let cityId = Util.getQueryString('city_id') || '12';
                let taskId = Util.getQueryString('task_id') || '1001';

                Util.ajax({
                    url: '/onlinetask/taskdetail?cityid=' + cityId + '&taskid=' + taskId,
                    type: 'POST',
                    timeout: 10000,
                    ctrlStatus: {
                        loading: 1,
                        cache: !!self.urd_data,
                        errNum: 0,
                        netNum: 0,
                        isToastErr: Util.OS() == 'android' ? false : true
                    },
                    success: function (data) {
                        // console.log(data)
                        // self.setLoadingDisplay(false);
                        self.$store.commit(detailLoading_mt.SET_DISPLAY, false);
                        if(!!data && data.data && data.code == 1000){
                            //任务限制转换  标识-文字说明
                            switch (data.data.task_limit) {
                                case '0':
                                    data.data.task_limit = '每人一次';
                                    break;
                                case '1':
                                    data.data.task_limit = '每人每天一次';
                                    break;
                                case '2':
                                    data.data.task_limit = '不限次数';
                                    break;
                            }

                            //审核时间转换  秒-小时
                            data.data.audit_type /= 3600;

                            //链接地址转换
                            if(!!data.data.steps && data.data.steps.length > 0){
                                data.data.steps.forEach(function (step, i) {
                                    step.numBig = Util.arabToNumerals(i + 1);
                                    if (!!step.urls && step.urls.length > 0) {
                                        step.urls.forEach(function (url, j) {
                                            data.data.steps[i].urls[j] = encodeURIComponent(url);
                                        });
                                    }
                                    if (!!step.images && step.images.length > 0) {
                                        step.images.forEach(function (image, j) {
                                            data.data.steps[i].images[j].small = image.small.replace(/_0-0_/,'_56-56_');
                                        });
                                    } 
                                });
                            }
                            
                            window.taskInfo=function(){
                                return {
                                    id: data.data.id,
                                    listing_status: data.data.listing_status,
                                    btn_status: data.data.btn_status,
                                    btn_text: data.data.btn_text,
                                    finish_time: data.data.finish_time,
                                    audit_end_time: data.data.audit_end_time,
                                    task_type: data.data.task_type
                                }
                            };

                            let tj_Str = '/jianzhi/dmtg/' + data.data.task_type + '/detail/index@city=' + data.cityInfo.id + '&task_id='+data.data.id + '&task_title=' + data.data.title + '&task_source=' + data.data.source;
                            KCloggerApi.addLog('1',tj_Str);

                            self.taskDetailData = data.data;

                            self.descController();

                            KCucPage.dataDownloadFinished();

                            KCloggerApi.addLog('0','特工详情页_展现&任务状态&{"特工任务状态":"' + data.data.btn_text + '"}');

                            self.isShowContent = true;
                        }else{
                            if (self.urd_data != null) {
                                self.isNoNetwork = true;
                                self.isShowContent = false;
                            } else {
                                KCucPage.loadPageStatus('loadFailed');
                            }
                        }
                    },
                    error: function (xhr, status) {
                        // self.setLoadingDisplay(false);
                        self.$store.commit(detailLoading_mt.SET_DISPLAY, false);
                        if (self.urd_data != null) {
                            self.isNoNetwork = true;
                            self.isShowContent = false;
                        }
                    },
                    noNetwork: function () {
                        // self.setLoadingDisplay(false);
                        self.$store.commit(detailLoading_mt.SET_DISPLAY, false);
                        if (self.urd_data != null) {
                            self.isNoNetwork = true;
                            self.isShowContent = false;
                        }
                    }
                });
            },
            /**
             * 查看大图
             * @method lookBigPic
             * @public
             * @return {Null} void
             */
            lookBigPic(imgUrls, index) {
                let imgUrlArr = [];
                imgUrls.forEach(function(item, i){
                    imgUrlArr.push(item.big);
                });
                KCclientUI.bigPicturePreview('', imgUrlArr, index);
            },
            /**
             * 跳转链接
             * @method goToLink
             * @public
             * @return {Null} void
             */
            goToLink (url) {
                window.location.href = 'doumi://link/' + url;
            },
            /**
             * 展开收起
             * @method moreDes
             * @public
             * @return {Null} void
             */
            moreDes () {
                let self = this;
                if (self.isExpend) {
                    self.expText = '展开';
                    self.isExpend = false;
                } else {
                    self.expText = '收起';
                    self.isExpend = true;
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
                    let lineHeight = parseInt($('.desc-text').css('line-height'));
                    let triggerHeight = lineHeight * 3;
                    let contentHeight = $('.desc-text').height() - 4;
                    if(contentHeight > triggerHeight){
                        // 显示收起按钮
                        self.expText = '展开';
                        self.isExpend = false;
                        self.isHide = true;
                        self.isActive = true;
                    }
                });
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
<style src="static/css/online_detail.css"></style>
<style type="text/css">
    .desc-text{
        /*height: 22px;*/
        overflow: hidden;
    }
    .desc-text.js-hide{
        height: 66px;
    }
    .desc-text.js-show{
        height: auto;
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

    .btn {
        display: inline-block;
        -webkit-box-sizing: border-box;
        -ms-box-sizing: border-box;
        box-sizing: border-box;
        background-clip: padding-box;
        border-radius: 4px;
        border: 0 none;
        font: normal 14px/32px helvetica neue, helvetica, arial, hiragino sans gb, microsoft yahei, sans-serif;
        text-align: center;
        text-decoration: none;
        padding: 0;
        cursor: pointer;
        -webkit-appearance: none;
    }

    .btn-primary {
        background-color: #fc0;
        color: #404040;
    }

    .btn-primary:active {
        background-color: #fb0;
    }

    .btn-primary.disabled,
    .btn-primary.disabled.touch,
    .btn-primary[disabled],
    .btn-primary[disabled].touch {
        background-color: #e5e5e5;
        color: #999;
    }

    .btn-large {
        width: 70px;
        font-size: 14px;
        line-height: 35px;
    }
</style>