<template>
    <!-- 组件的模板 -->
    <section v-cloak class="mod-content message-topic">
        <!-- message start -->
        <ul class="message-list mod-list">
            <li class="mod-list-item" v-for="item in dataList" v-show="item.data.data.length != 0">
                <div class="message-time">{{item.create_at}}</div>
                <div v-if="item.data.templateType == 2" class="message-info message-topic-info">
                    <ul class="mod-list product-list">
                        <li class="mod-list-item" v-for="(list, index) in item.data.data" @click="goToMessageInfo(list, false)">
                            <a href="javascript:;" class="mod-list-info product-info">
                                <h3 class="product-title" v-show="list.title">{{list.title}}</h3>
                                <div class="product-image" dada-image="images" v-if="index==0 && list.orderSort==1" v-bind:style="{height:(imgW*170)/310+'px', backgroundImage:(list.isShow && list.isTarget) ? 'url('+ list.imageUrl+')' : 'none'}"></div>
                                <div class="product-image" dada-image="images" v-else v-bind:style="{backgroundImage:(list.isShow && list.isTarget) ? 'url('+ list.imageUrl+')' : 'none'}"></div>
                            </a>
                        </li>
                    </ul>
                </div>
                <a v-else-if="item.data.templateType == 1" href="javascript:;" class="message-info" @click="goToMessageInfo(item, true)">
                    <h3 class="message-title" v-if="item.data.data[0].title">{{item.data.data[0].title}}</h3>
                    <div class="message-image" dada-image="images" v-show="item.data.data[0].imageUrl" v-bind:style="{height:(imgW*170)/310+'px', backgroundImage:(item.data.data[0].isShow && item.data.data[0].isTarget) ? 'url('+ item.data.data[0].imageUrl +')' : 'none'}"></div>
                    <div class="message-content" v-show="item.data.data[0].description">{{item.data.data[0].description}}</div>
                    <div class="message-opt">查看详情</div>
                </a>
            </li>
        </ul>
        <!-- loading -->
        <com-bom-loading :load-fn="getData" :check-network="isNetwork"></com-bom-loading>
        <!-- message end -->
        <com-mid-loading top="45%" :com-mid-is-show="isShowComMid" />
    </section>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCmsgPage from 'clientApi/KCmsgPage'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCmsgNewsPage from 'clientApi/KCmsgNewsPage'
    import KCclientInfo from 'clientApi/KCclientInfo'
    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
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
        data: function(){
            return{
                dataList:[],
                isShowComMid: false,
                imgW: document.body.clientWidth-64, //设置图片区域宽度
                page: 1,
                pageSize: 10,
                isNetwork: false,
                messageType: '',
                //imageUrl: [], //所有图片url累加
                curPageUrl: [], // 当前页url
                boxArr: [], //图片高度
                posArr: [], //图片距离顶部相对高度
                clientH: document.documentElement.clientHeight*3/2, //屏幕可视区域改度
                initial: true, //页面初始化时并且更新数据 做个标记
                isAndroid: Util.OS() != 'ios',
                imgNum: 0, //图片预加载索引
                imagesObj: new Array()
            }
        },
        watch:{
            dataList: function(){ //监听数据列表数组增加 执行相应业务
                this.$nextTick(()=>{
                    this.posArr = [];
                    this.boxArr = [];
                    this.images = document.querySelectorAll('[dada-image=images]');
                    let len = this.images.length;
                    for(var i=0; i<len; i++){
                        this.posArr.push(this.getRelativeRect(this.images[i]).top);
                        this.boxArr.push(this.images[i].offsetHeight);
                    }
                })
            }
        },
        methods: {
            /**
             * 获取列表数据
             * @return {[type]} [description]
             */
            getData() {
                let self = this;
                KCmsgNewsPage.getNewsList(self.page, self.pageSize, function(data) {
                    if(data.status == 'success'){
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        self.$store.commit(combomloading_mt.SET_ISSHOW, true);
                        if(!!data && !!data.data && data.data.length > 0){
                            // dataList 添加属性 isShow为false 以及收集 url到数组中
                            self.isShow(data.data);
                            if(self.page == 1){
                                self.dataList = data.data;
                            }else{
                                self.dataList = self.dataList.concat(data.data);
                            }

                            if(data.data.length < self.pageSize){
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                            } else {
                                if(self.page > 1){
                                    self.$store.commit(combomloading_mt.SET_LOADING, false);
                                }
                                self.page++;
                            }
                            //将加载完成的图片控制显示开关打开
                            self.picturePreload(data.data);
                        }else if(!!data && !!data.data && data.data.length == 0){
                            if(self.page == 1){
                                KCucPage.loadPageStatus('noData');
                            }else{
                                self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, false);
                                self.$store.commit(combomloading_mt.SET_NOMORE, true);
                            }    
                        }

                    }else if(data.status == 'error'){
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(self.page==1){
                            KCmsgPage.loadPageStatus('loadFailed');
                        }else{
                            KCwidget.toast(data.message);
                        }
                    }else if(data.status == 'nonet'){
                        self.$store.commit(combomloading_mt.SET_CANNEXTREQUEST, true);
                        if(self.page==1){
                            KCmsgPage.loadPageStatus('netWorkFailed');
                            if (Util.OS() == 'ios') {
                                KCclientInfo.getNetworkType(function(networkData){
                                    Util.openNetworkSetting(networkData.network);
                                });
                            }
                        } else {
                            KCwidget.toast('网络异常');
                        }
                    }
                    self.isShowComMid = false;
                });
            },
            /**
             * 获取元素相对位置
             * @return {[type]} [description]
             */
            getRelativeRect (child) {
                let pos = {
                    top: 0,
                    left: 0
                }
                while (child) {
                    pos.top += child.offsetTop;
                    pos.left += child.offsetLeft;
                    child = child.offsetParent;
                }
                return pos
            },
             /**
             * 判断元素进入可是区域 与离开可是区域 执行相应业务
             * @return {[type]} [description]
             */
            scrollClient(){
                let self = this,
                //len = self.imageUrl.length,
                lens = self.dataList.length,
                iNum = 0,
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                // for(let i=0; i<len; i++){ //直接操作dom 
                //     if(self.posArr[i]>=scrollTop-self.boxArr[i]-self.clientH && self.posArr[i]<=scrollTop+self.clientH){ //进入可是区域
                //         if(self.images[i]){
                //             self.images[i].style.backgroundImage = `url(${self.imageUrl[i]})`;
                //         }
                //     } else { //离开可是区域
                //         if(self.images[i]){
                //             self.images[i].style.backgroundImage = 'none';
                //         }
                //     }
                // }
                for(let i=0; i<lens; i++){ //采用vue数据绑定 提高性能
                    let item = self.dataList[i].data.data;
                    for(let j=0; j<item.length; j++){
                        if(self.posArr[iNum]>=scrollTop-self.boxArr[iNum]-self.clientH*1/3 && self.posArr[iNum]<=scrollTop+self.clientH){ //进入可是区域
                            item[j].isTarget = true;
                        } else { //离开可是区域
                            item[j].isTarget = false;
                        }
                        iNum++;
                    }
                }

            },
            /**
             * dataList对象添加属性isShow为false dataList对象添加属性isTarget为false(区分ios) 
             ＊ 收集图片url到数组中 提前加载图片并将image对象存到数组中 以及格式化时间
             * @return {[type]} [description]
             */
             isShow(datalist){
                 let self = this;
                 self.curPageUrl = [];

                 for(let item of datalist){
                    // 格式化时间
                    item.create_at = Util.timeFormat(item.create_at*1000);
                    for(let list of item.data.data){
                        if(list.imageUrl){
                            //提前预加载图片
                            self.imagesObj[self.imgNum] = new Image();
                            self.imagesObj[self.imgNum].src = list.imageUrl;
                            self.imgNum++;
                            //是否加载完成图片开关控制
                            list.isShow = false;
                            //图片是否到达可是区域
                            if(self.isAndroid){
                                list.isTarget = false;
                            }else{//ios 不做处理
                                list.isTarget = true;
                            }
                            //self.imageUrl.push(list.imageUrl);
                            self.curPageUrl.push(list.imageUrl);
                        }
                    }
                 }
             },
            /**
             * 图片懒加载
             * @return {[type]} [description]
             */
            picturePreload (datalist){
                let self = this,
                len = self.curPageUrl.length,
                imagesObj = self.imagesObj.slice(-len);
                //遍历打开所有预加载完成的图片
                for(let num=0;num<len;num++){
                    imageLoad(num);
                }
                //打开预加载完成的图片
                function imageLoad (num){
                    if(imagesObj[num].complete){  //有缓存
                        for(let item of datalist){
                            for(let list of item.data.data){
                                if(list.imageUrl == imagesObj[num].src){
                                    list.isShow = true;
                                }
                            }
                        }
                    }else{ //没有缓存
                        imagesObj[num].onload = function(){
                            for(let item of datalist){
                                for(let list of item.data.data){
                                    if(list.imageUrl == imagesObj[num].src){
                                        list.isShow = true;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            /**
             * 跳转详情页并埋点
             * @return {[type]} [description]
             */
            goToMessageInfo(item, isSub) {
                let self = this,
                url = '',
                urd = '',
                str = '';
                if(isSub){
                    url = item.data.data[0].redirectUrl;
                }else{
                    url = item.redirectUrl;
                }
                if(/doumi:\/\//.test(url)){
                    urd = url;
                } else {
                    urd = "doumi://browser/" + encodeURIComponent(url);
                }
                if(url.indexOf('?') > -1){
                    if(self.getQueryString(url, 'post_id')){
                        str = self.getQueryString(url, 'post_id');
                    }
                }
                if(str){
                    KCloggerApi.addLog('2',"@atype=click@ca_source=app@ca_name=doumi@ca_from=yyxx@post_id=" + str);
                } else {
                    KCloggerApi.addLog('2',"@atype=click@ca_source=app@ca_name=doumi@ca_from=yyxx@post_id=-");
                }
                window.location.href = urd;
            },
             /**
             * 获取post_id
             * @return {[type]} [description]
             */
            getQueryString(url, name){
                let params = url.substring(url.indexOf('?')),
                paramList = [],
                param = null,
                parami;
                if (params.length > 0) {
                    if (params.indexOf("&") >= 0) {
                        paramList = params.split("&");
                    } else {
                        paramList[0] = params;
                    }
                    for (let i = 0, listLength = paramList.length; i < listLength; i++) {
                        parami = paramList[i].indexOf(name + "=");
                        if (parami >= 0) {
                            param = paramList[i].substr(parami + (name + "=").length);
                        }
                    }
                }
                return param;
            },
            /**
             * 节流函数 当滚动超过一定速度 不触发 handler
             * @return {[type]} [description]
             */
            throttle(seep) {
                let self = this,
                startY = document.documentElement.scrollTop || document.body.scrollTop,
                timer = null,
                startTime = new Date();
                return function() {
                    let curTime = new Date(),
                    endY = document.documentElement.scrollTop || document.body.scrollTop,
                    iSeep = Math.abs(endY-startY)/(curTime - startTime);
                    startY = endY;
                    startTime = curTime;
                    //document.title = iSeep;
                    // 当滚动速度小于一定时 执行筛选条件显示相应图片
                    if( iSeep < seep){
                        self.scrollClient();
                    }
                    //滚动停下来触发
                    if(timer){
                        clearTimeout(timer);
                    }
                    timer = setTimeout(()=>{
                        self.scrollClient();
                    }, 100)
                    
                }
            }
        },
        created(){
            let self = this;
            //处理已读未读消息
            self.messageType = Util.getQueryString('messageType');
            KCmsgPage.setMsgReaded(self.messageType);
            //页面初始化时加载页面数据
            self.$store.commit(combomloading_mt.SET_ISSHOW, false);
            self.isShowComMid = true;
            self.getData();
            //埋点
            KCloggerApi.addLog('1',"/jianzhi/message/zyzx");
            //滚动滚动条
            if(self.isAndroid){
                self.$nextTick(()=>{
                    //监听滚动事件
                    window.addEventListener('scroll', self.throttle(1))
                })
            }

        },
        updated(){
            let self = this;
            if(self.isAndroid){ //只处理安卓
                if(self.initial){
                    self.initial = false;
                    self.$nextTick(()=>{
                        self.scrollClient();
                    })
                }
            }
        }
    }
</script>

<!-- CSS 样式 -->
<style src="static/style/message_topic.css"></style>