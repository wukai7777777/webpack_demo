<template>
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content account">
            <!-- form start -->
            <div class="form-widget">
                <div class="form-group">
                    <div class="form-field" v-show="showPhoneNumInput">
                        <div class="form-item">
                            <label class="form-label">手机号</label>
                            <div class="form-control">
                                <label class="input-group">
                                    <input v-on:input="inputPhoneNum()" v-model="phoneNum" v-on:focus="inputFocus($event)" type="tel" class="input-text J_inputPhone js-focus-dom input-phone" maxlength="11" placeholder="请输入11位手机号码">
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">密&emsp;码</label>
                            <div class="form-control">
                                <div class="multi-group">
                                    <label class="input-group">
                                        <input v-if="showIconEye" v-model="psw" v-on:focus="inputFocus($event)" type="password" class="input-text J_psw js-focus-dom input-psw" minlength="6" maxlength="12" placeholder="请输入6-12位数字字母组合">
                                        <input v-else v-model="psw" v-on:focus="inputFocus($event)" type="input" class="input-text J_psw js-focus-dom input-psw" minlength="6" maxlength="12" placeholder="请输入6-12位数字字母组合">
                                    </label>
                                    <i @click="showPsw()" class="icon icon-eye J_iconEye" :class="{'active': showIconEye}" ></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">验证码</label>
                            <div class="form-control">
                                <div class="multi-group">
                                    <label class="input-group">
                                        <input v-model="code" v-on:focus="inputFocus($event)" type="tel" class="input-text code js-focus-dom input-code" maxlength="6" placeholder="请输入6位验证码">
                                    </label>
                                    <input @click="showCaptcha()" v-show="isShowBtn" type="button" class="btn btn-info ableBtn active" value="获取验证码">
                                    <input v-show="!isShowBtn" type="button" class="btn btn-info unableBtn active" disabled="" :value="val">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-opt">
                    <input @click="sureReset()" type="button" class="btn btn-primary btn-large js-touch-state J_sureBtn" value="重置密码">
                </div>

                <Noidencode></Noidencode>
            </div>
            <!-- form end -->
        </section>
    </div>     
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    
    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */
    import KCclientUI from 'clientApi/KCclientUI'
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCsafetyApi from 'clientApi/KCsafetyApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCucPage from 'clientApi/KCucPage'
    import Noidencode from 'components/com-noidencode/com-noidencode'
    import * as comnoidencode from 'components/com-noidencode/com-noidencode-mutation-types'

    /**
     *  组件实例对象
     */
    export default {
        components: {
            Noidencode
        },
        data: function(){
            return{
                focusDom:null,
                // isShowNotice:false,
                typeValue:'password',
                showIconEye: false,
                phoneNum:'',
                psw:'',
                code:'',
                isShowBtn: false,
                val:'获取验证码',
                isCountDown:false,
                showPhoneNumInput:true
            }
        },
        vuex: {
            getters: {

            },
            actions: {
                
            }
        },
        methods: {
            /**
             * 初始化
             * @method initFun
             * @public
             * @return {Null} void
             */
            initFun (){
                this.$store.commit(comnoidencode.SET_LOG_SOURCE, '重置页面');
                 //3.1.0 在登录界面先填写了手机号（密码登录方式），然后点击「忘记密码」，手机号带到重置密码页面上
                let mobile = Util.getQueryString('mobile');
                if(!!mobile) {
                    this.phoneNum = mobile;
                    this.inputPhoneNum(); 
                }
            },
            // noNum(){
            //     this.isShowNotice = true
            //     KCloggerApi.addLog('0','登录点击收不到验证码按钮&按钮点击&{"来源":"重置页面"}')
            // },
            // closeNotice(){
            //     this.isShowNotice = false
            // },
            inputFocus(obj) {
                var self = this;
                self.focusDom = obj.currentTarget;
            },
            // getHelp(){
            //     KCclientUI.showPhoneDialog('010-57977077','','呼叫','取消','Service',function(data){
            //         if(data.status==1){}
            //     });
            // },
            showPsw(){
                this.typeValue = this.typeValue == 'password' ? 'input' : 'password';
                this.showIconEye = !this.showIconEye;
            },
            sureReset(){
                var self = this
                KCloggerApi.addLog('0','忘记密码页面&找回密码按钮点击量&{"忘记密码":"点击量"}')
                var phoneNumber = self.phoneNum
                var code = self.code
                var psw = self.psw
                if(!!phoneNumber && !!code ){
                    KCsafetyApi.dekEncrypt(psw,function(info){
                        psw=info;
                        KCucApi.reset(phoneNumber,code,psw,{},function(){
                            
                        });
                    });  
                }else if(!phoneNumber){
                    KCclientUI.alertDialog('','手机号不能为空')
                }else if(!psw){
                    KCclientUI.alertDialog('','密码不能为空')
                }else if(!code) {
                    KCclientUI.alertDialog('','验证码不能为空')
                }
            },
            inputPhoneNum(){
                if(this.isCountDown){return}
                //匹配手机号输入的规则
                this.isShowBtn = (this.phoneNum.length === 11 && /^1[34578]\d{9}$/.test(this.phoneNum))
            },
             /**
             * 调起客户端验证图片验证码验证流程
             * @return {[type]} [description]
             */
            showCaptcha() {
                var self = this;
                KCclientUI.showCaptcha2Dialog('请输入验证码',self.phoneNum,"default", function(data){
                    if(data.status == 1) {
                        self.inputWait(60);
                    }else{
                       self.isShowBtn = true
                    }   
                });  
            },
            //直接请求手机验证码
            // getCode(){
            //     var self=this;
            //     self.isShowBtn = false;
            //     Util.ajax({
            //         url:'/authCkCode?mobile='+self.phoneNum+'&platform='+Util.OS()+'&token=',
            //         type: 'POST',
            //         timeout:10000,
            //         success:function(data){
            //             self.inputWait(60)
            //         },
            //         error:function(xhr, status){
            //             if(status=='timeout'){
            //                 self.isShowBtn = true
            //                 KCwidget.toast('网络请求超时');
            //             }else{
            //                 if(xhr.status==400){
            //                     var err=JSON.parse(xhr.responseText);
            //                     if(err.code==-3){
            //                         self.showCaptcha();
            //                     }else{
            //                         self.isShowBtn = true
            //                         KCwidget.toast(err.message);
            //                         self.isShowBtn = true;
            //                     }
            //                 }else{
            //                     self.isShowBtn = true
            //                     KCwidget.toast('服务器异常');
            //                     self.isShowBtn = true;
            //                 }
            //             }
            //         },
            //         noNetwork:function(){
            //             self.isShowBtn = true
            //             KCwidget.toast('网络异常');
            //             self.isShowBtn = true;
            //         }
            //     });
            // },
            //发送手机验证码倒计时
            inputWait(num){
                var self = this
                self.isCountDown = true
                self.val = num + 's后重发'
                self.isShowBtn = false
                self.timer = setInterval(function(){
                    num --
                    self.val = num + 's后重发'
                    self.isShowBtn = false
                    if(num == -1){
                        clearInterval(self.timer)
                        self.isCountDown = false
                        self.val = '请输入验证码'
                        self.isShowBtn = true
                    }
                },1000)
            }

        },
        created(){
            var self = this
            this.initFun()
            KCucApi.getUserInfo(function(data){
                // console.log(JSON.stringify(data))
                if(data.userId!=0 || data.phoneNumber!=0){
                    self.showPhoneNumInput = false
                    self.isShowBtn = true
                    self.phoneNum = data.phoneNumber
                }
            })
            //ios获取焦点native下移处理
            if(Util.OS() == 'ios'){
                window.scrollTo = function(){
                    var pos = Util.getAbsPoint(self.focusDom)
                    KCucPage.domPosition(pos.y,self.focusDom.clientHeight)
                }
            }

            KCloggerApi.addLog('1','/jianzhi/resetting_code');
        }
        
    }

    
</script>
<style>
    .hidden{
        display: none;
    }
</style>
<!-- CSS 样式 -->
<style src="static/style/account.css"></style>