<template>
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content complain">
            <!-- form start -->
            <div class="form-widget normal">
                <div class="form-tips">斗米会保护你的个人隐私，请放心投诉</div>
                <div class="form-group">
                    <div class="form-field vertical">
                        <div class="form-item">
                            <label class="form-label">投诉类型</label>
                            <div class="form-control">
                                <div class="filter-group">
                                    <div class="filter-tips js-touch-state" :class="{ active: selectStatus}" @click="selectComplainTypeFn()">{{selectComplainTypeText}}</div> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-field vertical">
                        <div class="form-item">
                            <label class="form-label">情况说明</label>
                            <div class="form-control">
                                <label class="textarea-group">
                                    <textarea class="textarea" cols="" rows="" placeholder="请具体描述您所遇到的情况，我们会尽快处理您的投诉信息（字数100字以内）" v-model="complainText" maxlength="100" @input="checkComplainText()" @focus="descFocus()"></textarea>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-opt" @click="checkComplainCon">
                    <button type="button" class="btn btn-primary btn-large js-touch-state">提交</button>
                </div>
            </div>
            <!-- form end -->
        </section>
        <!-- section end -->
    </div>    
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
                complainListTypeData: [],
                complainListTextData: [],
                complainListDataStatus: false,
                selectComplainType: '',
                selectComplainTypeText: '请选择投诉类型',
                complainText: '',
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
            initFun () {
                let self = this;

                let task_title = '';
                if (Util.OS() == 'ios') {
                    task_title = decodeURIComponent(Util.getQueryString('post_title'));
                }else{
                    task_title = Util.getQueryString('post_title');
                }
                KCloggerApi.addLog('1','/jianzhi/dmtg/complain&task_id=' + Util.getQueryString('task_id') + '&task_title=' + task_title);

                
                if(Util.OS() == 'ios'){
                    window.scrollTo = function () {
                        let pos = Util.getAbsPoint(self.focusDom);
                        KCucPage.domPosition(pos.y, $(self.focusDom).height());
                    }
                }
            },
            /**
             * 获取特工投诉类型列表
             * @method loadComplainTypeList
             * @public
             * @return {Null} void
             */
            loadComplainTypeList () {
                let self = this;
                KCucPage.loadPageStatus('loading');
                Util.ajax({
                    url:'/onlinetask/complaintypes',
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
                            let typeArr = [],
                                textArr = [];
                            for(let name in data.data){
                                typeArr.push(data.data[name].type);
                                textArr.push(data.data[name].desc);
                            }
                            self.complainListTypeData = typeArr;
                            self.complainListTextData = textArr;
                            self.complainListDataStatus = true;
                            KCclientUI.showPicker({data1:self.complainListTextData},['' + self.pickerIndex + ''], '请选择投诉类型', function (data) {
                                if (data.status == 1) {
                                    self.pickerIndex = data.data1;
                                    self.selectComplainType = self.complainListTypeData[data.data1];
                                    self.selectComplainTypeText = self.complainListTextData[data.data1];
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
             * 选择特工投诉类型
             * @method selectComplainTypeFn
             * @public
             * @return {Null} void
             */
            selectComplainTypeFn () {
                let self = this;
                if (self.complainListDataStatus) {
                    KCclientUI.showPicker({data1:self.complainListTextData}, ['' + self.pickerIndex + ''],'请选择投诉类型', function (data) {
                        if (data.status == 1) {
                            self.pickerIndex = data.data1;
                            self.selectComplainType = self.complainListTypeData[data.data1];
                            self.selectComplainTypeText = self.complainListTextData[data.data1];
                            self.selectStatus = true;
                        }
                    });
                } else {
                    self.loadComplainTypeList();
                }
            },
            /**
             * 提交
             * @method updateComplain
             * @public
             * @return {Null} void
             */
            updateComplain () {
                let self = this;
                let complainUpdateText = '';
                KCucPage.loadPageStatus('loading');
                complainUpdateText = '【' + decodeURIComponent(Util.getQueryString('status_str')) + '】' + self.complainText;
                complainUpdateText = encodeURIComponent(complainUpdateText);
                Util.ajax({
                    url:'/onlinetask/complain?type=' + self.selectComplainType + '&description=' + complainUpdateText + '&taskid=' + Util.getQueryString('task_id'),
                    type: 'POST',
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
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=submit_detai@ca_from=complain_success@task_id=' + Util.getQueryString('task_id'));
                            KCucPage.goBack();
                            KCwidget.toast('投诉提交成功');
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
             * 校验输入
             * @method checkComplainCon
             * @public
             * @return {Null} void
             */
            checkComplainCon () {
                let self = this;
                let ct = self.complainText;
                let resultStr = ct.replace(/\ +/g,"");//去掉空格
                resultStr = resultStr.replace(/[ ]/g,"");    //去掉空格
                resultStr = resultStr.replace(/[\r\n]/g,"");//去掉回车换行
                if (self.selectComplainType == '') {
                    KCwidget.toast('请选择投诉类型');
                    return false;
                } else if (self.complainText == '' || resultStr == 0) {
                    KCwidget.toast('请输入情况说明');
                    return false;
                } else if (self.complainText.length > 100) {
                    KCwidget.toast('情况说明字数大于100');
                    return false;
                } else {
                    self.updateComplain();
                }
            },
            /**
             * 投诉说明输入校验
             * @method loadComplainTypeList
             * @public
             * @return {Null} void
             */
            checkComplainText () {
                let self = this;
                if (self.complainText.length == 100) {
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
             * @method loadComplainTypeList
             * @public
             * @return {Null} void
             */
            descFocus () {
                let self = this;
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
<style src="static/css/form.css"></style>
<style src="static/css/complain.css"></style>