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
                                    <div class="filter-tips js-touch-state" v-bind:class="{ active: selectStatus}" @click="selectComplainTypeFn()">{{selectComplainTypeText}}</div> 
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
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCucApi from 'clientApi/KCucApi'
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
                complainListTypeData:[],
                complainListTextData:[],
                complainListDataStatus:false,
                selectComplainType:'',
                selectComplainTypeText:'请选择投诉类型',
                complainText:'',
                selectStatus:false,
                pickerIndex:0,
                descInputNum:0,
                focusDom:null
            }
        },
        computed: {

        },
        methods: {
            initFun(){
                var self=this;
                KCucApi.getUserInfo(function(data){
                    if(data.userId!=0){
                        KCloggerApi.addLog('0', '我的兼职_投诉页面展现&页面展现量&{"状态":"登录"}');
                    }else{
                        KCloggerApi.addLog('0', '我的兼职_投诉页面展现&页面展现量&{"状态":"未登录"}');
                    }
                });

                KCloggerApi.addLog('0', '投诉页面_展现量&投诉页面_展现量&');
                
                let post_title = '';
                if (Util.OS() == 'ios') {
                    post_title = decodeURIComponent(Util.getQueryString('post_title'));
                }else{
                    post_title = Util.getQueryString('post_title');
                }
                KCloggerApi.addLog('1','/jianzhi/complain&post_id=' + Util.getQueryString('id') + '&post_title=' + post_title);
            },
            loadComplainList(){
                var self=this;
                KCucPage.loadPageStatus('loading');
                Util.ajax({
                    url:'/complain/gettype',
                    timeout:10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        KCucPage.loadPageStatus('loadSuccess');
                        if(!!data && data.code==1000){
                            var typeArr=[],
                                textArr=[];
                            for(var name in data.data){
                                typeArr.push(data.data[name].type);
                                textArr.push(data.data[name].desc);
                            }
                            self.complainListTypeData=typeArr;
                            self.complainListTextData=textArr;
                            self.complainListDataStatus=true;
                            KCclientUI.showPicker({data1:self.complainListTextData},[''+self.pickerIndex+''],'请选择投诉类型',function(data){
                                if(data.status==1){
                                    self.pickerIndex=data.data1;
                                    self.selectComplainType=self.complainListTypeData[data.data1];
                                    self.selectComplainTypeText=self.complainListTextData[data.data1];
                                    self.selectStatus=true;
                                }
                            });
                        }else if(!!data && data.code== -100){
                            KCucApi.logOut();
                        }else{
                            KCwidget.toast(data.msg);
                        }
                    },
                    error:function(xhr, status){
                    },
                    noNetwork:function(){
                    }
                });
            },
            selectComplainTypeFn(){
                var self=this;
                if(self.complainListDataStatus){
                    KCclientUI.showPicker({data1:self.complainListTextData},[''+self.pickerIndex+''],'请选择投诉类型',function(data){
                        if(data.status==1){
                            self.pickerIndex=data.data1;
                            self.selectComplainType=self.complainListTypeData[data.data1];
                            self.selectComplainTypeText=self.complainListTextData[data.data1];
                            self.selectStatus=true;
                        }
                    });
                }else{
                    self.loadComplainList();
                }
            },
            updateComplain(){
                var self=this;
                var complainUpdateText='';
                KCucPage.loadPageStatus('loading');
                complainUpdateText='【'+decodeURIComponent(Util.getQueryString('status_str'))+'】'+self.complainText;
                complainUpdateText=encodeURIComponent(complainUpdateText);
                Util.ajax({
                    url:'/complain/submit?type='+self.selectComplainType+'&desc='+complainUpdateText+'&postid='+Util.getQueryString('id'),
                    timeout:10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        KCucPage.loadPageStatus('loadSuccess');
                        if(!!data && data.code==1000){
                            KCwidget.toast('投诉提交成功');
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@from=' + Util.getQueryString('fromForComplain') + '@ca_from=complain_success@post_id=' + Util.getQueryString('id'));
                            KCloggerApi.addLog('0', '我的兼职_投诉页面_提交按钮点击&投诉状态&{"状态":"成功"}');
                            KCucPage.goBack();
                        }else if(!!data && data.code==-100){
                            KCloggerApi.addLog('0', '我的兼职_投诉页面_提交按钮点击&投诉状态&{"状态":"失败登录验证失败"}');
                            KCucApi.logOut();
                        }else{
                            KCwidget.toast(data.msg);
                            KCloggerApi.addLog('0', '我的兼职_投诉页面_提交按钮点击&投诉状态&{"状态":"失败'+data.msg+'"}');
                        }
                    },
                    error:function(xhr, status){
                        KCloggerApi.addLog('0', '我的兼职_投诉页面_提交按钮点击&投诉状态&{"状态":"失败服务器异常"}');
                    },
                    noNetwork:function(){
                        KCloggerApi.addLog('0', '我的兼职_投诉页面_提交按钮点击&投诉状态&{"状态":"失败网络异常"}');
                    }
                });
            },
            checkComplainCon(){
                var self=this;
                let fromForComplain = Util.getQueryString('fromForComplain');
                let fromStr = '';
                if (fromForComplain == 'wdjz') {
                    fromStr = '我的兼职页面';
                } else if (fromForComplain == 'detail') {
                    fromStr = '报名后职位详情页';
                } else if (fromForComplain == 'tsyfk') {
                    fromStr = '个人中心_投诉与反馈_职位投诉';
                }
                KCloggerApi.addLog('0','提交按钮_点击量&提交按钮_点击量&{"来源":"' + fromStr + '"}');

                var ct = self.complainText;
                var resultStr=ct.replace(/\ +/g,"");//去掉空格
                resultStr=resultStr.replace(/[ ]/g,"");    //去掉空格
                resultStr=resultStr.replace(/[\r\n]/g,"");//去掉回车换行
                if(self.selectComplainType==''){
                    KCwidget.toast('请选择投诉类型');
                    KCloggerApi.addLog('0', '我的兼职_投诉页面_提交按钮点击&投诉状态&{"状态":"失败请选择投诉类型"}');
                    return false;
                }else if(self.complainText==''||resultStr == 0){
                    KCwidget.toast('请输入情况说明');
                    KCloggerApi.addLog('0', '我的兼职_投诉页面_提交按钮点击&投诉状态&{"状态":"失败请输入情况说明"}');
                    return false;
                }else if(self.complainText.length>100){
                    KCwidget.toast('情况说明字数大于100');
                    KCloggerApi.addLog('0', '我的兼职_投诉页面_提交按钮点击&投诉状态&{"状态":"失败情况说明字数大于100"}');
                    return false;
                }else{
                    self.updateComplain();
                }
            },
            checkComplainText(){
                var self = this;
                if(self.complainText.length == 100){
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
                    self.descInputNum=0;
                }
            },
            descFocus() {
                var self = this;
                self.focusDom = $('.textarea')[0];
            }
        },
        beforeCreate() {

        },
        created() {
            let self=this;
            self.initFun();
            if(Util.OS() == 'ios'){
                window.scrollTo = function(){
                    var pos = Util.getAbsPoint(self.focusDom);
                    KCucPage.domPosition(pos.y, $(self.focusDom).height());
                }
            }
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/form.css"></style>
<style src="static/css/complain.css"></style>