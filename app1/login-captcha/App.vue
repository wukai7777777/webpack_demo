<template>
    <div>
        <!-- page start -->
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
                                        <input @focus="inputFocus($event)" type="tel" class="input-text" maxlength="11" v-model="inputdata" @input="inputPhoneNum()" placeholder="请输入11位手机号码">
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
                                            <input @focus="inputFocus($event)" type="tel" class="input-text" maxlength="6" v-model="codeNum" placeholder="请输入6位验证码">
                                        </label>
                                        <input type="button" class="btn btn-info" :disabled="!isShowBtn" @click="showCaptcha()" :value="val"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-opt">
                        <button type="button" class="btn btn-primary btn-large" @click="codeLogin()">登录</button>
                    </div>
                    <div class="form-text">
                        <a href="javascript:;" class="fc-gray fl" @click="goToLoginPassword">密码登录</a>
                        <span class="fc-gray fr" data-role="target-code" @click="showNoidencode">无法获取验证码？</span>
                    </div>
                </div>
                <div class="form-widget login-bingo">
                    <div class="form-hr"><b>或</b></div>
                    <div class="form-opt">
                        <button type="button" class="btn btn-link btn-large" @click="fastLogin">本机号一键登录</button>
                    </div>
                    <div class="form-text">
                        <label class="checkbox-group">
                            <input type="checkbox" :checked="isAgree" v-model="isAgree">
                            <span>同意中国移动和通行证联合授权登录</span>
                        </label>
                    </div>
                </div>
                <!-- form end -->
            </section>
            <!-- section end -->
        </div>
        <noidencode ref="noidencode"></noidencode>
        <!-- page end -->
    </div>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import KCclientUI from 'clientApi/KCclientUI'
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCsafetyApi from 'clientApi/KCsafetyApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCucPage from 'clientApi/KCucPage'
    
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import noidencode from 'components/com-noidencode/com-noidencode'
    import * as noidencode_mt from 'components/com-noidencode/com-noidencode-mutation-types'

    /**
     *  组件实例对象
     */
    export default {
        components: {
            noidencode
        },
        data () {
            return {
                inputdata:'',       //验证码登陆时输入的手机号
                codeNum:'',         //验证码
                isShowBtn:false,    
                val: '获取验证码',
                timer: null,
                isCountDown:false,
                focusDom: {},
                testLog: 0,     //埋点测试
                isAgree: true
            }
        },
        computed: {

        },
        methods: {
            /**
             * 输入框焦点
             * @method inputFocus
             * @public
             * @return {Null} void
             */
            inputFocus(obj) {
                let self = this;
                self.focusDom = obj.currentTarget;
            },
            /**
             * 手机号输入
             * @method inputPhoneNum
             * @public
             * @return {Null} void
             */
            inputPhoneNum(){
                let self = this
                self.inputdata = /\d*/.exec(self.inputdata)[0];
                if(self.isCountDown){return}
                //匹配手机号输入的规则
                self.isShowBtn = (self.inputdata.length === 11 && /^1[34578]\d{9}$/.test(self.inputdata))
            },
            /**
             * 调起客户端验证图片验证码验证流程
             * @method showCaptcha
             * @public
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
            /**
             * 验证码登录
             * @method codeLogin
             * @public
             * @return {Null} void
             */
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
            /**
             * 输入等待
             * @method inputWait
             * @param num 时间（s）
             * @public
             * @return {Null} void
             */
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
                        self.val = '获取验证码'
                        self.isShowBtn = true
                    }
                },1000)
            },
            /**
             * 跳转至密码登录
             * @method goToLoginPassword
             * @public
             * @return {Null} void
             */
            goToLoginPassword () {
                let self = this;
                let phoneNum = '';
                if (!!self.inputdata) {
                    phoneNum = `?phoneNum=${self.inputdata}`;
                }
                //3.2.0
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=code');
                window.location.href = `doumi://login-password${phoneNum}`;
            },
            /**
             * 无法获取验证码
             * @method showNoidencode
             * @public
             * @return {Null} void
             */
            showNoidencode () {
                let self = this;
                //3.2.0
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=noyzm');
                self.$refs.noidencode.showMessage();
            },
            /**
             * 一键登录
             * @method fastLogin
             * @public
             * @return {Null} void
             */
            fastLogin () {
                let self = this;
                //3.2.0
                // KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=onestep');
                if (self.isAgree) {
                    KCucApi.fastLogin(function(data){
                        if (data.status == 0) {
                            //3.2.0
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=onestep_fail');
                            KCwidget.toast('登录失败，请使用手机号和验证码重试');
                        } else {
                            //3.2.0
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=onestep_success');
                        }
                    });
                } else {
                    KCwidget.toast('登录失败，请使用手机号和验证码重试');
                }
            }
        },
        beforeCreate() {

        },
        created() {
            let self = this;
            
            KCloggerApi.addLog('1','/jianzhi/login/yzm');

            self.$store.commit(noidencode_mt.SET_IS_SHOW_ENTRY, false);
            this.$store.commit(noidencode_mt.SET_LOG_SOURCE, '登录页面');
            if(Util.OS() == 'ios'){
                window.scrollTo = function(){
                    var pos = Util.getAbsPoint(self.focusDom);
                    KCucPage.domPosition(pos.y,self.focusDom.clientHeight);
                }
            }

            window.pageExit = function(){
                let number,code;
                number = self.phoneNum;
                code = self.psw;
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
                let number,code;
                number = self.phoneNum;
                code = self.psw;

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
<style src="static/style/account.css"></style>