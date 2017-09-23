<template>
    <div class="pagewrap" v-cloak>
        <!-- wrap start -->
        <article class="wd-box mod-margin-box" :style="{height: expHeight}">
          <ul class="mod-label-listwrap  mod-com-list wd-list">
            <li>
              <label class="mod-label">真实姓名：</label>
              <div class="mod-cont input-box">
                <input type="text" class="input" placeholder="务必与绑定银行卡姓名一致" value="" v-model="true_name" @focus="textFocus()"></div>
            </li>
            <li class="mod-li-arr" @click="selectBank()">
                <label class="mod-label">开户银行：</label>
                <div class="mod-cont">
                    <em class="arr-tit f-grey" v-if="bank_name == ''">选择开户行</em>
                    <template v-else>{{bank_name}}</template><i class="mod-arr"></i>
                </div>
            </li>

            <li class="js-touch-state">
              <label class="mod-label">银行卡号：</label>
              <div class="mod-cont input-box">
                <input type="tel" class="input" placeholder="必填" value="" v-model="card_number" @focus="textFocus()"></div>
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
    import KCloggerApi from 'clientApi/KCloggerApi'
    import Util from 'tool/widget/Util'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCclientUI from 'clientApi/KCclientUI'
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
                true_name: '',
                bank_name: '',
                card_number: '',
                canSelectBank: false,
                bankList: [],
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
                self.getBankList();
                if(Util.OS() == 'ios'){
                    window.scrollTo = function(){
                        let pos = Util.getAbsPoint(self.focusDom);
                        KCucPage.domPosition(pos.y, $(self.focusDom).height());
                    }
                }
            },
            getBankList() {
              let self = this;
              Util.ajax({
                url: '/ucenter/validbanklist',
                timeout: 10000,
                ctrlStatus: {
                    loading: 0,
                    cache: false,
                    errNum: 0,
                    netNum: 0,
                },
                success: function (data) {
                  if (!!data && data.bank_list) {
                    let bankList = [];
                    for(let name in data.bank_list){
                        bankList.push(data.bank_list[name]);
                    }
                    self.bankList = bankList;
                    self.canSelectBank = true;
                  } else {
                      KCwidget.toast('服务器异常');
                  }
                },
                error: function (xhr, status) {
                },
                noNetwork: function () {
                }
              });
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
             * 选择银行
             * @method selectBank
             * @public
             * @return {Null} void
             */
            selectBank () {
                let self = this;
                if(self.canSelectBank){
                    let nativeJson = {data1: self.bankList};
                    KCclientUI.showPicker(nativeJson,['0'],'选择开户行',function(data){
                        if(data.status == 1){
                            let bankPos = data.data1;//返回的是index
                            self.callbackbank = self.bankList[bankPos]; 
                            self.bank_name = self.bankList[bankPos];
                        }
                    });
                }else{
                    KCwidget.toast('银行信息正在准备中,请稍后选择');
                }
            },
            /**
             * checkName
             * @method checkName
             * @public
             * @return {Bool} void
             */
            checkName (name) {
                let len = name.length <= 20;
                name = name.replace(/·/,'');
                // 0x4E00→0x9FA5
                let reg=/[\u4e00-\u9fa5]/;
                let newStr = name.replace(reg, function (s) {
                    let tmp='';
                    for(let i = 0; i < s.length; i++){
                        tmp += 1;
                    }
                    return tmp;
                });
                return !!(len && Number(parseInt(newStr)));
            },
            /**
             * 保存
             * @method saveFn
             * @public
             * @return {Null} void
             */
            saveFn () {
                let self = this;
                if(self.true_name==''){
                    KCwidget.toast('姓名不能为空');
                }else if(!self.checkName(self.true_name)){
                    KCwidget.toast('请输入正确姓名');
                }else if(self.callbackbank == ''){
                    KCwidget.toast('请先选择银行');
                }else if(self.card_number == ''){
                    KCwidget.toast('银行卡号不能为空');
                }else if(!!self.card_number && (self.card_number.length < 16 || self.card_number.length > 19)){
                    KCwidget.toast('请输入正确的银行卡号');
                }else{
                    self.isDisabled = true;
                    self.sendBankInfo();
                }
            },
            /**
             * 加密
             * @method sendBankInfo
             * @public
             * @return {Null} void
             */
            sendBankInfo () {
                let self = this;
                KCsafetyApi.dekEncrypt(Util.OS(),function (platforminfo) {
                    KCsafetyApi.dekEncrypt('bank',function (typeinfo) {
                        KCsafetyApi.dekEncrypt(self.true_name,function (nameinfo) {
                            KCsafetyApi.dekEncrypt(self.bank_name,function (bankinfo) {
                                KCsafetyApi.dekEncrypt(self.card_number,function (numberinfo) {
                                    self.doBind(platforminfo, typeinfo, nameinfo, bankinfo, numberinfo);
                                });
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
                        type: params[1],
                        true_name: params[2],
                        bank_name: params[3],
                        card_number: params[4]
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
                            KCcache.setMemoryCache('bindType',{type:'bank'});
                            KCwidget.toast('绑定成功');
                            KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=yhk_success');
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