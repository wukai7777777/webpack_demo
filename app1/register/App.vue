<template>
    
    <!-- 组件的模板 -->
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content account">
            <!-- form start -->
            <div class="form-widget">
                <div class="form-group">
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">手机号</label>
                            <div class="form-control">
                                <label class="input-group">
                                    <input type="tel" class="input-text J_inputPhone js-focus-dom" maxlength="11" placeholder="请输入11位手机号码" v-model="inputPhone">
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
                                        <input v-if="showIconEye" type="password" class="input-text J_psw js-focus-dom" minlength="6" maxlength="12" placeholder="请输入6-12位数字字母组合" v-model="inputPassword">
                                        <input v-else type="input" class="input-text J_psw js-focus-dom" minlength="6" maxlength="12" placeholder="请输入6-12位数字字母组合" v-model="inputPassword">
                                    </label>
                                    <i class="icon icon-eye" :class="{'active': showIconEye}" @click="swichIconEye"></i>
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
                                        <input type="tel" class="input-text js-focus-dom" maxlength="6" placeholder="请输入6位验证码" v-model="inputCode">
                                    </label>
                                    <input type="button" class="btn btn-info js-touch-state active" v-model="getCodeText" :disabled="setUnableBtn || showUnableBtn" @click="showCaptcha">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-opt">
                    <input type="button" class="btn btn-primary btn-large js-touch-state" value="注册" @click="registerBtn">
                </div>

                <noidencode></noidencode>
                <div class="form-text form-text-bottom J_agreement">注册表示同意<a href="doumi://agreement " class="fc-blue">《斗米兼职协议》</a></div>
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
    import Util from 'tool/widget/Util'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCsafetyApi from 'clientApi/KCsafetyApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import Vue from 'vue'
    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */
    import Noidencode from 'components/com-noidencode/com-noidencode'
    import * as comnoidencode from 'components/com-noidencode/com-noidencode-mutation-types'

    let timer = null;//计时器   
    let focusDom = null; // 当前获取焦点的表单元素
    let canRequest = true;
    /**
     *  组件实例对象
     */
    export default {
        components: {
            Noidencode
        },
        data: function(){
            return{
                inputPhone: '',
                inputPassword: '',
                inputCode: '',
                getCodeText: '获取验证码',
                showIconEye: false,
                // showMessageFlag: false,
                setUnableBtn: false

            }
        },
        computed: {
            showUnableBtn: function() {
                return !(this.inputPhone.length === 11 && /^1[34578]\d{9}$/.test(this.inputPhone));
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
                KCloggerApi.addLog('1','/jianzhi/register');
                this.$store.commit(comnoidencode.SET_LOG_SOURCE, '注册页面');
                KCloggerApi.addLog('0','注册页面&注册页面展现量&{"注册页面":"展现量"}');

                // 设置电话号码
                window.setPhoneNumber = (num) => {
                    // num 为 number类型，为保证计算属性showUnableBtn计算正确，统一转化为String类型
                    this.inputPhone = num + ''; 
                    this.setCodeBtn(false);
                };

                // 获取焦点
                window.inputFocus = function() {
                    $('.J_inputPhone').focus();
                };

                // 处理ios键盘遮挡的输入框的情况
                if(Util.OS() == 'ios'){
                    window.scrollTo = function() {
                        var pos = Util.getAbsPoint(focusDom);
                        KCucPage.domPosition(pos.y, $(focusDom).height())
                    }
                }

                $('body').on('focus', '.js-focus-dom', function(){
                    focusDom = $(this)[0];
                })

                //3.1.0 在登录界面先填写了手机号，然后点击「去注册」，手机号带到注册页面上
                this.inputPhone = Util.getQueryString('mobile') || '';
            },
            /**
             * 切换密码输入框密码明／＊显示
             * @return {[type]} [description]
             */
            swichIconEye() {
                this.showIconEye = !this.showIconEye;
            },
            /**
             * 点击获取验证码
             * 成功返回数据则表示发送成功，进行倒计时
             * 进入error 且code为-3 进行图片验证码校验
             * @return {[type]} [description]
             */
            // getCode() {
            //     var self = this;
            //     canRequest = false;
            //     clearTimeout(timer);
            //     self.setCodeBtn(true);
            //     KCloggerApi.addLog('0','登录_点击获取验证码按钮&按钮点击&{"来源":"注册页面"}');
            //     Util.ajax({
            //         url:'/authCkCode',
            //         type: 'POST',
            //         dataType:'json',
            //         data:{
            //             mobile:self.inputPhone,
            //             platform:Util.OS(),
            //             token:''
            //         },
            //         timeout:10000,
            //         success:function(data) {
            //             canRequest = true;
            //             self.clock(60);
            //         },
            //         error:function(xhr, status){
            //             canRequest = true;
            //             if(status=='timeout'){
            //                 KCwidget.toast('网络请求超时');
            //             }else{
            //                 if(xhr.status==400){
            //                     var err=JSON.parse(xhr.responseText);
            //                     if(err.code===-3){
            //                         self.showCaptcha();
            //                     }else{
            //                         KCwidget.toast(err.message);
            //                         self.setCodeBtn(false);
            //                     }
            //                 }else{
            //                     KCwidget.toast('服务器异常');
            //                     self.setCodeBtn(false);
            //                 }
            //             }                      
            //         },
            //         noNetwork: function(){
            //             canRequest = true;
            //             self.setCodeBtn(false);
            //             KCwidget.toast('网络异常');
            //         }
            //     });
            // },
            /**
             * 获取验证码计时器
             * @param  {[type]} num [description]
             * @return {[type]}     [description]
             */
            clock(num) {
                var self = this;
                self.setCodeBtn(true);
                clearTimeout(timer);
                if(num <= 0) {
                    self.setCodeBtn(false);
                    return;
                }
                let n = num<10?'0'+num:''+num;
                self.getCodeText = n + '秒后重发';
                num--;
                timer = setTimeout(function() {
                    self.clock(num);
               },1000)
            },
            
            /**
             * 调起客户端验证图片验证码验证流程
             * @return {[type]} [description]
             */
            showCaptcha() {
                var self = this;
                KCloggerApi.addLog('0','登录_点击获取验证码按钮&按钮点击&{"来源":"注册页面"}');
                KCclientUI.showCaptcha2Dialog('请输入验证码',self.inputPhone,"default", function(data){
                    if(data.status == 1) {
                        self.clock(60);
                    }else{
                       self.setCodeBtn(false); 
                    }   
                });  
            },
            /**
             *  注册按钮
             * @return {[type]} [description]
             */
            registerBtn() {
                var self = this;
                //防止其他请求过程中点击注册按钮
                if(!canRequest) {
                    return
                }
                KCloggerApi.addLog('0','注册页面&注册按钮点击量&{"注册按钮":"点击量"}');
                let password = self.inputPassword;
                if(!!self.inputPhone && !!self.inputCode){
                    KCsafetyApi.dekEncrypt(password, function(info) {
                        password = info;
                        KCucApi.register(self.inputPhone, self.inputCode, password, {}, function () {
                            clearTimeout(timer);
                            self.setCodeBtn(false);
                        });
                    });
                }else if(!self.inputPhone){
                    KCclientUI.alertDialog('','手机号不能为空');
                }else if(!password){
                    KCclientUI.alertDialog('','密码不能为空');
                }else if(!self.inputCode) {
                    KCclientUI.alertDialog('','验证码不能为空');
                } 
            },
            setCodeBtn (param) {
                this.setUnableBtn = param;
                this.getCodeText = param ? this.getCodeText : '获取验证码';
            }
        },
        created(){
            this.initFun();
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/style/account.css"></style>