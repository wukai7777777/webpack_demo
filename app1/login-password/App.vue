<template>
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
                                    <input @focus="inputFocus($event)" v-model="phoneNum" @input="inputPhoneNum()" type="tel" class="input-text" maxlength="11" placeholder="请输入11位手机号码">
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">密码</label>
                            <div class="form-control">
                                <label class="input-group">
                                    <input @focus="inputFocus($event)" v-model="psw" type="password" class="input-text" placeholder="请输入密码">
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-opt">
                    <button type="button" class="btn btn-primary btn-large" @click="pswLogin()">登录</button>
                </div>
                <div class="form-text">
                    <a href="javascript:;" class="fc-gray fl" @click="goToregister()">注册新账号</a>
                    <a href="javascript:;" class="fc-gray fr" @click="forgetPsw()">忘记密码? </a>
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

    /**
     *  组件实例对象
     */
    export default {
        components: {

        },
        data () {
            return {
                phoneNum: Util.getQueryString('phoneNum') || '',        //密码登录时输入的手机号
                psw: '',             //密码登录时输入的密码
                focusDom: {},
                testLog: 0     //埋点测试
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
                let self = this;
                self.inputdata = /\d*/.exec(self.inputdata)[0];
                if(self.isCountDown){return}
                //匹配手机号输入的规则
                self.isShowBtn = (self.inputdata.length === 11 && /^1[34578]\d{9}$/.test(self.inputdata));
            },
            /**
             * 密码登录
             * @method pswLogin
             * @public
             * @return {Null} void
             */
            pswLogin(){
                let self = this;
                let phoneNumber = self.phoneNum;
                let psw = self.psw;
                if(!!phoneNumber && !!psw){
                    KCsafetyApi.dekEncrypt(psw,function(info){
                        psw = info
                        KCucApi.logIn(phoneNumber,'',psw,{},function(){
                            KCloggerApi.addLog('0','登录页面&登录按钮点击量&{"登录按钮":"点击量"}');
                        })  
                    })  
                }else if(!phoneNumber){
                    KCclientUI.alertDialog('','手机号不能为空');
                }else if(!psw){
                    KCclientUI.alertDialog('','密码不能为空');
                }   
            },
            /**
             * 忘记密码
             * @method forgetPsw
             * @public
             * @return {Null} void
             */
            forgetPsw(){
                let self = this;
                //3.2.0
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=forgetcode');
                if(!!self.phoneNum) {
                    window.location.href = 'doumi://reset?tj=/jianzhi/login/findpwd&mobile=' + self.phoneNum;
                }else {
                    window.location.href = 'doumi://reset?tj=/jianzhi/login/findpwd';
                }
            },
            /**
             * 点击去注册
             * @method goToregister
             * @public
             * @return {[type]} [description]
             */
            goToregister() {
                let self = this;
                //3.2.0
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=register');
                if(!!self.phoneNum) {
                    window.location.href = 'doumi://register?mobile=' + self.phoneNum;
                }else {
                    window.location.href = 'doumi://register';
                }
            }
        },
        beforeCreate() {

        },
        created() {
            let self = this;
            
            KCloggerApi.addLog('1','/jianzhi/login/code');

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

            window.pageExit = function(){
                let number,code;
                number = self.inputdata;
                code = self.codeNum;
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
                number = self.inputdata;
                code = self.codeNum;
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