<template>
    <div class="dm-app-warp">
        <div class="mod-page">
            <!-- section start -->
                <section class="mod-content income" :class="{'mod-footbar-show' : platform == 'ios'}">
                    <div class="mod-column list bc-main">
                        <div class="mod-column-head com-border-bottom">
                            <h2 class="mod-column-title">特工收入</h2>
                        </div>
                        <div class="mod-column-body">
                            <ul class="mod-list">
                                <li v-for="item in listData" class="mod-list-item mod-flex com-border-bottom">
                                    <div class="product-info mod-flex-item">
                                        <h3>{{item.title}}</h3>
                                        <p class="fc-gray">{{item.desc}}</p>
                                    </div>
                                    <div class="product-meta">
                                        <span class="money fc-red"><b>+{{item.amount}}</b>元</span>
                                        <span class="date fc-gray">{{item.gottime}}</span>
                                    </div>
                                </li>
                            </ul>
                            <com-bom-loading :load-fn="loadData"/>
                        </div>
                    </div>
                </section>
            <!-- section end -->
        </div>
        <com-mid-loading top="45%" :com-mid-is-show="isShowComMid" />
    </div>
        
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
     import Util from 'tool/widget/Util'
     import KCwidget from 'clientApi/KCwidget'
     import KCucApi from 'clientApi/KCucApi'
     import KCucPage from 'clientApi/KCucPage'
     import KCclientInfo from 'clientApi/KCclientInfo'
     import KCloggerApi from 'clientApi/KCloggerApi'
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
        data: function() {
            return {
                cutPage: 1,
                pageSize: 20,
                hsot: '',
                // noDataDomHeight: 0, // 《没有更多数据》 DOM高度
                clientHeight: $(window).height(),
                endBottom: true, //是否开启监听到底部事件
                listData: [], 
                isShowComMid: false
            }
        },
        computed: {

        },
        methods: {
            /**
             * 加载数据
             * @method loadData
             * @public
             * @return {Null} void
             */
            loadData (){
                let self = this;
                Util.ajax({
                    url : "/onlinetask/userincome",
                    data:{
                        page:self.cutPage,
                        pagesize:self.pageSize
                    },
                    timeout : 10000,
                    ctrlStatus: {
                        loading: self.cutPage,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success : function(data){
                        // console.log(data)
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(!!data && data.data && data.code == '1000'){
                            //时间戳转换
                            $.each(data.data.incomes, function(i, item){
                                let timestr = new Date(item.gottime * 1000);
                                let month = timestr.getMonth() + 1;
                                let day = timestr.getDate();
                                data.data.incomes[i].gottime = month + "/" + day;
                            });

                            if(!!data && !!data.data && data.data.incomes.length > 0){
                                if(self.cutPage == 1){
                                    self.listData = data.data.incomes;
                                }else{
                                    self.listData = self.listData.concat(data.data.incomes);
                                }
                                if(data.data.last_page == 1 || data.data.last_page == data.data.current_page){
                                    self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                    self.$store.commit(combomloading_mt.SET_NOMORE, true);
                                }else{
                                    self.$store.commit(combomloading_mt.SET_NOMORE, false);
                                    self.$store.commit(combomloading_mt.SET_LOADING, false);
                                    self.cutPage++;
                                }
                            }else if(!!data && !!data.data && data.data.incomes.length == 0){
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                            }
                        }else{
                            if(self.cutPage == 1){
                                KCucPage.loadPageStatus('loadFailed');
                            }else{
                                KCwidget.toast(data.msg);
                            }
                        }
                        self.isShowComMid = false;
                        self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                        KCucPage.dataDownloadFinished(); //显示去我的我的钱包按钮
                    },
                    error : function(xhr, status){
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        self.isShowComMid = false;
                    },
                    noNetwork: function(){
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        self.isShowComMid = false;
                    }
                });
            },
        },
        beforeCreate() {
            window.jump=function(){
                window.location.href = "doumi://userwallet";
            };

            KCucApi.getUserInfo(function(data){
                if(data.userId!=0){
                    KCloggerApi.addLog('0','特工收入_展现&已登录&{"详情页展现":"已登录"}');
                }else{
                    KCloggerApi.addLog('0','特工收入_展现&未登录&{"详情页展现":"未登录"}');
                }
            });
        },
        created() {
            let self = this;
            self.isShowComMid = true;
            self.loadData();
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/online-income.css"></style>



