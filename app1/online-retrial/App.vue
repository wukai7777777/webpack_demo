<template>
    <!-- page start -->
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content submit submit-appeal">
            <!-- form start -->
            <div class="form-widget">
                <h2 class="form-heading">重审类型</h2>
                <div class="form-group">
                    <div class="form-field">
                        <div class="filter-group">
                            <div class="filter-tips js-touch-state" v-bind:class="{ active: selectStatus}" @click="selectRetrialTypeFn()">{{selectRetrialTypeText}}</div>
                        </div>
                    </div>
                </div>
                <h2 class="form-heading">具体描述</h2>
                <div class="form-group">
                    <div class="form-field">
                        <label class="textarea-group">
                            <textarea class="textarea" cols="" rows="" placeholder="请填写重审内容（字数100字以内）" v-model="retrialText" maxlength="100" @input="checkRetrialText()" @focus="descFocus()"></textarea>
                        </label>
                    </div>
                </div>
                <div class="form-opt">
                    <button class="btn btn-primary btn-large js-touch-state" type="button" @click="checkRetrialCon">提交</button>
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
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCwidget from 'clientApi/KCwidget'
    
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
                retrialListTypeData: [],
                retrialListTextData: [],
                retrialListDataStatus: false,
                selectRetrialType: '',
                selectRetrialTypeText: '请选择重审类型',
                retrialText: '',
                selectStatus: false,
                pickerIndex: 0,
                descInputNum: 0,
                focusDom: null
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
                let task_title = '';
                if (Util.OS() == 'ios') {
                    task_title = decodeURIComponent(Util.getQueryString('post_title'));
                }else{
                    task_title = Util.getQueryString('post_title');
                }
                KCloggerApi.addLog('1','/jianzhi/dmtg/reaudit&task_id=' + Util.getQueryString('task_id') + '&task_title=' + task_title);
                
            },
            /**
             * 获取重审类型
             * @method loadRetrialTypeList
             * @public
             * @return {Null} void
             */
            loadRetrialTypeList () {
                let self = this;
                KCucPage.loadPageStatus('loading');
                Util.ajax({
                    url:'/onlinetask/appealtypes',
                    timeout:10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function (data) {
                        KCucPage.loadPageStatus('loadSuccess');
                        if (!!data && data.code == 1000) {
                            var typeArr = [],
                                textArr = [];
                            for(let name in data.data){
                                typeArr.push(data.data[name].type);
                                textArr.push(data.data[name].desc);
                            }
                            self.retrialListTypeData = typeArr;
                            self.retrialListTextData = textArr;
                            self.retrialListDataStatus = true;
                            KCclientUI.showPicker({data1:self.retrialListTextData},['' + self.pickerIndex + ''], '请选择重审类型', function (data) {
                                if (data.status == 1) {
                                    self.pickerIndex = data.data1;
                                    self.selectRetrialType = self.retrialListTypeData[data.data1];
                                    self.selectRetrialTypeText = self.retrialListTextData[data.data1];
                                    self.selectStatus = true;
                                }
                            });
                        }else {
                            KCwidget.toast(data.msg);
                        }
                    },
                    error: function (xhr, status) {
                    },
                    noNetwork: function () {
                    }
                });
            },
            /**
             * 选择重审类型
             * @method selectRetrialType
             * @public
             * @return {Null} void
             */
            selectRetrialTypeFn () {
                let self=this;
                if (self.retrialListDataStatus) {
                    KCclientUI.showPicker({data1:self.retrialListTextData}, ['' + self.pickerIndex + ''],'请选择重审类型', function (data) {
                        if (data.status == 1) {
                            self.pickerIndex = data.data1;
                            self.selectRetrialType = self.retrialListTypeData[data.data1];
                            self.selectRetrialTypeText = self.retrialListTextData[data.data1];
                            self.selectStatus = true;
                        }
                    });
                } else {
                    self.loadRetrialTypeList();
                }
            },
            /**
             * 提交
             * @method updateRetrial
             * @public
             * @return {Null} void
             */
            updateRetrial () {
                let self = this;
                KCucPage.loadPageStatus('loading');
                let retrialUpdateText = encodeURIComponent(self.retrialText);
                Util.ajax({
                    url:'/onlinetask/appeal?description=' + retrialUpdateText + '&applyid=' + Util.getQueryString('apply_id'),
                    timeout:10000,
                    type: 'POST',
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function (data) {
                        KCucPage.loadPageStatus('loadSuccess');
                        if (!!data && data.code == 1000) {
                            KCwidget.toast('重审提交成功');
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=reaudit_success@task_id=' + Util.getQueryString('task_id'));
                            KCucPage.goBack(1, '', {"type":'retrialSuccess'});
                        }else {
                            KCclientUI.showDialog("申请重审失败", data.msg, function (data) {
                                KCucPage.goBack();
                            }, "确定", '','Fail');
                        }
                    },
                    error: function (xhr, status) {
                    },
                    noNetwork: function () {
                    }
                });
            },
            /**
             * 校验输入
             * @method checkRetrialCon
             * @public
             * @return {Null} void
             */
            checkRetrialCon () {
                let self = this;
                let ct = self.retrialText;
                let resultStr = ct.replace(/\ +/g,"");//去掉空格
                resultStr = resultStr.replace(/[ ]/g,"");    //去掉空格
                resultStr = resultStr.replace(/[\r\n]/g,"");//去掉回车换行
                if (self.selectRetrialType == '') {
                    KCwidget.toast('请选择重审类型');
                    return false;
                } else if (self.retrialText == '' || resultStr == 0) {
                    KCwidget.toast('请输入情况说明');
                    return false;
                } else if (self.retrialText.length > 100) {
                    KCwidget.toast('情况说明字数大于100');
                    return false;
                } else {
                    self.updateRetrial();
                }
            },
            /**
             * 校验重审说明输入
             * @method checkRetrialText
             * @public
             * @return {Null} void
             */
            checkRetrialText () {
                let self = this;
                if (self.retrialText.length == 100) {
                    if (self.descInputNum > 1) {
                        self.descInputNum = 2;
                    } else {
                        self.descInputNum++;
                    }
                    if (self.descInputNum > 1) {
                        KCwidget.toast('字数超出范围');
                    }
                } else {
                    self.descInputNum = 0;
                }
            },
            /**
             * 焦点处理
             * @method descFocus
             * @public
             * @return {Null} void
             */
            descFocus () {
                var self = this;
                self.focusDom = $('.textarea')[0];
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