<template>
    <!-- page start -->
    <div class="mod-page" :style="{ paddingTop: listTop }">
        <!-- com-mid-loading -->
        <com-mid-loading :com-mid-is-show="isShowComMid" />
        <!-- section start -->
        <section class="mod-content list" v-cloak v-show="!isShowComMid">
            <!-- column start -->
            <div class="mod-column bc-main">
                <div class="mod-column-body">
                    <!-- <ul class="mod-list" :style="{ minHeight:listMinHeight }"> -->
                    <ul class="mod-list">
                        <li class="mod-list-item com-border-bottom lsd-wrap" v-for="(item, index) in listData">
                            <a href="javascript:;" class="product-info mod-list-info lsd-content" :class="{'overdue': item.is_expired == 1, 'slideOutLeft': item.slideOutLeft, 'animated':item.slideOutLeft, 'activeBackground': platform == 'android'}" @click="goToDetail(item.id, item.is_expired, item.urd_data)" :data-postid="item.id" :data-cityid="item.city_id" :data-index="index">
                                <h3 class="product-title">
                                        <span>
                                            
                                            {{item.title}}
                                        </span>
                                    </h3>
                                    <div class="product-price">
                                        <span  class="fl">
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
                                        <i v-if="item.is_wages_guarantee == 1" class="icon icon-danbao">工资保障</i>
                                        <i v-if="!!item.payment_type_str" class="fl line icon-label" :title="item.payment_type_str">{{item.payment_type_str}}</i>
                                        <i v-if="item.ad_types==1" class="icon icon-remen" title="热门">热门</i>
                                        <i v-if="item.ad_types==2" class="icon icon-renqi" title="人气">人气</i>
                                        <i v-if="item.ad_types==3" class="icon icon-jizhao" title="急招">急招</i>
                                        <i v-if="item.has_subsidy==1" class="icon icon-tuijian" title="推荐">推荐</i>
                                        <i v-if="item.ad_types == 0 && item.has_subsidy == 0 && !!item.operate_label && item.operate_label.indexOf('zhipin') != -1" class="icon icon-zhipin" title="直聘">直聘</i>
                                        <i class="icon icon-youxian" v-if="item.ad_types==12" title="优先">优先</i>
                                    </div>
                            </a>
                            <span class="lsd-delete needsclick" v-show="item.isShowDelBtn" @click="deleteFn(item, index)">删除</span>
                        </li>
                    </ul>
                    <com-bom-loading :load-fn="loadFunc"/>
                </div>
            </div>
            <!-- column end -->
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
    import Util from 'tool/widget/Util'
    import touch from 'tool/lib/touch'
    import KCucPage from 'clientApi/KCucPage'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import Sw from 'swiped'

    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import comBomLoading from 'components/com-bom-loading/com-bom-loading'
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'
    import * as combomloading_mt from "components/com-bom-loading/com-bom-loading-mutation-types"
    let s3 = [];
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
                listData: [],
                page: 1,
                pageSize: 20,
                platform: Util.OS(),
                listTop: '',
                clientHeight: document.documentElement.clientHeight,
                isShowComMid: false
            }
        },
        methods: {
            /**
             * 初始化
             * @method initFun
             * @public
             * @return {Null} void
             */
            initFun () {
                var self = this;

                KCucPage.canPullWebView(true);

                if(self.platform == 'ios'){
                    KCucPage.getNavbarHeight(function(height){
                        self.listTop = height + 'px';
                    });
                } else {
                    // Android 长按删除
                    //添加点击的阴影效果
                    Util.touchActiveBackground('.activeBackground');

                    $('body').on('longTap', '.lsd-content', function(){
                        var postId = $(this).data('postid');
                        var cityId = $(this).data('cityid');
                        var index = $(this).data('index');

                        KCclientUI.showDialog('确定取消收藏?', '', function(type){
                            if(type.status == 1){
                                self.removeFav(postId, cityId, index);
                            }
                        }, '确定', '取消', 'Delete');
                    });
                }

                self.getFavoriteListData();

                window.loadData = function(){
                    self.page = 1;
                    self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                    self.getFavoriteListData();
                };

                // 刷新帖子
                window.refreshPosts = function(data){
                    self.listData = self.listData.filter(function (job) {
                        return job.id != data.jobId;
                    });

                    if(self.listData.length == 0){
                        KCucPage.loadPageStatus('noData');
                        self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                        // 设置title bar 文案和动作
                        KCucPage.updateTitleBar({
                            leftDisplay: false,
                            leftText: '',
                            leftAction: '',
                            rightDisplay: false,
                            rightText: '清空过期职位',
                            rightAction: 'clearOverDue'
                        });
                    }
                }

                // 清空过期帖子
                window.clearOverDue = function(){
                    KCclientUI.showDialog('确定清除过期职位？', '', function(data){
                        if(data.status == 1){
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=clear');
                            Util.ajax({
                                url: '/collect/delete',
                                type: 'POST',
                                timeout: 10000,
                                ctrlStatus: {
                                    loading: 0,
                                    cache: false,
                                    errNum: 0,
                                    netNum: 0,
                                },
                                success: function (data) {
                                    if (!!data && data.code == 200) {
                                        if (data.data > 0) {
                                            KCwidget.toast('清除成功');    
                                        } else {
                                            KCwidget.toast('暂无过期职位');
                                        }

                                        // 移除过期帖子DOM
                                        self.listData = self.listData.filter(function (job) {
                                            return job.is_expired != 1;
                                        });

                                        if(self.listData.length == 0){
                                            KCucPage.loadPageStatus('noData');
                                            self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                                            // 设置title bar 文案和动作
                                            KCucPage.updateTitleBar({
                                                leftDisplay: false,
                                                leftText: '',
                                                leftAction: '',
                                                rightDisplay: false,
                                                rightText: '清空过期职位',
                                                rightAction: 'clearOverDue'
                                            });
                                        }
                                    } else {
                                        KCwidget.toast(data.message);
                                    }
                                },
                                error: function (xhr, status) {
                                },
                                noNetwork: function () {
                                }
                            });
                        }
                    }, '清除', '取消', 'Delete');
                };

                if((document.body.scrollHeight > self.clientHeight) && self.platform != 'ios'){
                    self.loadStatus = true;
                }
            },
            /**
             * [loadFunc bom loading 回调]
             * @return {[type]} [description]
             */
            loadFunc() {
                let self = this;
                self.getFavoriteListData();
            },
            getFavoriteListData() {
                var self = this;
                Util.ajax({
                    url:'/collect?page=' + self.page + '&pageSize=' + self.pageSize,
                    timeout:10000,
                    ctrlStatus: {
                        loading: self.page,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        // console.log(data);
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(!!data && data.code == 200){
                            KCucPage.dataDownloadFinished();
                            if(!!data.data && !!data.data.datas && data.data.datas.length > 0){
                                //构建职位详情跳转参数
                                for(var i = 0;i < data.data.datas.length;i++){
                                    data.data.datas[i].slideOutLeft = false;
                                    data.data.datas[i].isShowDelBtn = true;
                                    data.data.datas[i].urd_data = encodeURIComponent("title=" + data.data.datas[i].title + "&hire_number=" + data.data.datas[i].hire_number + 
                                        "&payment_type_str=" + data.data.datas[i].payment_type_str + "&job_type_str=" + data.data.datas[i].job_type_str + 
                                            "&salary=" + data.data.datas[i].salary + "&salary_type_str=" + data.data.datas[i].salary_type_str + 
                                                "&is_wages_guarantee=" + data.data.datas[i].is_wages_guarantee + "&has_subsidy=" + data.data.datas[i].has_subsidy + "&ad_types=" + data.data.datas[i].ad_types);
                                }

                                if(self.page == 1){
                                    self.listData = data.data.datas;
                                }else{
                                    self.listData = self.listData.concat(data.data.datas);
                                }

                                if(data.data.last_page == 1 || data.data.last_page == data.data.current_page){
                                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                    self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                }else{
                                    self.$store.commit(combomloading_mt.SET_NOMORE, false);
                                    self.$store.commit(combomloading_mt.SET_LOADING, false);
                                    self.page++;
                                }
                                self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                            }else if(!!data.data && !!data.data.datas && data.data.datas.length == 0){
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                if(self.page == 1){
                                    self.listData = [];
                                    KCucPage.loadPageStatus('noData');
                                    self.$store.commit(combomloading_mt.SET_ISSHOW, false);

                                    // 设置title bar 文案和动作
                                    KCucPage.updateTitleBar({
                                        leftDisplay: false,
                                        leftText: '',
                                        leftAction: '',
                                        rightDisplay: false,
                                        rightText: '清空过期职位',
                                        rightAction: 'clearOverDue'
                                    });
                                } else {
                                    self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                                }
                            }

                            self.$nextTick(function () {
                                //swiped init
                                if (self.platform == 'ios') {
                                    // setTimeout(()=> { //trick for init swipe after template rendered use setTimeout
                                        // self.isShowDelBtn = true;
                                        s3 =  Swiped.init({
                                            query: '.mod-list a',
                                            list: true,
                                            right: 84,
                                        });
                                    // },10)
                                }
                            });
                            

                            if(self.listData.length != 0){
                                // 设置title bar 文案和动作
                                KCucPage.updateTitleBar({
                                    leftDisplay: false,
                                    leftText: '',
                                    leftAction: '',
                                    rightDisplay: true,
                                    rightText: '清空过期职位',
                                    rightAction: 'clearOverDue'
                                });
                            }
                        }else{
                            KCucPage.dataDownloadFinished();
                            if(self.page == 1){
                                self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                                KCucPage.loadPageStatus('loadFailed');

                                // 设置title bar 文案和动作
                                KCucPage.updateTitleBar({
                                    leftDisplay: false,
                                    leftText: '',
                                    leftAction: '',
                                    rightDisplay: false,
                                    rightText: '清空过期职位',
                                    rightAction: 'clearOverDue'
                                });
                            }else{
                                KCwidget.toast('服务器异常');
                                if(self.listData.length != 0){
                                    // 设置title bar 文案和动作
                                    KCucPage.updateTitleBar({
                                        leftDisplay: false,
                                        leftText: '',
                                        leftAction: '',
                                        rightDisplay: true,
                                        rightText: '清空过期职位',
                                        rightAction: 'clearOverDue'
                                    });
                                }
                            }
                        }
                        self.isShowComMid = false;
                    },
                    error:function(xhr, status){
                        KCucPage.dataDownloadFinished();
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(self.page == 1){
                            // 设置title bar 文案和动作
                            KCucPage.updateTitleBar({
                                leftDisplay: false,
                                leftText: '',
                                leftAction: '',
                                rightDisplay: false,
                                rightText: '清空过期职位',
                                rightAction: 'clearOverDue'
                            });
                        }else{
                            if(self.listData.length != 0){
                                // 设置title bar 文案和动作
                                KCucPage.updateTitleBar({
                                    leftDisplay: false,
                                    leftText: '',
                                    leftAction: '',
                                    rightDisplay: true,
                                    rightText: '清空过期职位',
                                    rightAction: 'clearOverDue'
                                });
                            }
                        }
                    },
                    noNetwork: function(){
                        KCucPage.dataDownloadFinished();
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(self.page == 1){
                            // 设置title bar 文案和动作
                            KCucPage.updateTitleBar({
                                leftDisplay: false,
                                leftText: '',
                                leftAction: '',
                                rightDisplay: false,
                                rightText: '清空过期职位',
                                rightAction: 'clearOverDue'
                            });
                        }else{
                            if(self.listData.length != 0){
                                // 设置title bar 文案和动作
                                KCucPage.updateTitleBar({
                                    leftDisplay: false,
                                    leftText: '',
                                    leftAction: '',
                                    rightDisplay: true,
                                    rightText: '清空过期职位',
                                    rightAction: 'clearOverDue'
                                });
                            }
                        }
                    }
                });
            },
            goToDetail(jobId, is_expired, urdData){
                var self = this;
                if (is_expired != 1) {
                    window.location.href = 'doumi://jobdetail?job_id=' + jobId + '&urdData=' + urdData + '&from=favorite';
                }
            },
            deleteFn(item, index) {
                let self = this;
                KCclientInfo.getNetworkType(function(networkData){
                    if (networkData.network != 'invalid') {
                        if (self.platform == 'ios') {
                            self.listData[index].isShowDelBtn = false;
                            //左滑动画
                            self.listData[index].slideOutLeft = true;
                            
                            self.removeFav(item.id, item.city_id, index);
                            s3.forEach((ele) => {
                                ele.close();
                            });
                        }
                    } else {
                        KCwidget.toast('网络异常');
                    }
                });
                
            },
            /*
             * 删除收藏
             * @method removeFav
             * @public
             * @param {Number} postId 收藏职位ID
             * @param {Number} cityId 收藏职位的城市ID
             * @return {Null}
             * @example
             *      this.removeFav();
             * @since 2.3.0
             */
             removeFav (postId, cityId, index) {
                let self = this;
                Util.ajax({
                    url: '/collect/update',
                    data: {
                        platform: self.platform,
                        token: '',
                        postId: postId,
                        cityId: cityId
                    },
                    type: 'POST',
                    timeout: 10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function (data) {
                        if(!!data && data.code == 200){
                            self.listData.splice(index, 1);
                            KCwidget.toast('取消收藏成功');
                            if(self.listData.length == 0){
                                KCucPage.loadPageStatus('noData');
                                self.$store.commit(combomloading_mt.SET_ISSHOW, false);
                                // 设置title bar 文案和动作
                                KCucPage.updateTitleBar({
                                    leftDisplay: false,
                                    leftText: '',
                                    leftAction: '',
                                    rightDisplay: false,
                                    rightText: '清空过期职位',
                                    rightAction: 'clearOverDue'
                                });
                            }
                        } else {
                            KCwidget.toast(data.message);
                        }
                    },
                    error: function (xhr, status) {
                    },
                    noNetwork: function () {
                    }
                });
            }
        },
        created(){
            let self = this;

            self.$store.commit(combomloading_mt.SET_ISSHOW, false);
            self.isShowComMid = true;
            self.initFun();
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/list.css"></style>
<style src="static/css/favorite.css"></style>