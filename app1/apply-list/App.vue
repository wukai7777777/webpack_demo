<template>
    <div class="mod-page">
         <com-mid-loading :com-mid-is-show="isShowPageloading"/>
        <section class="mod-content list" v-show="!isShowPageloading">
            <div class="mod-column">
                <div class="mod-column-body">
                    <ul class="mod-list">
                        <li class="mod-list-item bc-main com-border-bottom com-space" v-for="(item, index) in listData">
                            <a href="javascript:;" class="mod-list-info product-info" @click="goToDetail(item.post_id, item.urd_data)">
                                <div class="product-content mod-flex-item">
                                    <h3 class="product-title">
                                        <span>{{item.post_title}}</span>
                                    </h3>
                                    <div class="product-meta">
                                        <span class="fl fc-gray">
                                            <i class="icon icon-location-sm"></i>
                                            {{item.post_area}}
                                        </span>
                                        <span class="fl fc-gray">
                                            <i class="icon icon-date-sm"></i>
                                            {{item.date}}
                                        </span>
                                    </div>
                                    <div class="product-meta">
                                        <span class="fl">
                                            <b class="fc-red">{{item.salary}}</b>元/{{item.salary_type_str}}
                                        </span>
                                        <span class="fl line" v-if="!!item.payment_type_str">{{item.payment_type_str}}</span>
                                        <span :class="['pruduct-status', 'fr', showStatus[item.show_status]]">{{item.show_status_str}}</span>
                                    </div>
                                </div>
                            </a>
                            <nav class="mod-nav product-opt">
                                <ul class="mod-flex">
                                    <template v-if="entry == ''">
                                        <li class="mod-flex-item com-border-right" v-if="item.show_status == 0 || item.show_status == 3 || item.show_status == 12 || item.show_status == 5 || item.show_status == 11">
                                            <template v-if="item.post_cooperation_type == 1 && item.post_source > 0">
                                                <a href="javascript:;" class="mod-nav-item" v-if="item.company_is_active == 1" @click="group(item.user_id, item.post_id, item.biz_user_id, item.post_title, item.consulting_display, item.consulting_info, item.consulting_remark)">联系商家</a>
                                                <a href="javascript:;" class="mod-nav-item" v-else @click="contactWay(item.post_id, item.consulting_display, item.consulting_info, item.consulting_remark)">联系商家</a>
                                            </template>
                                            <a href="javascript:;" class="mod-nav-item" v-else @click="group(item.user_id, item.post_id, item.biz_user_id, item.post_title, item.consulting_display, item.consulting_info, item.consulting_remark)">联系商家</a>
                                        </li>
                                        <li class="mod-flex-item com-border-right" @click="cancelApplyBtn(item.post_id, index)" v-if="item.show_status == 0 || item.show_status == 3 || item.show_status == 12">
                                            <a href="javascript:;" class="mod-nav-item">取消报名</a>
                                        </li>
                                    </template>
                                    <li class="mod-flex-item com-border-right">
                                        <a href="javascript:;" class="mod-nav-item" @click="goToComplain(item.post_id, item.show_status, item.show_status_str, item.complain_status, item.post_title)">投诉职位</a>
                                    </li>
                                </ul>
                            </nav>
                        </li>
                    </ul>
                    <com-bom-loading :load-fn="getApplyList"/>
                </div>  
            </div>
        </section>
    </div> 
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import { KCpageInstances } from 'clientApi/KCpage'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCcache from 'clientApi/KCcache'
    import KCucApi from 'clientApi/KCucApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCdeviceApi from 'clientApi/KCdeviceApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCapplyListPage from 'clientApi/KCapplyListPage'
    
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
            return{
                listing_status: Util.getQueryString('index') == '3' ? '4' : Util.getQueryString('index'),//v3.0.0添加已拒绝(4)
                userId: 0,
                page: 1,
                isShowPageloading: false,
                listData: [],
                showStatus: {
                    '0': '',//待处理　
                    '12': '',//(通过初筛选）待处理
                    '5': '',//已录取
                    '3': '',//待面试
                    '2': 'fc-gray',//已结束
                    '-10': 'fc-gray',//已取消
                    '-5': 'fc-gray',//已拒绝
                    '-1': 'fc-gray',//已拒绝
                    '6': 'fc-gray',//已拒绝
                    '15': 'fc-gray',//已拒绝
                    '20': 'fc-gray',//已拒绝
                    '21': 'fc-gray',//（已淘汰）已拒绝
                    '10': 'fc-gray'//解约
                },
                contactTypes : {
                    '0': '电话联系企业',
                    '1': '微信联系企业',
                    '2': 'QQ联系企业',
                    '3': '邮件联系企业',
                    '4': '微信公众账号联系企业'
                },
                entry: Util.getQueryString('entry') || '',
                hasCache: false
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

                KCucApi.getUserInfo(function(data){
                    if(!!data.userId && data.userId !== '0'){
                        self.userId = data.userId;
                        KCcache.getCache(`applylistData${self.listing_status}${self.userId}`, function (data) {
                            // console.log(data)
                            self.page = 1;
                            if(!data || data == 'null'){
                                // 没有缓存
                                self.hasCache = false;
                                self.isShowPageloading = true;
                                self.getApplyList();
                            }else if(!!data && !!data.data && data.data.length > 0){
                                // 有缓存先读取缓存，并刷新数据
                                self.hasCache = true;
                                self.listData = data.data;
                                KCucPage.refreshPage();
                                 
                            }else{
                                self.getApplyList();
                            }
                        });
                    }else{
                        widget.toast('服务器异常');
                    }
                });

                window.loadData = function () {
                    KCucPage.loadPageStatus('loadSuccess');
                    self.page = 1;
                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                    self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                    self.getApplyList();
                };

                window.updateJobListData = function(data){
                    if (!!data) {
                        if (self.listing_status != '2' && self.listing_status != '4' && data.tab_index != self.listing_status ) {
                            for (let i = 0; i < data.post_opr_list.length; i++) {
                                let updateJobIndex = -1;
                                let updateJob = self.listData.filter((ele, index, array) => {
                                    if (data.post_opr_list[i].post_id == ele.post_id) {
                                        updateJobIndex = index;
                                        return true;
                                    }
                                });
                                
                                if (updateJobIndex > -1) {
                                    if (data.tab_index == '0') {
                                        //delete job
                                        if (data.post_opr_list[i].opr == 'cancel') {
                                            self.listData.splice(updateJobIndex, 1);
                                        }
                                        
                                        //无数据
                                        if (self.listData.length == 0) {
                                            KCucPage.loadPageStatus('noData');
                                        }
                                    } else if (data.tab_index == '1') {
                                        //update job
                                        if (data.post_opr_list[i].opr == 'cancel') {
                                            self.listData[updateJobIndex].show_status = -10;
                                            self.listData[updateJobIndex].show_status_str = '已取消';
                                        }
                                    }
                                }
                            }
                            KCapplyListPage.updateJobListOver();
                        }
                    }
                };
            },
            getApplyList () {
                let self = this;
                Util.ajax({
                    url:`/ucenter/applylist?page=${self.page}&listing_status=${self.listing_status}`,
                    timeout:10000,
                    ctrlStatus: {
                        loading: self.page,
                        cache: self.hasCache,
                        errNum: 0,
                        netNum: 0
                    },
                    success: function (data) {
                        // console.log(data)
                        KCucPage.dataDownloadFinished();
                        self.isShowPageloading = false;
                        
                        if (!!data && !!data.data && data.data.length > 0) {
                            //构建职位详情跳转参数
                            for(let i = 0; i < data.data.length; i++){
                                data.data[i].urd_data = encodeURIComponent("title=" + data.data[i].post_title + "&hire_number=" + data.data[i].hire_number + 
                                    "&payment_type_str=" + data.data[i].payment_type_str + "&job_type_str=" + data.data[i].job_type_str + 
                                        "&salary=" + data.data[i].salary + "&salary_type_str=" + data.data[i].salary_type_str + 
                                            "&is_wages_guarantee=" + data.data[i].is_wages_guarantee + "&has_subsidy=" + data.data[i].has_subsidy + "&ad_types=" + data.data[i].ad_types);
                            }

                            if (self.page == 1) {
                                self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                                KCcache.setCache(`applylistData${self.listing_status}${self.userId}`, data, 3 * 24 * 60 * 60);
                                self.listData = data.data;
                            } else {
                                self.listData = self.listData.concat(data.data);
                            }

                            if (data.last_page == 1 || data.last_page == data.current_page) {
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                            } else {
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                                self.$store.commit(combomloading_mt.SET_LOADING, false);
                                self.page++;
                            }
                        } else if (!!data && !!data.data && data.data.length == 0) {
                            // self.canNextRequest = false;
                            self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                            if (self.page == 1) {
                                KCcache.setCache(`applylistData${self.listing_status}${self.userId}`, null, 3 * 24 * 60 * 60);
                                self.listData = [];
                                // self.isShowLoadingBar = false;
                                self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                                KCucPage.loadPageStatus('noData');
                            }
                            self.$store.commit(combomloading_mt.SET_NOMORE, true);
                        }
                    },
                    error: function (xhr, status) {
                        KCucPage.dataDownloadFinished();
                        self.isShowPageloading = false;
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        // if (status == 'timeout') {
                        //     KCwidget.toast('网络请求超时');
                        // }else{
                        //     if (xhr.status == 400) {
                        //         let err = JSON.parse(xhr.responseText);
                        //         if (err.code == -100) {
                        //             //未登录
                        //             KCucApi.logOut();
                        //         } else {
                        //             if (self.page == 1) {
                        //                 self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                        //                 KCucPage.loadPageStatus('loadFailed');
                        //             } else {
                        //                 KCwidget.toast(err.message);
                        //             }
                        //         }
                        //     } else {
                        //         if (self.page == 1) {
                        //             self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                        //             KCucPage.loadPageStatus('loadFailed');
                        //         } else {
                        //             KCwidget.toast('服务器异常');
                        //         }
                        //     }
                        // }
                    },
                    noNetwork: function () {
                        KCucPage.dataDownloadFinished();
                        self.isShowPageloading = false;
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                    }
                });
            },
            /**
             * 确定取消报名
             * @method cancelApplyBtn
             * public
             * @return {Null} void
             */
            cancelApplyBtn (post_id, index) {
                let self = this;
                let tabStr = self.getTabStr();
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + tabStr + '@ca_from=cancel@post_id=' + post_id);
                KCclientUI.showDialog('确定取消报名？','',function(data){
                    if (data.status == 1) {
                        KCucPage.loadPageStatus('loading');
                        self.cancelApply(post_id, index);
                    }
                },'确定','取消','Cancel');
            },
            /**
             * 取消报名
             * @method cancelApply
             * public
             * @return {Null} void
             */
            cancelApply (post_id, index) {
                let self = this;
                Util.ajax({
                    url: `/cancelapply/${post_id}`,
                    timeout: 10000,
                    type: 'POST',
                    ctrlStatus: {
                        loading: 0,
                        cache: self.hasCache,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function (data) {
                        KCucPage.loadPageStatus('loadSuccess');
                        if (!!data && data.code == 1000) {
                            KCwidget.toast('取消报名成功');
                            self.listData[index].show_status = -10;
                            self.listData[index].show_status_str = '已取消';

                            //如果当前tab是已报名，则删除该取消职位
                            if (self.listing_status == '1') {
                                self.listData.splice(index, 1);
                            }

                            //无数据
                            if (self.listData.length == 0) {
                                KCucPage.loadPageStatus('noData');
                            }

                            //通知客户端职位状态变了
                            KCapplyListPage.updateApply(self.listing_status, {'post_id': post_id ,'opr': 'cancel'});
                        }else {
                            KCwidget.toast(data.msg);
                        }
                    },
                    error: function (xhr, status) {
                        KCucPage.loadPageStatus('loadSuccess');
                        let toastStr = '';
                        if(status == 'timeout'){
                            toastStr = '网络请求超时';
                        }else{
                            toastStr =  '服务器异常';
                        }
                        KCwidget.toast(toastStr);
                    },
                    noNetwork: function () {
                        KCucPage.loadPageStatus('loadSuccess');
                        KCwidget.toast('网络异常');
                    }
                });
            },
            /**
             * 跳转去投诉
             * @method goToComplain
             * public
             * @return {Null} void
             */
            goToComplain (post_id, status, status_str, complain_status, post_title) {
                let self = this;
                
                let fromStr = '';
                let fromForComplain = '';
                if (!!self.entry && self.entry == 'tsyfk') {
                    fromStr = '个人中心_投诉与反馈_职位投诉';
                    fromForComplain = 'tsyfk';
                } else {
                    fromStr = '我的兼职页面';
                    fromForComplain = 'wdjz'
                }
                KCloggerApi.addLog('0', '投诉按钮点击&来源&{"来源":"' + fromStr + '"}');

                if (complain_status == 0) {
                    KCwidget.toast('您已投诉过该职位！');
                } else {
                    let tabStr = self.getTabStr();
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + tabStr + '@ca_from=complain@post_id=' + post_id);
                    window.location.href = `doumi://complain?id=${post_id}&status=${status}&status_str=${status_str}&from=${tabStr}&fromForComplain=${fromForComplain}&post_title=${post_title}`;
                }
            },
            /**
             * 在线咨询
             * @method group
             * public
             * @return {Null} void
             */
            group (user_id, post_id, biz_user_id, title, type, info, detail) {
                let self = this;

                let tabStr = self.getTabStr();
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + tabStr + '@ca_from=ask@post_id=' + post_id);
                //v2.9.0 埋点 纯点击 联系商家
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=connect_company@from=' + tabStr + '@post_id=' + post_id);

                KCucPage.loadPageStatus('loading');
                Util.ajax({
                    url: `/im/group?client_user_id=${user_id}&post_id=${post_id}&biz_user_id=${biz_user_id}`,
                    timeout:10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function (data) {
                        KCucPage.loadPageStatus('loadSuccess');
                        let targetId = data.data.group_id;
                        if (data.code == 1) {
                            KCclientUI.showContactDialog('在线咨询', self.contactTypes[type], function (data) {
                                if (data.status == '0') {
                                    //取消
                                    return;
                                } else if (data.status == '1') {
                                    KCloggerApi.addLog('0', '联系商家按钮_点击量&联系商家按钮_点击量&{"点击量":"在线联系"}');
                                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=connect_IM@from=' + tabStr + '@post_id=' + post_id);
                                    window.location.href = `doumi://conversation?targetId=${targetId}&title=${title}&job_id=${post_id}`;
                                } else if (data.status == '2') {
                                    self.contactWay(post_id, type, info);
                                }
                            });
                        } else {
                            self.contactWay(post_id, type, info);
                        }
                    },
                    error: function (xhr, status) {
                        KCucPage.loadPageStatus('loadSuccess');
                        self.contactWay(post_id, type, info);
                    },
                    noNetwork: function () {
                        KCucPage.loadPageStatus('loadSuccess');
                        KCwidget.toast('网络异常');
                    }
                });
            },
            /**
             * 联系商家
             * @method contactWay
             * public
             * @return {Null} void
             */
            contactWay (post_id, type, info, detail) {
                let self = this;
                let tabStr = self.getTabStr();
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + tabStr + '@ca_from=connect_company@post_id=' + post_id);
                //v2.9.0埋点 纯点击 联系商家
                if (!!detail) {
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=connect_company@from=' + tabStr + '@post_id=' + post_id);
                }

                if (type == 0) {
                    // clientInfo.makePhoneCall(info);
                    KCclientUI.showPhoneDialog(info + '', '', '呼叫', '取消', 'Phone', function (data) {
                        if(data.status == 1){
                            KCloggerApi.addLog('0', '联系商家按钮_点击量&联系商家按钮_点击量&{"点击量":"拨打电话"}');
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=connect_phone@from=' + tabStr + '@post_id=' + post_id);
                        }
                    });
                } else if (type == 1) {
                    KCclientUI.showDialog("企业微信号", info, function (data) {
                        if (data.status == 1) {
                            KCloggerApi.addLog('0', '联系商家按钮_点击量&联系商家按钮_点击量&{"点击量":"复制wechat"}');
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=connect_wechat@from=' + tabStr + '@post_id=' + post_id);
                            KCdeviceApi.copyToClipboard(info, function(){});
                        }
                    }, "复制", '取消','Normal');
                } else if (type == 2) {
                    KCclientUI.showDialog("企业QQ号", info, function (data) {
                        if (data.status == 1) {
                            KCloggerApi.addLog('0', '联系商家按钮_点击量&联系商家按钮_点击量&{"点击量":"复制QQ"}');
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=connect_wechat@from=' + tabStr + '@post_id=' + post_id);
                            KCdeviceApi.copyToClipboard(info, function(){});
                        }
                    }, "复制", '取消','Normal');
                } else if (type == 3) {
                    KCclientUI.showDialog("企业邮箱地址", info, function (data) {
                        if (data.status == 1) {
                            KCdeviceApi.copyToClipboard(info, function(){});
                        }
                    }, "复制", '取消','Normal');
                } else if (type == 4) {
                    KCclientUI.showDialog("企业公众号", info, function (data) {
                        if (data.status == 1) {
                            KCloggerApi.addLog('0', '联系商家按钮_点击量&联系商家按钮_点击量&{"点击量":"复制公众账号"}');
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=connect_QQ@from=' + tabStr + '@post_id=' + post_id);
                            KCdeviceApi.copyToClipboard(info, function(){});
                        }
                    }, "复制", '取消','Normal');
                }
            },
            /**
             * 获取Tab名儿
             * @method getTabStr
             * public
             * @return {String}
             */
            getTabStr() {
                let self = this;
                let tabStr = '';
                if (self.listing_status == 0) {
                   tabStr = 'qb'; 
                } else if (self.listing_status == 1){
                    tabStr = 'ybm';
                } else if (self.listing_status == 2){
                    tabStr = 'ylq';
                } else if (self.listing_status == 3){
                    tabStr = 'yjs';
                } else if (self.listing_status == 4){//v3.0.0
                    tabStr = 'yjj';
                }
                return tabStr;
            },
            /**
             * 跳转至详情页
             * @method goToDetail
             * public
             * @return {Null} void
             */
            goToDetail (post_id, urd_data) {
                let self = this;
                let tabStr = self.getTabStr();
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + tabStr +'@ca_from=post@post_id='+ post_id );
                //v2.9.0
                let from = 'wdjz';
                if (!!self.entry && self.entry == 'tsyfk') {
                    from = 'complain';
                }
                window.location.href = `doumi://jobdetail?job_id=${post_id}&urdData=${urd_data}+'&from=${from}`;
            }
        },
        created (){
            this.initFun();
        }
        
    }
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/list.css"></style>