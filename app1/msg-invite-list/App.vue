<template>
    <!-- page start -->
    <div class="mod-page">
        <!-- com-mid-loading -->
        <com-mid-loading :com-mid-is-show="isShowComMid" />
        <!-- section start -->
        <section class="mod-content message-position" v-show="!isShowComMid">
            <ul class="message-list mod-list">
                <li class="mod-list-item" v-for="card in inviteList">
                    <div class="message-time" v-if="card.content_type == 3 || card.data.length != 0">{{card.date_str}}</div>
                    <div class="message-info message-position-info" v-if="(card.content_type == 1 || card.content_type == 2) && card.data.length != 0">
                        <h2 class="message-title">{{contentType[card.content_type]}}</h2>
                        <ul class="mod-list product-list">
                            <li class="mod-list-item com-border-bottom" v-for="item in card.data">
                                <a href="javascript:;" class="mod-list-info product-info" @click="goToJobDetail(card.content_type, card.ca_from, card.create_at, item.id, item.urd, item.urd_data, item.distance)">
                                    <h3 class="product-title"><span>{{item.title}}</span></h3>
                                    <div class="product-price" v-if="/doumi:\/\/onlinetaskdetail/.test(item.urd)"><b>{{item.amount}}</b>元</div>
                                    <div class="product-price" v-else><b>{{item.salary}}</b>元/{{item.salary_type_str}}</div>

                                    <div class="product-meta" v-if="/doumi:\/\/onlinetaskdetail/.test(item.urd)">
                                        <span class="fl fc-gray"><i class="icon icon-tegong-sm"></i>剩余{{item.left_stock}}次</span>
                                        <span class="fl fc-gray"><i class="icon icon-date-sm"></i>{{item.deadline}}</span>
                                    </div>
                                    <div class="product-meta" v-else>
                                        <span class="fl fc-gray"><i class="icon icon-location-sm"></i>{{card.content_type == 1 ? item.distance : ''}} {{item.post_area}}</span>
                                        <span class="fl fc-gray"><i class="icon icon-date-sm"></i>{{item.date}}</span>
                                    </div>
                                    <div class="product-label">
                                        <i v-if="/doumi:\/\/onlinetaskdetail/.test(item.urd)" class="icon icon-label" title="特工">特工</i>
                                        <template v-else>
                                            <i v-if="item.is_wages_guarantee == 1" class="icon icon-danbao" title="工资保障">工资保障</i>
                                            <i v-if="item.ad_types==1" class="icon icon-remen" title="热门">热门</i>
                                            <i v-if="item.ad_types==2" class="icon icon-renqi" title="人气">人气</i>
                                            <i v-if="item.ad_types==3" class="icon icon-jizhao" title="急招">急招</i>
                                            <i v-if="item.has_subsidy==1" class="icon icon-tuijian" title="推荐">推荐</i>
                                            <i v-if="item.ad_types == 0 && item.has_subsidy == 0 && !!item.operate_label && item.operate_label.indexOf('zhipin') != -1" class="icon icon-zhipin" title="直聘">直聘</i>
                                        </template>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <a href="javascript:;" class="message-info" v-if="card.content_type == 3" @click="goToJobDetail(card.content_type, card.ca_from, card.create_at, '', card.urd, '', '')">
                        <h3 class="message-title">{{card.title}}</h3>
                        <div class="message-content">{{card.description}}</div>
                        <div class="message-opt">查看详情</div>
                    </a>
                </li>
            </ul>
            <com-bom-loading :checkNetwork="checkNetwork":load-fn="getJobInviteList"/>
        </section>
        <!-- section end -->
    </div>
    <!-- page end -->
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCmsgPage from 'clientApi/KCmsgPage'
    import KCwidget from 'clientApi/KCwidget'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCmsgInvitePage from 'clientApi/KCmsgInvitePage'
    import KCcityApi from 'clientApi/KCcityApi'
    import KCclientInfo from 'clientApi/KCclientInfo'
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
            comMidLoading,
            comBomLoading
        },
        data () {
            return {
                page: 1,
                pageSize: 5,
                inviteList : [],
                isShowComMid : true,
                msgType: '',
                contentType: {
                    '1': '附近兼职',
                    '2': '个性推荐'
                },
                checkNetwork: false
            }
        },
        computed: {

        },
        methods: {
            initFn () {
                let self = this;
                //通知客户端push列表消息已读
                self.msgType = Util.getQueryString('messageType');
                KCmsgPage.setMsgReaded(self.msgType);
                self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                self.getJobInviteList();
                KCloggerApi.addLog('1', '/jianzhi/message/gzyy');
            },
            getJobInviteList () {
                let self = this;
                // console.log('self.page==' + self.page + ',self.pageSize==' + self.pageSize)
                KCmsgInvitePage.getInviteList(self.page, self.pageSize, function(data) {
                    // console.log(data);
                    if (data.status == 'success') {
                        if (data.data.length > 0) {
                            //构建职位详情页预览数据
                            for (let card of data.data) {
                                //计算时间
                                card.date_str = Util.timeFormat(card.create_at * 1000);
                                if(!!card.data && card.data.length > 0) {
                                    for (let item of card.data) {
                                        // item.urd = 'doumi://jobdetail';
                                        if (!!item.urd && /doumi:\/\/jobdetail/.test(item.urd)) {
                                            //普通职位
                                            item.urd_data = encodeURIComponent("title=" + item.title + "&hire_number=" + item.hire_number + "&payment_type_str=" + item.payment_type_str + "&job_type_str=" + item.job_type_str + "&salary=" + item.salary + "&salary_type_str=" + item.salary_type_str + "&is_deposit=" + item.is_deposit + "&has_subsidy=" + item.has_subsidy + "&cooperation_type=" + item.cooperation_type + "&ad_types=" + item.ad_types);
                                        } else if (!!item.urd && /doumi:\/\/onlinetaskdetail/.test(item.urd)) {
                                            //特工职位
                                            item.urd_data = encodeURIComponent(`tag_status=${item.tag_status}&title=${item.title}&left_stock=${item.left_stock}&deadline=${item.deadline}&amount=${item.amount}&old_amount=${item.old_amount}`);
                                        }
                                    }
                                }
                            }

                            if(self.page==1){
                                self.inviteList = data.data;
                            }else{
                                self.inviteList = self.inviteList.concat(data.data);
                            }
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                            if(data.data.length < self.pageSize){
                                self.$store.commit(combomloading_mt.SET_LOADING, false);
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                            }
                            self.page++;
                        } else if (data.data.length == 0) {
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                            if(self.page==1){
                                KCmsgPage.loadPageStatus('noData');
                            }else{
                                self.$store.commit(combomloading_mt.SET_LOADING, false);
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                            }
                        }
                        self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                    } else if (data.status == 'error') {
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(self.page==1){
                            KCmsgPage.loadPageStatus('loadFailed');
                        }else{
                            KCwidget.toast(data.message);
                        }
                    } else if (data.status == 'nonet') {
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(self.page==1){
                            KCmsgPage.loadPageStatus('netWorkFailed');
                            if (Util.OS() == 'ios') {
                                KCclientInfo.getNetworkType(function(networkData){
                                    Util.openNetworkSetting(networkData.network);
                                });
                            }
                        }else{
                            KCwidget.toast('网络异常');
                        }
                    }
                    self.isShowComMid = false;
                });
            },
            goToJobDetail (content_type, ca_from, create_at, job_id, urd, urd_data, distance) {
                let self = this;
                let href = urd;
                let isOnlintTask = false;
                if (content_type == 1 || content_type == 2) {
                    if (/doumi:\/\/jobdetail/.test(urd)) {
                        isOnlintTask = false;
                        href = `doumi://jobdetail?job_id=${job_id}&urdData=${urd_data}`;
                        if (content_type == 1) {
                            href = `${href}&distance=${distance}`;
                        }
                    } else if (/doumi:\/\/onlinetaskdetail/.test(urd)) {
                        isOnlintTask = true;
                        KCcityApi.getValidCity(function(data){
                            href = `doumi://onlinetaskdetail?task_id=${job_id}&city_id=${data.cityid}&urdData=${urd_data}`;
                        });
                    }
                }
                
                self.setLog(content_type, ca_from, create_at, urd, job_id, isOnlintTask)
                window.location.href = href;
            },
            /**
             * 埋点
             * @param {[type]} content_type [1:附近兼职，2:个性推荐，3: 单条／运营消息，4:新用户次日推送]
             * @param {[type]} date_str     [消息发送时间]
             * @param {[type]} urd          [点转链接]
             * @param {[type]} id           [职位id或特工id]
             * @param {[type]} flag         [区分普通职位和特工职位//0:普通职位，1:特工职位]
             */
            setLog(content_type, ca_from, create_at, urd, id, isOnlintTask) {
                let log_prefix = '@atype=click@ca_source=app@ca_name=doumi@ca_from=';
                let log_suffix = '';
                if (content_type == 1 || content_type == 2) {
                    if(isOnlintTask) {
                        log_suffix = `${ca_from}@task_id=`;
                    }else {
                        log_suffix = `${ca_from}@post_id=`;
                    }
                    id = !!id ? id : '-';
                } else if (content_type == 3) {
                    //处理时间，格式化成月日
                    let tempDate = Util.getLocalTime(create_at * 1000,'yyyy-MM-dd').split('-');
                    log_suffix = `${ca_from}_${tempDate[1]}${tempDate[2]}_${urd}@post_id=`;
                    //只筛选普通职位和特工，其他的连接无法获取id
                    if (/doumi:\/\/jobdetail/.test(urd)) {
                        id = urd.split('job_id=')[1];
                    } else if (/doumi:\/\/onlinetaskdetail/.test(urd)) {
                        id = urd.split('task_id=')[1];
                    }
                }
                KCloggerApi.addLog('2', log_prefix + log_suffix + id);
            }
        },
        beforeCreate () {

        },
        created () {
            let self = this;
            self.initFn();
        }
    }
</script>

<!-- CSS 样式 -->
<!-- <style src="static/css/global.css"></style> -->
<style src="static/style/message_position.css"></style>