<template>
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content account">
            <!-- nav start -->
            <nav class="nav">
                <ul class="nav-list mod-flex">
                    <li @click="phoneNumLogin()" :class="{active:showNav}" class="nav-item mod-flex-item"><a href="javascript:;" class="nav-info">手机号登录</a></li>
                    <li @click="pLogin()" :class="{active:!showNav}" class="nav-item mod-flex-item"><a href="javascript:;" class="nav-info">密码登录</a></li>
                </ul>
            </nav>
            <!-- nav end -->
            <!-- 手机号登录 -->
            <div class="form-widget" v-show="showNav">
                <div class="form-group">
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">手机号</label>
                            <div class="form-control">
                                <label class="input-group">
                                    <input v-on:focus="inputFocus($event)" type="tel" class="input-text js-focus-dom input-phone" maxlength="11" v-model="inputdata" v-on:input="inputPhoneNum()" placeholder="请输入11位手机号码">
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">验证码</label>
                            <div class="form-control">
                                <div class="multi-group">
                                    <label class="input-group">
                                        <input v-on:focus="inputFocus($event)" type="tel" class="input-text code js-focus-dom input-code" maxlength="6" v-model="codeNum" placeholder="请输入6位验证码">
                                    </label>
                                    <input type="button" v-show="isShowBtn" class="btn btn-info ableBtn active" value="获取验证码" @click="showCaptcha()">
                                    <input type="button" v-show="!isShowBtn" class="btn btn-info unableBtn active" disabled="" :value="val">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-opt">
                    <button type="button" @click="codeLogin()" class="btn btn-primary btn-large js-touch-state">登录</button>
                </div>
                <noidencode></noidencode>
            </div>
            
            <!-- 密码登录 -->
            <div class="form-widget" v-show="!showNav">
                <div class="form-group">
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">手机号</label>
                            <div class="form-control">
                                <label class="input-group">
                                    <input v-on:focus="inputFocus($event)" v-model="phoneNum" v-on:input="inputPhoneNum()" type="tel" class="input-text J_pswPhone js-focus-dom input-phone2" maxlength="11" placeholder="请输入11位手机号码">
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">密&emsp;码</label>
                            <div class="form-control">
                                <label class="input-group">
                                    <input v-on:focus="inputFocus($event)" v-model="psw" type="password" class="input-text J_psw js-focus-dom input-psw" placeholder="请输入密码">
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-opt">
                    <button type="button" class="btn btn-primary btn-large js-touch-state J_pswBtn" @click="pswLogin()">登录</button>
                </div>
                <div class="form-text">
                    <span class="fl">还没有账号?  <a href="javascript:;" @click="goToregister()" class="fc-blue">去注册</a></span>
                    <a href="javascript:;" @click="forgetPsw()" class="fr fc-gray J_resetPwd">忘记密码? </a>
                </div>
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
    import noidencode from 'components/com-noidencode/com-noidencode'
    import * as comnoidencode from 'components/com-noidencode/com-noidencode-mutation-types'

    /**
     *  组件实例对象
     */
    export default {
        components: {
            noidencode
        },
        data: function(){
            return{
                showNav: true,      //验证码登陆和密码登陆切换参数
                // isShowNoNum: false, //
                inputdata:'',       //验证码登陆时输入的手机号
                codeNum:'',         //验证码
                phoneNum:'',        //密码登录时输入的手机号
                psw:'',             //密码登录时输入的密码
                isShowBtn:false,    
                val: '获取验证码',
                timer: null,
                isCountDown:false
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
                this.$store.commit(comnoidencode.SET_LOG_SOURCE, '登录页面');
                KCloggerApi.addLog('0','登录页面&页面展现量&{"密码登录":"展现量"}')
            },
            phoneNumLogin(){
                if(!this.showNav) {
                    this.showNav = true;
                    this.inputdata = this.phoneNum;
                    this.inputPhoneNum();
                    KCloggerApi.addLog('0','登录页面&页面展现量&{"手机号登录":"展现量"}')
                    //2.8.5
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=phone_num')
                }
            },
            pLogin(){
                if(this.showNav) {
                    this.showNav = false;
                    this.phoneNum = this.inputdata;
                    KCloggerApi.addLog('0','登录页面&页面展现量&{"密码登录":"展现量"}')
                    //2.8.5
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=code')
                }
            },
            // noNum(){
            //     this.isShowNoNum = !this.isShowNoNum
            //     KCloggerApi.addLog('0','登录点击收不到验证码按钮&按钮点击&{"来源":"登录页面"}')
            // },
            inputPhoneNum(){
                var self = this
                if(self.showNav) {
                    self.inputdata = /\d*/.exec(self.inputdata)[0];
                    if(self.isCountDown){return}
                    //匹配手机号输入的规则
                    self.isShowBtn = (self.inputdata.length === 11 && /^1[34578]\d{9}$/.test(self.inputdata))
                }else {
                    //禁止输入非数字字符
                    self.phoneNum = /\d*/.exec(self.phoneNum)[0];
                }
            },
            
             /**
             * 调起客户端验证图片验证码验证流程
             * @return {[type]} [description]
             */
            showCaptcha() {
                var self = this;
                KCclientUI.showCaptcha2Dialog('请输入验证码',self.inputdata,"default", function(data){
                    if(data.status == 1) {
                        self.inputWait(60);
                    }else{
                       self.isShowBtn = true
                    }   
                });  
            },
            // getCode(){
            //     var self=this;
            //     self.isShowBtn = false;
            //     Util.ajax({
            //         url:'/authCkCode?mobile='+self.inputdata+'&platform='+Util.OS()+'&token=',
            //         type: 'POST',
            //         timeout:10000,
            //         success:function(data){
            //             self.inputWait(60)
            //         },
            //         error:function(xhr, status){
            //             if(status=='timeout'){
            //                 KCwidget.toast('网络请求超时');
            //                 self.isShowBtn = true
            //             }else{
            //                 if(xhr.status==400){
            //                     var err=JSON.parse(xhr.responseText);
            //                     if(err.code==-3){
            //                         self.showCaptcha();
            //                     }else{
            //                         KCwidget.toast(err.message);
            //                         self.isShowBtn = true
            //                     }
            //                 }else{
            //                     KCwidget.toast('服务器异常');
            //                     self.isShowBtn = true
            //                 }
            //             }
            //         },
            //         noNetwork:function(){
            //             KCwidget.toast('网络异常');
            //             self.isShowBtn = true
            //         }
            //     })
            // },
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
            },
            codeLogin(){
                var self = this
                var phoneNumber = self.inputdata
                var code = self.codeNum
                if(!!phoneNumber && !!code ){
                    KCucApi.logIn(phoneNumber,code,'',{},function(){
                        KCloggerApi.addLog('0','登录页面&登录按钮点击量&{"登录按钮":"点击量"}')
                        clearInterval(self.timer)
                        self.isShowBtn = true
                        self.val = '获取验证码'
                    }) 
                }else if(!phoneNumber){
                    KCclientUI.alertDialog('','手机号不能为空');
                }else if(!code) {
                    KCclientUI.alertDialog('','验证码不能为空');
                } 
            },
            pswLogin(){
                var self = this
                var phoneNumber = self.phoneNum
                var psw = self.psw
                if(!!phoneNumber && !!psw){
                    KCsafetyApi.dekEncrypt(psw,function(info){
                        psw=info
                        KCucApi.logIn(phoneNumber,'',psw,{},function(){
                            KCloggerApi.addLog('0','登录页面&登录按钮点击量&{"登录按钮":"点击量"}')
                        })  
                    })  
                }else if(!phoneNumber){
                    KCclientUI.alertDialog('','手机号不能为空');
                }else if(!psw){
                    KCclientUI.alertDialog('','密码不能为空');
                }   
            },
            forgetPsw(){
                if(!!this.phoneNum) {
                    window.location.href = 'doumi://reset?tj=/jianzhi/login/findpwd&mobile=' + this.phoneNum;
                }else {
                    window.location.href = 'doumi://reset?tj=/jianzhi/login/findpwd';
                }
            },
            /**
             * 点击去注册
             * @return {[type]} [description]
             */
            goToregister() {
                if(!!this.phoneNum) {
                    window.location.href = 'doumi://register?mobile=' + this.phoneNum;
                }else {
                    window.location.href = 'doumi://register';
                }
            },
            // phoneCall(){
            //     KCclientUI.showPhoneDialog('010-57977077','','呼叫','取消','Service',function(data){
            //         if(data.status==1){}
            //     })
            // },
            inputFocus(obj) {
                var self = this;
                self.focusDom = obj.currentTarget;
            }
        },
        created(){
            var self = this;
            self.testLog = 0;   //埋点测试
            self.initFun();
            if(Util.OS() == 'ios'){
                window.scrollTo = function(){
                    var pos = Util.getAbsPoint(self.focusDom);
                    KCucPage.domPosition(pos.y,self.focusDom.clientHeight);
                }
            }
            // 3.1.0设置注册页已注册状态手机 点击去登录跳转至登录页后的手机号
            window.setPhoneNumber=function(num){
                self.phoneNum = num + '';
            };
            window.phoneLoginTab = function (){
                self.inputdata = self.phoneNum;
                self.showNav = true;
                self.inputPhoneNum()
            }
            window.pageExit = function(){
                var number,code;
                if(self.showNav){
                    number = self.inputdata;
                    code = self.codeNum;
                }else{
                    number = self.phoneNum;
                    code = self.psw;
                }
                if(!number){
                    KCloggerApi.addLog('0','登录_退出登录界面&点击界面返回按钮&{"输入框状态":"未填写手机号"}',self.testLog);
                }
                if(!code){
                    KCloggerApi.addLog('0','登录_退出登录界面&点击界面返回按钮&{"输入框状态":"未填写验证码"}',self.testLog);
                }else{
                    KCloggerApi.addLog('0','登录_退出登录界面&点击界面返回按钮&{"输入框状态":"已填写"}',self.testLog); 
                }
            };
            window.deviceExit=function(){
                var number,code;
                if(self.showNav){
                    number = self.inputdata;
                    code = self.codeNum;
                }else{
                    number = self.phoneNum;
                    code = self.psw;
                }
                if(!number){
                    KCloggerApi.addLog('0','登录_退出登录界面&Device Back Key&{"输入框状态":"未填写手机号"}',self.testLog);
                }
                if(!code){
                    KCloggerApi.addLog('0','登录_退出登录界面&Device Back Key&{"输入框状态":"未填写验证码"}',self.testLog);
                }else{
                    KCloggerApi.addLog('0','登录_退出登录界面&Device Back Key&{"输入框状态":"已填写"}',self.testLog); 
                }
            };
        }
    }
    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/form.css"></style>
<style src="static/css/account.css"></style>