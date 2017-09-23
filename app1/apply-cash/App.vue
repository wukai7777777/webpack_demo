<template>
    <!-- 组件的模板 -->
    <div class="pagewrap">
        <!-- loading -->
        <section class="page-loading" :class="{'active': showLoading}">
            <div class="spinner">
                <div class="spinny"></div>
            </div>
        </section>
        <!-- 页面体 -->
        <article class="wd-box mod-margin-box" v-cloak v-show="!showLoading" :style="{height: expHeight}">
            <!-- 编辑提现方式 -->
            <ul class="mod-label-listwrap mod-com-list addwd-list" v-if="showEdit">
                <template v-for="item in data.payment_account">
                    <li v-if="item.type == 'weixin' && !!item.account">
                        <label class="mod-label"><span class="wd-icons-wx"></span></label>
                        <div class="mod-cont">
                            <h3 class="addwd-tit">微信钱包 <i class="wd-tag-forthwith">即时</i></h3>
                            <h4 class="addwd-txt">{{item.account}}</h4>
                            <span class="optr wd-del-btn" @click="setUnbind('weixin')">解绑</span>
                      </div>
                    </li>
                    <li v-if="item.type == 'alipay' && !!item.account">
                        <label class="mod-label"><span class="wd-icons-alipay"></span></label>
                        <div class="mod-cont">
                            <h3 class="addwd-tit">支付宝</h3>
                            <h4 class="addwd-txt">{{item.account}}</h4>
                            <span class="optr wd-del-btn" @click="setUnbind('alipay')">解绑</span>
                        </div>
                    </li>
                    <li v-if="item.type == 'bank' && !!item.account">
                          <label class="mod-label">
                            <span v-if="item.account_plus=='中国工商银行'" class="wd-icons-gsbank"></span>
                            <span v-if="item.account_plus=='招商银行'" class="wd-icons-zsbank"></span>
                            <span v-if="item.account_plus=='中国建设银行'" class="wd-icons-jsbank"></span>
                            <span v-if="item.account_plus=='中国银行'" class="wd-icons-zgbank"></span>
                            <span v-if="item.account_plus=='中国农业银行'" class="wd-icons-nybank"></span>
                            <span v-if="item.account_plus=='交通银行'" class="wd-icons-jtbank"></span>
                            <span v-if="item.account_plus=='浦发银行'" class="wd-icons-pfbank"></span>
                            <span v-if="item.account_plus=='广发银行'" class="wd-icons-gfbank"></span>
                            <span v-if="item.account_plus=='中信银行'" class="wd-icons-zxbank"></span>
                            <span v-if="item.account_plus=='中国光大银行'" class="wd-icons-gdbank"></span>
                            <span v-if="item.account_plus=='兴业银行'" class="wd-icons-zybank"></span>
                            <span v-if="item.account_plus=='平安银行'" class="wd-icons-pabank"></span>
                            <span v-if="item.account_plus=='中国民生银行'" class="wd-icons-msbank"></span>
                            <span v-if="item.account_plus=='中国邮政储蓄银行'" class="wd-icons-yzbank"></span>
                            <span v-if="item.account_plus=='华夏银行'" class="wd-icons-hxbank"></span>
                          </label>
                          <div class="mod-cont">
                            <h3 class="addwd-tit">{{item.account_plus}}</h3>
                            <h4 class="addwd-txt">{{item.account}}</h4>
                            <span class="optr wd-del-btn" @click="setUnbind('bank')">解绑</span>
                          </div>
                        </li>
                </template>
            </ul>
            <!-- 页面正常显示（编辑完成） -->
            <template v-if="!showEdit">
                <!-- 已绑定过提现方式 -->
                <template v-if="data.can_edit == 1">
                    <!-- 提现方式 -->
                     <ul class="mod-label-listwrap mod-com-list addwd-list" :class="{'fold': needMoreItem}">
                        <template v-for="(item, index) in PMArr">
                            <li :class="{checked: item.checked}"  @click="clickFun(index,item)">
                                <label class="mod-label">
                                    <template v-if="item.type == 'bank' && !!item.account && item.account != ''">
                                        <span v-if="item.account_plus=='中国工商银行'" class="wd-icons-gsbank"></span>
                                        <span v-if="item.account_plus=='招商银行'" class="wd-icons-zsbank"></span>
                                        <span v-if="item.account_plus=='中国建设银行'" class="wd-icons-jsbank"></span>
                                        <span v-if="item.account_plus=='中国银行'" class="wd-icons-zgbank"></span>
                                        <span v-if="item.account_plus=='中国农业银行'" class="wd-icons-nybank"></span>
                                        <span v-if="item.account_plus=='交通银行'" class="wd-icons-jtbank"></span>
                                        <span v-if="item.account_plus=='浦发银行'" class="wd-icons-pfbank"></span>
                                        <span v-if="item.account_plus=='广发银行'" class="wd-icons-gfbank"></span>
                                        <span v-if="item.account_plus=='中信银行'" class="wd-icons-zxbank"></span>
                                        <span v-if="item.account_plus=='中国光大银行'" class="wd-icons-gdbank"></span>
                                        <span v-if="item.account_plus=='兴业银行'" class="wd-icons-zybank"></span>
                                        <span v-if="item.account_plus=='平安银行'" class="wd-icons-pabank"></span>
                                        <span v-if="item.account_plus=='中国民生银行'" class="wd-icons-msbank"></span>
                                        <span v-if="item.account_plus=='中国邮政储蓄银行'" class="wd-icons-yzbank"></span>
                                        <span v-if="item.account_plus=='华夏银行'" class="wd-icons-hxbank"></span>
                                    </template>
                                    <span v-else :class="'wd-icons-' + classObj[item.type].span_class"></span>
                                </label>
                                <div class="mod-cont">
                                    <h3 class="addwd-tit">{{classObj[item.type].caption}}<i v-if="item.type == 'weixin'" class="wd-tag-forthwith">即时</i></h3>
                                    <h4 class="addwd-txt">{{ (!!item.account && item.account != '') ? item.account : '未绑定'}}</h4>
                                    <span v-if="!!item.account && item.account != ''" class="optr checkbox-wd checkType"></span>
                                    <i v-else class="mod-arr"></i>
                                </div>
                                </li>
                        </template>
                    </ul>
                    <button class="fold-btn js-touch-state" @click="setShowMoreType" type="button">查看更多提现方式</button>
                    <!-- 输入部分（金额、验证码） -->
                    <ul class="mod-label-listwrap mod-com-list  wd-list addwd-list">
                        <li>
                            <label class="mod-label" for="apply-cash">提现金额</label>
                            <div class="mod-cont">
                                <input type="text" id="apply-cash" class="input hint-input J_input js-focus-dom" :placeholder="'当前可提现金额' + data.balance + '元'" v-model="inputAmount" @input="setGetCode"></div>
                        </li>
                        <li class="verification-box">
                            <label class="mod-label" for="verificationCode">验证码</label>
                            <div class="mod-cont">
                                <input type="tel" id="verificationCode" class="input J_code js-focus-dom" placeholder="请输入" v-model="inputCode">
                            </div>
                            <div class="verification">
                                <input type="button" class="s-btn js-touch-state" :disabled="!canGetCode" :value="getCodeText"  @click="getCode">
                            </div>
                        </li>
                    </ul>
                    <!-- 提现方式提示信息 -->
                    <div v-show="checkedType == 'alipay'" class="wd-info">
                        <p v-for="item in data.notice.alipay">{{item}}</p>
                    </div>
                    <div v-show="checkedType == 'weixin'" class="wd-info">
                        <p v-for="item in data.notice.weixin">{{item}}</p>
                    </div>
                    <div v-show="checkedType == 'bank'" class="wd-info">
                        <p v-for="item in data.notice.bank">{{item}}</p>
                    </div>
                    <!-- 提交按钮 -->
                    <div class="btnbox">
                        <button type="button" class="btn surebtn J_applyBtn js-touch-state" :disabled="!canSubmitBtn" @click="submit">确认提交</button>
                    </div>
                </template>
                <!-- 未绑定任何提现方式 -->
                <template v-if="data.can_edit == 0">
                    <ul  class="mod-label-listwrap mod-com-list addwd-list J_content" :class="{'fold': needMoreItem}">
                        <li class="mod-li-arr J_bindType" @click="bindType('alipay')">
                          <label class="mod-label"><span class="wd-icons-alipay"></span></label>
                          <div class="mod-cont">
                            <h3 class="addwd-tit">支付宝</h3>
                            <h4 class="addwd-txt">未绑定</h4>
                            <i class="mod-arr"></i>
                          </div>
                        </li>
                        <li class="mod-li-arr J_bindType" @click="bindType('weixin')">
                          <label class="mod-label"><span class="wd-icons-wx"></span></label>
                          <div class="mod-cont">
                          <h3 class="addwd-tit">微信钱包</h3>
                            <h4 class="addwd-txt">未绑定</h4>
                            <i class="mod-arr"></i>
                          </div>
                        </li>
                        <li class="mod-li-arr J_bindType" @click="bindType('bank')">
                          <label class="mod-label"><span class="wd-icons-bank"></span></label>
                          <div class="mod-cont">
                            <h3 class="addwd-tit">银行卡</h3>
                            <h4 class="addwd-txt">未绑定</h4>
                           <i class="mod-arr"></i>
                          </div>
                        </li>
                    </ul>
                    <button class="fold-btn js-touch-state" @click="setShowMoreType" type="button">查看更多提现方式</button>
                </template>
            </template>
                
        </article>
    </div>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCsafetyApi from 'clientApi/KCsafetyApi'

    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    let focusDom = null;// 当前获取焦点的表单元素
    let timer = null;//计时器   
    /**
     *  组件实例对象
     */
    export default {
        components: {

        },
        data () {
            return {
                data: {},
                showLoading: false,
                showEdit: false,
                needMoreItem: true,
                canSubmitBtn: true,
                canGetCode: false,
                checkedType: '',
                checkedAccount: '',
                inputAmount: '',
                inputCode: '',
                getCodeText: '获取验证码',
                classObj: {
                    alipay: {span_class:'alipay', caption: '支付宝',level: 1},
                    weixin: {span_class:'wx', caption: '微信钱包',level: 2},
                    bank: {span_class:'bank', caption: '银行卡',level: 3}
                },
                PMArr:[],
                expHeight: document.documentElement.clientHeight + 'px',
                residueClock: 0
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
                var self = this;

                //页面首次加载
                self.showLoading = true;
                self.loadData(0);

                // 点击编辑／完成时调用  点击完成 edit为0 点击编辑 edit为1
                window.loadData = function(edit) {
                    self.loadData(edit);
                }
                //设置图片验证码点击刷新掉用的方法
                window.showCaptchaDialog = function() {
                    self.getPic(0);
                }

                //对iOS做特殊处理，设置输入焦点的输入框dom元素的距离页面顶部的距离
                if(Util.OS() == 'ios'){
                    window.scrollTo = function () {
                        let pos = Util.getAbsPoint(focusDom);
                        KCucPage.domPosition(pos.y, $(focusDom).height())
                    }
                }

                //获取输入框获取焦点的对像
                $('body').on('focus', '.js-focus-dom', function() {
                    focusDom = $(this)[0];
                })

                //解决android低端机键盘缩起webview上方留白问题
                $('body').on('click',function() {
                    if(Util.OS() == 'android') {
                        window.scroll(0,0);
                    }
                });
            },
            
            /**
             * 获取页面渲染数据
             * @param  {[String]} edit [0: 点击完成, 1: 点击编辑] 首次进入页面为0
             * @return {[type]}      [description]
             */
            loadData(edit) {
                var self = this;
                KCsafetyApi.dekEncrypt(Util.OS(), function(enCodePlatform) {
                    Util.ajax({
                        url: '/ucenter/applycash',
                        dataType:'string',
                        data:{
                            platform: enCodePlatform,
                            token: ''
                        },
                        timeout: 10000,
                        ctrlStatus: {
                            loading: 1,
                            cache: false,
                            errNum: 0,
                            netNum: 0,
                        },
                        success: function(data) {
                            KCsafetyApi.dekDecrypt(data, function (enCodeData) {
                                self.loadDataSuccess(edit, JSON.parse(enCodeData));
                            });
                        },
                        error: function(xhr, status){
                            self.showLoading = false;
                        },
                        noNetwork: function(){
                            self.showLoading = false;
                        }
                    });
                })
            },
            loadDataSuccess(edit, data) {
                var self = this;
                self.showLoading = false;
                KCucPage.dataDownloadFinished();
                if(!!data && !!data.payment_account) {
                    //客户端调用是否可编辑
                    window.edit = function(){
                        return {can_edit: data.can_edit}
                    };
                    self.showEdit = edit == 1 ? true : false;
                    if(data.can_edit ==1 && !self.showEdit) {
                        self.classObj['alipay'].level = 1;
                        self.classObj['weixin'].level = 2;
                        self.classObj['bank'].level = 3;
                        KCcache.getMemoryCache('bindType', function(typeData) {
                            let from = 'init'
                            if(!!typeData && !!typeData.type) {
                                from = 'bind'
                                self.classObj[typeData.type].level = -1;
                                if(typeData.type != 'alipay') {
                                    self.needMoreItem = false;
                                }else{
                                    self.needMoreItem = true;
                                }
                                KCcache.deleteMemoryCache('bindType');
                            }
                            //默认选中支付宝
                            self.PMArr = data.payment_account;
                            self.sortByAccount(from);
                            self.data = data;
                        });
                    }else {
                        self.data = data;
                    }
                }else {
                    KCucPage.loadPageStatus('loadFailed');
                }
            },
            
            /**
             * 监听提现金额输入框设置获取验证码按钮的可点击状态
             */
            setGetCode() {
                if(this.checkedType == ''){
                    KCwidget.toast('请先选择提现方式');
                }else{
                    if(this.inputAmount.length > 0 && this.residueClock == 0){
                        this.setCodeBtn(true);
                    }else{
                        this.setCodeBtn(false);
                    }
                }
            },
            /**
             * 校验（确认提交按钮）
             * @return {[type]} [description]
             */
            checkSubmitData() {
                let result = false;
                let amountExp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
                if(this.checkedType == ''){
                   KCwidget.toast('请先选择提现方式'); 
                }else if(this.inputAmount == '') {
                    KCwidget.toast('请输入提现金额');
                }else if(!amountExp.test(this.inputAmount)) {
                    KCwidget.toast('请输入正确的金额');
                }else if(this.inputCode == '' || this.inputCode.length != 6){
                    KCwidget.toast('请输入正确验证码');
                }else{
                    result = true;
                }
                return result;
            },
            /**
             * 确认提交按钮
             * @return {[type]} [description]
             */
            submit() {
                var self = this;
                if(self.canSubmitBtn && self.checkSubmitData()) {
                    self.canSubmitBtn = false;
                    // let param = self.dekEncrypt(self.checkedType, self.inputAmount, self.inputCode);
                    let param = [];
                    KCsafetyApi.dekEncrypt(self.checkedType, function(data1) {
                        param.push(data1);
                        KCsafetyApi.dekEncrypt(self.inputAmount, function(data2) {
                            param.push(data2);
                            KCsafetyApi.dekEncrypt(self.inputCode, function(data3) {
                                param.push(data3);
                                Util.ajax({
                                    url: '/ucenter/applycash',
                                    type: 'POST',
                                    data:{
                                        type: param[0],
                                        amount: param[1],
                                        code: param[2]
                                    },
                                    timeout: 10000,
                                    ctrlStatus: {
                                        loading: 0,
                                        cache: false,
                                        errNum: 0,
                                        netNum: 0,
                                        isToastErr: false
                                    },
                                    success: function(data) {
                                        self.canSubmitBtn = true;
                                        KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=deposit_success');
                                        let accountStr = '';
                                        if(self.checkedType == 'bank') {
                                            accountStr = '元至银行账户' + self.checkedAccount + ', 预计到账时间为工作日48小时';
                                        }else if(self.checkedType == 'weixin') {
                                            accountStr = '元至微信钱包' + self.checkedAccount;
                                        }else if(self.checkedType == 'alipay') {
                                            accountStr = '元至支付宝账户' + self.checkedAccount;
                                        }
                                        accountStr = '您已提现' + self.inputAmount + accountStr + ', 请注意查收。如有疑问请拨打电话 010-57977077';
                                        if(!!data && data.code == 0) {
                                            KCclientUI.alertDialog('提现成功', accountStr, function(data) {
                                                KCucPage.goBack(1);
                                            }, '确定', 'Success');
                                        }else {
                                            KCwidget.toast('服务器异常');
                                        }
                                    },
                                    error: function(xhr, status){
                                        self.canSubmitBtn = true;
                                        let err = JSON.parse(xhr.responseText);
                                        let errorStr = '失败原因：' + err.message + '，如有疑问请拨打电话 010-57977077';
                                        KCclientUI.alertDialog('提现失败', errorStr, function(data) {
                                            clearTimeout(timer);
                                            self.setCodeBtn(true);
                                        }, '确定', 'Fail');
                                    },
                                    noNetwork: function(){
                                        self.canSubmitBtn = true;
                                    }
                                });
                             });
                        });
                    });
                }
            },
            /**
             * 点击获取验证码
             * 成功返回数据则表示发送成功，进行倒计时
             * 进入error 且code为-3 进行图片验证码校验
             * @return {[type]} [description]
             */
            getCode() {
                if(this.canGetCode) {
                    var self = this;
                    self.setCodeBtn(false);
                    Util.ajax({
                        url: '/validatecode',
                        type:'POST',
                        timeout: 10000,
                        ctrlStatus: {
                            loading: 0,
                            cache: false,
                            errNum: 0,
                            netNum: 0,
                        },
                        success: function(data) {
                           self.clock(60);
                        },
                        error: function(xhr, status) {
                            self.setCodeBtn(true);
                            if(status == 'timeout') {
                                KCwidget.toast('网络请求超时');
                            }else{
                                if(xhr.status == 400) {
                                    let err = JSON.parse(xhr.responseText);
                                    if(err.code === -3) {
                                       self.getPic(1);
                                    }else if(err.code==-100 || err.code==-200){
                                        KCwidget.toast('登录失效，请重新登录');
                                        KCucApi.logOut();
                                    }else{
                                        // KCwidget.toast(err.message);
                                        self.setCodeBtn(true);
                                    }
                                }else{
                                    // KCwidget.toast('服务器异常');
                                    self.setCodeBtn(true);
                                }
                            }
                        },
                        noNetwork: function(){
                            self.setCodeBtn(true);
                            // KCwidget.toast('网络异常');
                        }
                    });
                }
            },
             /**
             * 获取图片验证码
             * @return {[type]} [description]
             */
            getPic(codeData) {
                var self = this;
                Util.ajax({
                    url: '/ajax/encodedcode',
                    data: {
                        platform: Util.OS(),
                        token: ''
                    },
                    timeout: 10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success: function(data) {
                         if(!!data && !!data.pic_code){
                            let picDataCode = data.pic_code;
                            if(codeData == 1) {
                                self.showCaptcha(picDataCode,1);
                            }else {
                                self.showCaptcha(picDataCode,2);
                            }
                        }else{
                            KCwidget.toast('服务器异常');
                            self.setCodeBtn(true);
                        }
                    },
                    error: function(xhr, status){
                        self.setCodeBtn(true);   
                        // Util.ajaxErrorFn(KCwidget,xhr,status,true,KCucApi);
                    },
                    noNetwork: function(){
                        self.setCodeBtn(true);
                        // KCwidget.toast('网络异常');
                    }
                });
            },
            /**
             * 当需要验证图片验证码的情况，显示验证图片验证码弹出框
             * 点击确认 则验证图片验证码，取消，获取验证码可点击
             * @param  {[base64]} picDataCode img 图片
             * @param  {[string]} num   次数 依据次数来判断首次加载，还是第二次及更多次加载 1 显示整个框 2 只替换图片
             * @return {[type]}             [description]
             */
            showCaptcha(picDataCode, num) {
                var self = this;
                KCclientUI.showCaptchaDialog('请输入验证码',picDataCode,num,"default", function(data){
                    if(data.status==1){
                        self.getPicCode(data.code);
                    }else{
                       self.setCodeBtn(true); 
                    }   
                });  
            },
            /**
             * 验证图片验证码
             * @return {[type]} [description]
             */
            getPicCode(code) {
                var self = this;
                let codeParam = [];
                KCsafetyApi.dekEncrypt(Util.OS(), function(data1) {
                    codeParam.push(data1);
                    KCsafetyApi.dekEncrypt(code, function(data2) {
                        codeParam.push(data2);
                        Util.ajax({
                            url: '/validatecode',
                            type: 'POST',
                            data: {
                                code: codeParam[1],
                                platform: codeParam[0],
                                token:''
                            },
                            timeout:10000,
                            ctrlStatus: {
                                loading: 0,
                                cache: false,
                                errNum: 0,
                                netNum: 0,
                            },
                            success:function(data) {
                                if(!!data && data.code == 0) {
                                    self.clock(60);
                                }else {
                                   KCwidget.toast('服务器异常'); 
                                }
                            },
                            error:function(xhr, status){
                                self.setCodeBtn(true); 
                                // Util.ajaxErrorFn(KCwidget,xhr,status,true,KCucApi);
                            },
                            noNetwork: function(){
                                // KCwidget.toast('网络异常');
                                self.setCodeBtn(true); 
                            }
                        });
                    });
                });
            },
            /**
             * 提现方式解绑
             */
            setUnbind(type) {
                var self = this;
                let temp_type = 'zfb';
                if(type == 'weixin') {
                    temp_type = 'wx';
                }else if(type == 'bank') {
                    temp_type = 'yhk';
                }
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=jb_'+temp_type);

                Util.ajax({
                    url: '/ucenter/account',
                    type: 'POST',
                    data: {
                        type: type,
                        act: 'undo',
                        token: '',
                        platform: Util.OS()
                    },
                    timeout:10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data) {
                        if(!!data && data.code == 0) {
                            KCwidget.toast('解绑成功');
                            self.data.payment_account = self.deleteArrByEle(type);
                        }else {
                            KCwidget.toast('服务器异常'); 
                        }
                    },
                    error:function(xhr, status){
                        // Util.ajaxErrorFn(KCwidget,xhr,status,true,KCucApi);
                    },
                    noNetwork: function(){
                        // KCwidget.toast('网络异常');
                    }
                });

            },
            /**
             * 绑定提现方式
             * @param  {[type]} type [description]
             * @return {[type]}      [description]
             */
            bindType(type) {
                let url = '';
                switch(type) {
                    case 'weixin':
                      url = 'doumi://bindweixinwallet';
                      break;
                    case 'bank':
                      url = 'doumi://bindunionpay';
                      break;
                    case 'alipay':
                      url = 'doumi://bindalipay';
                      break;
                }
                if(!!url) {
                    window.location.href = url;
                }
                
            },
            setShowMoreType() {
                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=more');
                this.needMoreItem = false;
            },
             /**
              * 工具方法(加密)
              * @return {[type]} [description]
              */
            dekEncrypt(...arg) {
                arg.map((item) => {
                    KCsafetyApi.dekEncrypt(item, function(encodeData) {
                        return encodeData;
                    })
                });
                return arg;
            },
            /**
             * 工具方法（排序）
             * @param  {[String]} from [init: 初始化（支付宝优先级最高）， bind: 绑定后返回]
             * @return {[type]}      [description]
             */
            sortByAccount(from) {
                let self = this;
                let hasAccountArr = self.PMArr.filter((item) => {
                    return !!item.account && item.account != '';
                });

                if (hasAccountArr.length == 0 || hasAccountArr.length == 3) {
                    self.PMArr = self.PMArr.sort((item1, item2) => {
                        return self.classObj[item1.type].level - self.classObj[item2.type].level;
                    });
                } else if (hasAccountArr.length == 1) {

                    let hasNoAccountArr = self.PMArr.filter((item) => {
                        return !item.account || item.account == '';
                    });
                    let ordered = hasNoAccountArr.sort((item1, item2) => {
                        return self.classObj[item1.type].level - self.classObj[item2.type].level;
                    });
                    self.PMArr = hasAccountArr.concat(ordered);
                }else if (hasAccountArr.length == 2) {
                    let lastItem = self.PMArr.filter((item) => {
                        return !item.account || item.account == '';
                    });

                    let ordered = hasAccountArr.sort((item1, item2) => {
                        return self.classObj[item1.type].level - self.classObj[item2.type].level;
                    });
                    self.PMArr = ordered.concat(lastItem);
                }

                //如果首项已绑定,且是支付宝或者是刚刚绑完，则勾选
                if (self.PMArr[0].account != '') {
                    self.PMArr[0].checked = true;
                    self.PMArr[1].checked = false;
                    self.PMArr[2].checked = false;
                    self.checkedType = self.PMArr[0].type;
                    self.checkedAccount = self.PMArr[0].account;
                }
            },
            /**
             * 选择体现方式
             * @param  {[number]} index [下标]
             * @param  {[Object]} item  [选中的对象]
             * @return {[type]}       [description]
             */
            clickFun (index, item) {
                let self = this;
                if(!!item.account) {
                    //选中／不选 当前提现方式
                    if (!self.PMArr[index].checked) {
                        self.checkedType = self.PMArr[index].type;
                        self.checkedAccount = self.PMArr[index].account;
                        let currentCheckedIndex = -1;
                        let temp = self.PMArr.filter((item, i, arr) => {
                            if (item.checked) {
                                currentCheckedIndex = i;
                                return true;
                            }
                        });
                        if (currentCheckedIndex > -1) {
                            self.PMArr[currentCheckedIndex].checked = false;
                        }
                        if(self.inputAmount != '') {
                            self.setCodeBtn(true);
                        }
                    }else {
                        self.checkedType = '';
                        self.checkedAccount = '';
                    }
                    self.PMArr[index].checked = !self.PMArr[index].checked;
                }else {
                    // 绑定当前提现方式
                    self.bindType(item.type);
                }
            },

            /**
             * 获取验证码计时器
             * @param  {[type]} num [description]
             * @return {[type]}     [description]
             */
            clock(num) {
                var self = this;
                self.residueClock = num;
                self.setCodeBtn(false);
                // console.log(self.getCodeText);
                clearTimeout(timer);
                if(num <= 0) {
                    self.setCodeBtn(true);
                    return;
                }
                let n = num<10 ? '0'+num : ''+num;
                self.getCodeText = n + '秒后重发';
                num--;
                timer = setTimeout(function() {
                    self.clock(num);
               },1000)
            },

            setCodeBtn (param) {
                this.canGetCode = param;
                this.getCodeText = param ? '获取验证码' : this.getCodeText;
            },

            deleteArrByEle(type) {
                let acList = [];
                for(let i=0; i<this.data.payment_account.length; i++){
                    if(this.data.payment_account[i].type != type) {
                        acList.push(this.data.payment_account[i])
                    }
                }
                return acList
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