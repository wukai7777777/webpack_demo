<template>
    <div class="pagewrap" v-cloak>
        <!-- wrap start -->
        <article class="wd-box mod-margin-box" :style="{height: expHeight}">
            <ul class="mod-label-listwrap mod-com-list wd-list">
                <li>
                  <label class="mod-label">真实姓名：</label>
                  <div class="mod-cont input-box">
                    <input type="text" class="input" placeholder="务必与支付宝绑定姓名一致" value="" v-model="realName" @focus="textFocus()"></div>
                </li>
                <li class="js-touch-state">
                  <label class="mod-label">支付宝账号：</label>
                  <div class="mod-cont input-box">
                    <input type="text" class="input" placeholder="请填写正确的支付宝账号" value="" v-model="account" @focus="textFocus()"></div>
                </li>
            </ul>

            <div class="btnbox">
                <button type="button" class="btn surebtn" :disabled="!realName || !account || isDisabled" @click="saveFn()">保存</button>
            </div>
        </article>
        <!-- wrap end --> 
    </div>
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
    import KCsafetyApi from 'clientApi/KCsafetyApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import Util from 'tool/widget/Util'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCwidget from 'clientApi/KCwidget'
    import KCcache from 'clientApi/KCcache'
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
                isDisabled: false,
                focusDom: null,
                realName: '',
                account: '',
                expHeight: document.documentElement.clientHeight + 'px'
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
                if (Util.OS() == 'ios') {
                    window.scrollTo = function(){
                        let pos = Util.getAbsPoint(self.focusDom);
                        KCucPage.domPosition(pos.y, $(self.focusDom).height());
                    }
                }
            },
            /**
             * 焦点获取
             * @method textFocus
             * @public
             * @return {Null} void
             */
            textFocus () {
                let self = this;
                self.focusDom = $('.input')[0];
            },
            /**
             * 保存
             * @method saveFn
             * @public
             * @return {Null} void
             */
            saveFn () {
                let self = this;
                // if (self.realName == '') {
                //     KCwidget.toast('真实姓名不能为空');
                // } else if (self.account=='') {
                //     KCwidget.toast('支付宝账号不能为空');
                // } else {
                    self.isDisabled = true;
                    self.bindalipay(self.realName, self.account);
                // }
            },
            /**
             * 加密
             * @method bindalipay
             * @public
             * @return {Null} void
             */
            bindalipay (name, account) {
                let self = this;
                KCsafetyApi.dekEncrypt(Util.OS(), function(platforminfo){
                    KCsafetyApi.dekEncrypt(name, function(nameinfo){
                        KCsafetyApi.dekEncrypt(account, function(accountinfo){
                            KCsafetyApi.dekEncrypt('alipay', function(typeinfo){
                                self.doBind(nameinfo, accountinfo, platforminfo, typeinfo);
                            });    
                        });
                    });
                });
            },
            /**
             * 绑定
             * @method doBind
             * @public
             * @return {Null} void
             */
            doBind (...params) {
                let self = this;
                Util.ajax({
                    url: '/ucenter/account',
                    data: {
                        platform: params[2],
                        token: '',
                        true_name: params[0],
                        account: params[1],
                        type: params[3]
                    },
                    type: 'POST',
                    timeout: 10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function (data) {
                        if (!!data && data.code == 0) {
                            KCucPage.goBack(1);
                            KCcache.setMemoryCache('bindType', {type:'alipay'});
                            KCwidget.toast('绑定成功');
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=zfb_success');
                        } else {
                            self.isDisabled = false;
                            KCwidget.toast(data.message);
                        }
                    },
                    error: function (xhr, status) {
                        self.isDisabled = false;
                    },
                    noNetwork: function () {
                        self.isDisabled = false;
                    }
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
<style src="static/css/oold_common.css"></style>
<style src="static/css/applycash.css"></style>