<template>
    <div>
        <!-- page start -->
        <div class="mod-page">
            <section class="page-loading" v-bind:class="{active : isShowPageloading}">
                <div class="spinner">
                    <div class="spinny"></div>
                </div>
            </section>
            <!-- section start -->
            <section class="mod-content submit submit-detail" v-cloak v-show="isMove && !isShowPageloading">
                <!-- product-detail start -->
                <div class="product-detail bc-main com-border-bottom">
                    <a href="javascript:;" class="product-info com-arrow-right" @click="goToDetail()">
                        <h1 class="product-title">{{detailData.title}}</h1>
                        <div class="product-price"><b>{{detailData.amount}}</b>元</div>
                    </a>
                    <p class="product-submit com-border-top">
                        <span class="fc-gray">{{detailData.status_str}}：</span>{{detailData.status_text}}
                    </p>
                </div>
                <!-- product-detail end -->
                <!-- form start -->
                <div class="form-widget detail-widget" v-if="detailData.status != -1">
                    <h2 class="form-heading">你提交的内容</h2>
                    <div class="form-group">
                        <div class="form-field vertical" v-for="commitContent in detailData.commitContents">
                            <div class="form-item">
                                <label class="form-label">{{commitContent.title}}</label>
                                <div class="form-control">
                                    <div class="text-group" v-if="commitContent.type == 0">{{commitContent.content}}</div>
                                    <div class="pic-list" v-if="commitContent.type == 1">
                                        <div class="pic-group active" v-for="(image, index) in commitContent.content_small">
                                            <label class="btn-file">
                                                <img :src="image" alt="" @click="lookBigPic(commitContent.content, index)">
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-if="noButtonStatusArr.indexOf(detailData.status) == -1">
                        <div class="form-opt">
                            <button class="btn btn-primary btn-large js-touch-state" type="button" :class="{disabled: detailData.button_text.status == 0}" @click="goToTarget(detailData.status_str)">{{buttonText[detailData.button_text.status]}}</button>
                        </div>
                        <p class="form-tips">{{detailData.button_text.text}}，<a href="javascript:;" class="fc-blue" data-role="link-rule" @click="setRetrialInfoDisplay(true)">查看完整申诉流程</a></p>
                    </template>
                </div>
                <!-- form end -->
            </section>
            <!-- section end -->
        </div>
        <!-- page end -->
        <!-- popup start -->
        <div class="mod-popup popup-screen active" data-role="popup-rule" v-show="isShowRetrialInfo">
            <div class="mod-popup-box">
                <div class="mod-popup-head-change"></div>
                <div class="mod-popup-body iscroll">
                    <div class="mod-popup-scroll">
                        <div class="mod-popup-text">
                            <p>在申请被审核拒绝后，您可按照以下流程进行申诉，维护自身权益，斗米平台也会为您服务，确保您的权益。</p>
                            <p>特工任务的状态不影响您进行申请重审和投诉的操作。</p>
                            <p>根据任务类型不同，申诉流程略有差异</p>
                        </div>
                        <div class="mod-popup-text">
                            <p><b>每人一次任务：</b></p>
                            <p>在审核拒绝后的48小时内您可以在提交详情页申请重审，</p>
                            <p>申请重审后商家需在48小时内重新操作审核，商家超时未审则自动通过，为您发放工资。</p>
                            <p>如果重审被拒绝，用户可在提交详情页申请投诉，斗米客服会联系您为您进行处理。</p>
                            <p>如果在审核拒绝后的48小时内您没有申请重审，则按钮会变为投诉，您在被审核拒绝的3天内可申请投诉，斗米客服会介入为你处理。</p>
                            <p>如果在审核拒绝或重审拒绝后的3天内你没有操作投诉，可拨打010-57977077进行投诉，斗米客服也会竭诚为您处理。</p>
                        </div>
                        <div class="mod-popup-text">
                            <p><b>对每人每天一次任务和无限制类任务：</b></p>
                            <p>在审核拒绝的3天内，您可通过提交详情页的投诉按钮申请投诉，投诉后斗米客服会联系为您进行处理。</p>
                            <p>超过3天则需您拨打客服电话<a href="tel:010-57977077" class="fc-blue">010-57977077</a>进行投诉，斗米客服会为您处理。</p>
                        </div>
                    </div>
                </div>
                <div class="mod-popup-bar"><i class="icon icon-close" data-role="icon-close" @click="setRetrialInfoDisplay(false)">关闭</i></div>
            </div>
        </div>
        <!-- popup end -->
    </div>
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
    import KCwidget from 'clientApi/KCwidget'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCucPage from 'clientApi/KCucPage'
    import KCloggerApi from 'clientApi/KCloggerApi'

    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */

    /**
     *  组件实例对象
     */
    export default {
        components: {

        },
        data () {
            return {
                detailData: {
                    button_text: {
                    }
                },
                buttonText: {
                    0: '投诉',
                    1: '申请重审',
                    2: '投诉'
                },
                noButtonStatusArr: ['1', '2', '3', '4', '5'],
                task_id: '',
                apply_id: '',
                isShowPageloading: true,
                isShowRetrialInfo: false,
                isMove: true,
                fromStr: ''
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
                self.task_id = Util.getQueryString('task_id');
                self.apply_id = Util.getQueryString('apply_id');
                self.post_title = Util.getQueryString('post_title');

                let from = Util.getQueryString('from');
                if (from == 'wdtg') {
                    self.fromStr = '我的特工';
                } else if (from == 'tsyfk') {
                    self.fromStr = '投诉与反馈';
                } else if (from == 'xtxx') {
                    self.fromStr = '系统消息';
                } else {
                    self.fromStr = 'push';
                }

                self.getOnlineJobDetail();

                //goBack后如果是type是重审则更改状态
                window.loadData = function(data){
                    if (data.type == 'retrialSuccess') {
                        self.detailData.status = '3';
                        self.detailData.status_str = '重审中';
                        self.detailData.status_text = '48小时内反馈审核结果';
                    }
                };

                KCloggerApi.addLog('0', '提交详情页&提交详情页_展现量&{"来源":"' + self.fromStr + '"}');
            },
            /**
             * 获取特工任务详情
             * @method getOnlineJobDetail
             * @public
             * @return {Null} void
             */
            getOnlineJobDetail () {
                let self = this;

                Util.ajax({
                    url:`/onlinetask/complainDetail?applyId=${self.apply_id}`,
                    timeout:10000,
                    ctrlStatus: {
                        loading: 1,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function (data) {
                        // console.log(data)
                        if (!!data && data.code == 1000) {
                            KCloggerApi.addLog('1','/jianzhi/dmtg/'+data.data.task_type+'/detail/submit_detail&task_id='+data.data.task_id+'&task_title='+data.data.title);
                            
                            self.detailData = data.data;

                            if (self.detailData.button_text.status == '1') {
                                KCloggerApi.addLog('0', '提交详情页&申请重审按钮_展现量&{"来源":"' + self.fromStr + '"}');
                            } else if (self.detailData.button_text.status == '2') {
                                KCloggerApi.addLog('0', '提交详情页&投诉按钮_展现量&{"来源":"' + self.fromStr + '"}');
                            }
                        } else {
                            KCwidget.toast(data.msg);
                        }
                        self.isShowPageloading = false;
                    },
                    error: function (xhr, status) {
                        self.isShowPageloading = false;
                    },
                    noNetwork: function() {
                        self.isShowPageloading = false;
                    }
                });
            },
            /**
             * 跳转至特工详情页
             * @method goToDetail
             * @public
             * @return {Null} void
             */
            goToDetail () {
                let self = this;
                let city_id = Util.getQueryString('city_id');

                KCloggerApi.addLog('0', '提交详情页&任务详情按钮_点击量&{"点击":"' + self.fromStr + '"}');
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=task_detail@task_id=' + self.task_id);

                let urd_data = decodeURIComponent(Util.getQueryString('urdData'));
                window.location.href = `doumi://onlinetaskdetail?task_id=${self.task_id}&city_id=${city_id}&urdData=${urd_data}`;
            },
            /**
             * 跳转至重审页或者投诉页
             * @method goToDetail
             * @public
             * @return {Null} void
             */
            goToTarget (status_str) {
                let self = this;

                if (self.detailData.button_text.status == 1) {
                    KCloggerApi.addLog('0', '提交详情页&申请重审按钮_点击量&{"点击":"' + self.fromStr + '"}');
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=reaudit@task_id=' + self.task_id);
                    window.location.href = `doumi://online-retrial?apply_id=${self.apply_id}&task_id=${self.task_id}&post_title=${self.post_title}`;
                } else if (self.detailData.button_text.status == 2) {
                    KCloggerApi.addLog('0', '提交详情页&投诉按钮_点击量&{"点击":"' + self.fromStr + '"}');
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=complain@task_id=' + self.task_id);
                    window.location.href = `doumi://online-complain?task_id=${self.task_id}&from=submit_detai&post_title=${self.post_title}&status_str=${status_str}`;
                } else {
                    return;
                }
            },
            lookBigPic(imgUrls, index) {
                KCclientUI.bigPicturePreview('', imgUrls, index);
            },
            /**
             * 控制重审流程的显示
             * @method showRetrialInfo
             * @public
             * @return {Null} void
             */
            setRetrialInfoDisplay (isShow) {
                let self = this;
                self.isShowRetrialInfo = isShow;
                let title =  document.getElementsByTagName('title');
                if (isShow) {
                    self.isMove = false;
                    title[0].innerHTML = '完整申诉处理流程';
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=see_flow@task_id=' + self.task_id);
                } else {
                    self.isMove = true;
                    title[0].innerHTML = '提交特工详情';
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
<style>
    .mod-popup-head-change{
        height: 10px;
        max-height: 26px;
    }
</style>
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/online_submit.css"></style>