<template>
    <!-- page start -->
    <div class="mod-page">
        <!-- com-mid-loading -->
        <com-mid-loading :com-mid-is-show="isShowPageloading" />
        <!-- section start -->
        <section class="mod-content submit" v-cloak v-show="showBody">
            <!-- form start -->
            <div class="form-widget">
                <template v-for="(submitInfo, submitInfo_index) in submitDatas">
                    <h2 class="form-heading">{{submitInfo.title}}</h2>
                    <div class="form-group">
                        <div class="form-field">
                            <template v-if="submitInfo.type == 0">
                                <label class="textarea-group">
                                    <textarea class="textarea" cols="" rows="" placeholder="输入内容" v-model="submitInfo.value" @focus="textFocus($event)">{{submitInfo.value}}</textarea>
                                </label>
                                <div class="form-warning">
                                    <span>请输入注册手机号码</span>
                                </div>
                            </template>
                            <template v-if="submitInfo.type == 1">
                                <div class="pic-list">
                                    <!-- pic-group为默认，上传中加loading，上传后加active  -->
                                    <div class="pic-group active" v-for="(img, index) in submitInfo.submitImages">
                                        <label class="btn-file">
                                            <img :src="img.url" alt="" @click="editPic(submitInfo.title, submitInfo.submitImages, index)">
                                        </label>
                                    </div>
                                    <div class="pic-group there" v-show="submitInfo.submitImages.length < 6" @click="addImage(submitInfo_index)">
                                        <label class="btn-file">
                                            <img src="" alt="">
                                        </label>
                                    </div>
                                </div>
                                <div class="form-warning">
                                    <span>请上传图片</span>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="form-tips">{{submitInfo.remark}}</div>
                </template>
                <h2 class="form-heading">任务示例</h2>
                <div class="form-group detail-group">
                    <div class="form-field">
                        <div class="pic-list">
                            <div class="pic-group active" v-for="(stepImageUrl, index) in stepImages">
                                <label class="btn-file">
                                    <img :src="stepImageUrl" alt="" @click="lookBigPic(stepImages, index)">
                                </label>
                            </div>
                        </div>
                        <div class="form-warning">
                            <span>请上传图片</span>
                        </div>
                    </div>
                </div>
                <div class="form-opt" v-show="isShowBtn">
                    <button class="btn btn-primary btn-large js-touch-state" type="button" @click="submitFn()">提交<span class="btn-ds">(请在{{finish_remain_time}}内按要求提交)</span></button>
                </div>
            </div>
            <!-- form end -->
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
    import KCucApi from 'clientApi/KCucApi'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCcache from 'clientApi/KCcache'
    import KClocationApi from 'clientApi/KClocationApi'
    import md5 from 'tool/lib/md5'
    import KCol_submitPage from 'clientApi/KCol_submitPage'
    import KCloggerApi from 'clientApi/KCloggerApi'
    
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'

    /**
     *  组件实例对象
     */
    export default {
        components: {
            comMidLoading
        },
        data () {
            return {
                taskId: Util.getQueryString('taskid'),
                task_type: Util.getQueryString('task_type'),
                apply_id: 0,
                submitDatas: [],
                submitImages: [],
                stepImages: [],
                finish_remain_time: '',
                signMd5Str: '',
                focusDom: null,
                isShowBtn: false,
                isShowPageloading: true,
                showBody: false,
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
            initFun (){
                let self = this;
                self.isShowPageloading = true
                KCucApi.getUserInfo(function(data){
                    KCcache.getCache(data.userId + 'uis' + self.taskId, function(cacheData){
                        if (!cacheData) {
                            self.loadData();
                        } else {
                            //有提交数据缓存
                            self.loadData(cacheData);
                        }
                    });
                });
                
                window.successBack = () =>{
                    KCol_submitPage.goBack(1);
                }

                //点击返回的时候调用此函数检查提交内容有修改
                window.checkChange = function () {
                    KCloggerApi.addLog('0', '特工提交页_返回点击&点击量&{"返回按钮":"点击"}');
                    let signMd5_Str = self.signMd5Fn();
                    if (self.signMd5Str != signMd5_Str) {
                        // 有修改 title,message,fn,okBtn,cancelBtn,imageName
                        KCclientUI.showDialog('内容还没提交是否退出?', '', function(data){
                            if(data.status == 1){
                                // 退出之前如果有修改，保存数据
                                KCloggerApi.addLog('0', '特工提交页_返回弹窗点击&退出&{"退出按钮":"点击量"}');
                                // 存储数据
                                KCucApi.getUserInfo(function(data){
                                    KCcache.setCache(data.userId + 'uis' + self.taskId, self.submitDatas, 10 * 24 * 60 * 60);
                                });
                                KCol_submitPage.goBack();
                            }else{
                                KCloggerApi.addLog('0', '特工提交页_返回弹窗点击&继续编辑&{"继续编辑按钮":"点击量"}');
                            }
                        }, '退出', '继续编辑', 'Unsaved');
                    }else{
                        // 直接退出
                        KCol_submitPage.goBack();
                    }
                };

                if (Util.OS() == 'ios') {
                    window.scrollTo = function(){
                        let pos = Util.getAbsPoint(self.focusDom);
                        KCol_submitPage.domPosition(pos.y, $(self.focusDom).height());
                    }
                }

                KCloggerApi.addLog('1','/jianzhi/dmtg/' + self.task_type + '/detail/submit');
            },
            /**
             * 获取数据
             * @method loadData
             * @public
             * @return {Null} void
            */
            loadData (cacheData) {
                let self = this;
                let cityId = 0; // 12 是北京
                KClocationApi.getCity(function(data){
                    if(!data){
                        // 定位失败
                        cityId = 0;
                    }else{
                        cityId = data.cityid;
                    }

                    Util.ajax({
                        url:`/onlinetask/tasksubmitui?cityid=${cityId}&taskid=${self.taskId}`,
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
                                if (!data.data || data.data.length == 0) {
                                    data.data = {
                                        apply_id: '1001',
                                        uis: []
                                    }
                                };

                                self.apply_id = data.data.apply_id;
                                data.data.uis.forEach(function (item, index){
                                    if (item.type == 1) {
                                        item.submitImages = [];
                                    } else if (item.type == 0) {
                                        item.value = '';
                                    }
                                });
                                self.submitDatas = data.data.uis;
                                self.stepImages = data.data.stepimages;
                                self.finish_remain_time = Util.parseSeconds(data.data.finish_remain_time);

                                if (!!cacheData) {
                                    // 渲染缓存数据
                                    cacheData.forEach(function(item, index){
                                        if (item.type == 0) {
                                            self.submitDatas[index].value = item.value;
                                        } else if (item.type == 1) {
                                            item.submitImages.forEach(function(img, si_index){
                                                let falseUrl = img.url;
                                                let falseName = img.name;
                                                if (Util.OS() == 'ios') {
                                                    falseUrl = falseUrl.replace('_100-100c_6-0', '');
                                                    falseName = falseName.replace('_100-100c_6-0', '');
                                                } else {
                                                    falseUrl = falseUrl.replace('_60-60c_6-0', '');
                                                    falseName = falseName.replace('_60-60c_6-0', '');
                                                }
                                                let imgUrl = {
                                                    url: img.url,
                                                    name: falseName,
                                                    falseurl: falseUrl
                                                };
                                                self.submitDatas[index].submitImages.push(imgUrl);
                                            });
                                        }
                                    });
                                }

                                // 生成签名串
                                self.signMd5Str = self.signMd5Fn();

                                // 倒计时
                                Util.countdown(data.data.finish_remain_time, function(str){
                                    self.finish_remain_time = str;
                                }, function(){
                                    KCwidget.toast('倒计时已过期');
                                    setTimeout(function(){
                                        KCol_submitPage.goBack(1);
                                    }, 1500);
                                });
                                self.isShowBtn = true;

                                // 设置title bar 文案和动作
                                KCol_submitPage.updateTitleBar({
                                    backAction: 'checkChange',
                                    leftDisplay: false,
                                    leftText: '',
                                    leftAction: 'checkChange',
                                    rightDisplay: false,
                                    rightText: '',
                                    rightAction: ''
                                });
                                self.showBody = true
                            } else {
                                KCwidget.toast(data.message);
                            }
                            self.isShowPageloading = false;
                        },
                        error: function (xhr, status) {
                            self.isShowPageloading = false;
                        },
                        noNetwork: function () {
                            self.isShowPageloading = false;
                        }
                    });
                });
            },
            /**
             * 添加图片
             * @method addImage
             * @public
             * @return {Null} void
            */
            addImage (index) {
                let self = this;
                KCclientUI.selectAndUploadImage(function (data) {
                    if (data.status == '1') {
                        let falseUrl = data.imageURL;
                        let falseName = data.imageName;
                        if (Util.OS() == 'ios') {
                            falseUrl = falseUrl.replace('_100-100c_6-0', '');
                            falseName = falseName.replace('_100-100c_6-0', '');
                        } else {
                            falseUrl = falseUrl.replace('_60-60c_6-0', '');
                            falseName = falseName.replace('_60-60c_6-0', '');
                        }
                        let imgUrl = {
                            url: data.imageURL,
                            name: falseName,
                            falseurl: falseUrl
                        };

                        self.submitDatas[index].submitImages.push(imgUrl);
                    } else if(data.status == '-1'){
                        KCwidget.toast('图片不能大于5M');
                    } else if(data.status == '0'){
                        KCwidget.toast('上传失败');
                    }
                }, 0, 1);
            },
            /**
             * 编辑图片
             * @method editPic
             * @public
             * @return {Null} void
            */
            editPic (title, submitImages, index) {
                let self = this;
                let imgUrls = [];
                submitImages.forEach(function (img, index){
                    if (Util.OS() == 'ios') {
                        imgUrls.push(img.url.replace('_100-100c_6-0', ''));
                    } else {
                        imgUrls.push(img.url.replace('_60-60c_6-0', ''));    
                    }
                });

                let newImgUrls = imgUrls.map((element, index, array) => {
                    return element.split('@')[0];
                });

                KCclientUI.pictureOperationDialog(title, newImgUrls, index, function(){
                    // 删除图片
                    submitImages.splice(index, 1);
                });
            },
            /**
             * 查看大图
             * @method lookBigPic
             * @public
             * @return {Null} void
            */
            lookBigPic(imgUrls, index) {
                KCclientUI.bigPicturePreview('', imgUrls, index);
            },
            /**
             * 数据签名
             * @method signMd5Fn
             * @public
             * @return {String}
             * @since 2.4.0
            */
            signMd5Fn () {
                let self = this;
                let signatureStr = '';

                self.submitDatas.forEach(function(item, index){
                    if (item.type == 0) {
                        signatureStr += item.value;
                    } else if (item.type == 1) {
                        item.submitImages.forEach(function (img, index){
                            signatureStr += img.url;
                        });
                    }
                });

                return md5(signatureStr);
            },
            textFocus (event) {
                let self = this;
                self.focusDom = event.target;
            },
            /**
             * 提交
             * @method submitFn
             * @public
             * @return {Null} void
            */
            submitFn () {
                let self = this;
                let errorStrTitle = '', errorStrContent = '', errorType = 0, info = [];

                KCloggerApi.addLog('0', '特工提交页_展现&提交按钮点击&{"提交按钮点击":"点击量"}');

                self.submitDatas.forEach(function (item, index) {
                    let perJson = {
                        id: item.id,
                        taskid: self.taskId,
                        title: item.title,
                        type: item.type,
                        remark: item.remark,
                        value: []
                    }
                    if (item.type == 0) {
                        if (item.value == '') {
                            errorStrTitle = '信息填写不全';
                            errorStrContent = '请输入必要的文本';
                            errorType = 0;
                        } else {
                            perJson.value = item.value;
                            info.push(perJson);
                        }
                    } else if (item.type == 1) {
                        if (item.submitImages.length == 0) {
                            errorStrTitle = '信息填写不全';
                            errorStrContent = '请上传必要的图片';
                            errorType = 1;
                        } else {
                            item.submitImages.forEach(function (img, index){
                                perJson.value.push(img.name);
                            });
                            info.push(perJson);
                        }
                    }
                });
                
                if (errorStrTitle != '') {
                    if (errorType == 0) {
                        KCloggerApi.addLog('0','提交按钮点击量&提交失败&{"提交失败":"未填写文本"}');
                    } else {
                        KCloggerApi.addLog('0','提交按钮点击量&提交失败&{"提交失败":"未添加图片"}');
                    }

                    KCwidget.toast('请填写全部内容再提交');
                    
                    return false;
                }

                let cityId = 0; // 12 是北京
                KClocationApi.getCity(function(data){
                    if (!data) {
                        // 定位失败
                        cityId = 0;
                    } else {
                        cityId = data.cityid;
                    }

                    KCol_submitPage.loadPageStatus('loading', '提交中');

                    let postData = {
                        taskid: self.taskId,
                        cityid: cityId,
                        applyid: self.apply_id,
                        info: info
                    };

                    Util.ajax({
                        url:'/onlinetask/submittask',
                        data: postData,
                        type: 'POST',
                        timeout:10000,
                        ctrlStatus: {
                            loading: 0,
                            cache: true,
                            errNum: 0,
                            netNum: 0,
                        },
                        success: function (data) {
                            KCol_submitPage.loadPageStatus('loadSuccess');
                            if (!!data && data.code == 1000) {
                                // 通知客户端提交成功
                                KCol_submitPage.noticeSubmitSuccess();

                                // 清除缓存
                                KCucApi.getUserInfo(function (data) {
                                    KCcache.setCache(data.userId + 'uis' + self.taskId, 0, 0);
                                });

                                KCloggerApi.addLog('0','提交按钮点击量&提交成功&{"任务提交":"提交成功"}');
                                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=submit_success@task_id=' + self.taskId);

                                let hours = data.data.seconds / 60 / 60;
                                let path = 'online-submit-success.html?hours=' + hours + '&task_type=' + self.task_type + '&task_id=' + self.taskId;
                                
                                location.href = 'doumi:////' + encodeURIComponent(path) + '?statusCode=302';

                            } else {
                                KCwidget.toast(data.msg);
                            }
                        },
                        error: function (xhr, status) {
                        },
                        noNetwork: function () {
                        }
                    });
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
<style src="static/css/online_submit.css"></style>