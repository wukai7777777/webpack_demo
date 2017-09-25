<template>
    <div class="pagewrap" v-cloak>
        <!-- wrap start -->
        <article class="wd-box mod-margin-box" :style="{height: expHeight}">
            <ul class="mod-label-listwrap mod-com-list wd-list">
                <!-- <li>
                <label class="mod-label">真实姓名：</label>
                <div class="mod-cont input-box">
                <input type="text" class="input s-spacing" placeholder="务必与微信绑定银行卡姓名一致" value=""></div>
                </li> -->
                <li class="mod-li-arr" @click="openWeixin()">
                    <label class="mod-label">微信账号：</label>
                    <div class="mod-cont">
                        <em class="arr-tit f-grey" v-if="nickName == ''">绑定微信账号</em>
                        <template v-else>{{nickName}}</template><i class="mod-arr"></i>
                    </div>
                </li>
            </ul>

            <div class="btnbox">
                <button type="button" class="btn surebtn" :disabled="isDisabled" @click="saveFn()">保存</button>
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
    import KCsafetyApi from 'clientApi/KCsafetyApi'
    import KCsocialApi from 'clientApi/KCsocialApi'
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
                isDisabled: true,
                nickName: '',
                openId: '',
                expHeight: document.documentElement.clientHeight + 'px'
            }
        },
        computed: {

        },
        methods: {
            /**
             * 选择银行
             * @method selectBank
             * @public
             * @return {Null} void
             */
            openWeixin () {
                let self = this;
                KCsocialApi.bindWeixin(function(data){
                    if (!!data && !!data.nickname && !!data.openid) {
                        self.isDisabled = false;
                        self.nickName = data.nickname;
                        self.openId = data.openid; 
                    }
                });
            },
            /**
             * 保存
             * @method saveFn
             * @public
             * @return {Null} void
             */
            saveFn () {
                let self = this;
                self.isDisabled = true;
                KCsafetyApi.dekEncrypt(Util.OS(),function(platforminfo){
                    KCsafetyApi.dekEncrypt(self.nickName,function(nicknameinfo){
                        KCsafetyApi.dekEncrypt(self.openId,function(openidinfo){
                            KCsafetyApi.dekEncrypt('weixin',function(typeinfo){
                                self.doBind(platforminfo, nicknameinfo, openidinfo, typeinfo);
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
                        platform: params[0],
                        token: '',
                        nickname: params[1],
                        openid: params[2],
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
                            KCcache.setMemoryCache('bindType',{type:'weixin'});
                            KCwidget.toast('绑定成功');
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=wx_success');
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
 
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/oold_common.css"></style>
<style src="static/css/applycash.css"></style>