<template>
    <!-- page start -->
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content feedback">
            <!-- form start -->
            <div class="form-widget normal">
                <div class="form-group">
                    <div class="form-field vertical">
                        <div class="form-item">
                            <label class="form-label">反馈类型</label>
                            <div class="form-control">
                                <div class="filter-group">
                                    <div class="filter-tips js-touch-state" v-bind:class="isSelected == true?'active':''" v-on:click="selectFeedBackType()">{{feedbackType}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="form-warning">
                            <span>请选择反馈类型</span>
                        </div>
                    </div>
                    <div class="form-field vertical">
                        <div class="form-item">
                            <label class="form-label">情况说明</label>
                            <div class="form-control">
                                <label class="textarea-group">
                                    <textarea class="textarea" cols="" rows="" placeholder="请输入你的反馈意见（字数100字以内）" v-model="feedbackDesc" maxlength="100" v-on:input="checkDesc()" v-on:focus="descFocus()"></textarea>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-opt">
                    <button type="button" class="btn btn-primary btn-large js-touch-state" v-on:click="checkData()">提交</button>
                </div>
            </div>
            <!-- form end -->
        </section>
        <!-- section end -->
    </div>
    <!-- page end -->
</template>

<script>
    /**
     *  引入工具类库 或 模块API
     */
    import Util from 'tool/widget/Util'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'

    /**
     *  组件实例对象
     */
    export default {
        components: { },
        data(){
            return {
                feedbackType: '请选择',
                feedbackDesc: '',
                isSelected: false,
                selectType: 'QUE_CODE_14',
                descInputNum: 0,
                focusDom: null
            }
        },
        vuex: {
            getters: {

            },
            actions: {
                
            }
        },
        methods: {
            selectFeedBackType() {
                var self = this;
                var typeTextList = ['闪退','页面反应慢','死机','数据错误','登录注册问题','提现问题',
'其他'];
                var typeIdList = ['QUE_CODE_14','QUE_CODE_15','QUE_CODE_16','QUE_CODE_17','QUE_CODE_18','QUE_CODE_19','QUE_CODE_20'];
                var selectIndex = typeIdList.indexOf(self.selectType);
                var selected = [selectIndex.toString()];
                // console.log(selected);
                KCclientUI.showPicker({data1:typeTextList},selected,'反馈类型',function(data){
                    if(data.status==1){
                        
                        self.selectType = typeIdList[data.data1];
                        self.isSelected = true;
                        self.feedbackType = typeTextList[data.data1];
                    }
                })
            },
            checkData() {
                var self = this;
                if(self.feedbackType == '请选择'){
                    KCwidget.toast('请填写反馈类型');

                    KCloggerApi.addLog('0','意见反馈页面_提交按钮点击&意见反馈状态&{"状态":"失败反馈类型为空"}');
                }else if(self.feedbackDesc == ''){
                    KCwidget.toast('请填写情况说明');

                    KCloggerApi.addLog('0','意见反馈页面_提交按钮点击&意见反馈状态&{"状态":"失败情况说明为空"}');
                }else{
                    self.submitData();
                }
            },
            checkDesc() {
                var self = this;
                if(self.feedbackDesc.length == 100){
                    if(self.descInputNum > 1){
                        self.descInputNum = 2;
                    }else{
                        self.descInputNum++;
                    }
                    if(self.descInputNum > 1){
                        KCwidget.toast('字数超出范围');
                        KCloggerApi.addLog('0','意见反馈页面_提交按钮点击&意见反馈状态&{"状态":"失败字数超出范围"}');
                    }
                }else{
                    self.descInputNum = 0;
                }
            },
            descFocus() {
                var self = this;
                self.focusDom = $('.textarea')[0];
            },
            submitData() {
                var self = this;
                var desc = encodeURIComponent(self.feedbackDesc);
                KCucPage.loadPageStatus('loading');
                Util.ajax({
                    url:'/complain/submitfeedback?type=' + self.selectType + '&desc=' + desc,
                    timeout:10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        KCucPage.loadPageStatus('loadSuccess');
                        if(!!data && data.code == 1000){
                            KCloggerApi.addLog('0','意见反馈页面_提交按钮点击&意见反馈状态&{"状态":"成功"}');

                            //v2.9.0
                            KCloggerApi.addLog(2,'@atype=click@ca_name=doumi@ca_source=app@ca_from=feedback_success');


                            //如果入口来自个人中心，则获取webViewId以跳转，其他入口没有webviewid
                            let webViewId = Util.getQueryString('webViewId') || '';
                            KCucPage.goBack(0, webViewId);
                            
                            KCwidget.toast('提交成功');
                        }else if(!!data && data.code == -100){
                            //未登录
                            KCucApi.logOut();

                            KCloggerApi.addLog('0','意见反馈页面_提交按钮点击&意见反馈状态&{"状态":"失败登录验证失败"}');
                        }else{
                            KCwidget.toast(data.msg);

                            KCloggerApi.addLog('0','意见反馈页面_提交按钮点击&意见反馈状态&{"状态":"失败"' + data.msg + '}');
                        }
                    },
                    error:function(xhr, status){
                        // KCucPage.loadPageStatus('loadSuccess');
                        KCloggerApi.addLog('0','意见反馈页面_提交按钮点击&意见反馈状态&{"状态":"失败' + toastStr + '"}');
                    },
                    noNetwork: function(){
                        // KCucPage.loadPageStatus('loadSuccess');
                        KCloggerApi.addLog('0','意见反馈页面_提交按钮点击&意见反馈状态&{"状态":"失败网络异常"}');
                    }
                });
            }
        },

        created(){
            var self = this;

            KCucApi.getUserInfo(function(data){
                if(data.userId != 0){
                    KCloggerApi.addLog('0','意见反馈页面展示&页面展现量&{"状态":"登录"}');
                }else{
                    KCloggerApi.addLog('0','意见反馈页面展示&页面展现量&{"状态":"未登录"}');
                }
            });

            if(Util.OS() == 'ios'){
                window.scrollTo = function(){
                    var pos = Util.getAbsPoint(self.focusDom);
                    KCucPage.domPosition(pos.y, $(self.focusDom).height());
                }
            }
        }
        
    }
</script>
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/form.css"></style>
<style src="static/css/feedback.css"></style>