<template>
    <!-- <b>奋力加载中...</b> -->
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCwidget from 'clientApi/KCwidget'
    import KCucApi from 'clientApi/KCucApi'

    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */

    /**
     *  组件实例对象
     */
    export default {
        components: {},
        data () {
            return {
                // headers 数据
                headersJson: {},
                // 用户id
                userId: 'not_login',
                // 用户积分
                credit: 0,

                dbredirect: ''
            }
        },
        methods: {
            /**
             * 获取对吧URL并跳转
             * @method getDuibaUrl
             * @public
             * @return {Null}
             * @example
             *      this.getDuibaUrl();
             * @since 1.0.0
             */
            getDuibaUrl() {
                var self = this;
                KCucApi.getUserInfo(function(data) {
                    if(data.userId !== '0'){
                        // 登陆
                        self.userId = data.userId;
                        // 获取用户积分
                        Util.ajax({
                            url: '/ucenter/index',
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
                            success: function(data){
                                // $('.page-loading').removeClass('active');
                                if(!!data && !!data.user_id){
                                    self.credit = data.score;

                                    self.getDuibaUrlAjAxFn();

                                }else{
                                    KCwidget.toast('服务器异常');
                                }
                            },
                            error:function(xhr, status){
                            },
                            noNetwork: function(){
                            }
                        });
                    }else{
                        // 未登录
                        self.userId = 'not_login';
                        self.credit = 0;
                        self.getDuibaUrlAjAxFn();
                    }
                });
            },
            /**
             * ajax请求对吧url
             * @method getDuibaUrlAjAxFn
             * @public
             * @return {Null}
             * @example
             *      this.getDuibaUrlAjAxFn();
             * @since 1.0.0
             */
            getDuibaUrlAjAxFn() {
                var self = this;
                Util.ajax({
                    url: '/duiba/url',
                    data:{
                        userId:self.userId,
                        credit:self.credit,
                        // credit:10,
                        platform:Util.OS(),
                        token:'',
                        dbredirect:self.dbredirect
                    },
                    timeout: 10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        // alert(JSON.stringify(data))
                        if(!!data && data.code == 0){
//                            console.log(data.url)
//                            KCwidget.toast('跳转');
                            window.location.href='doumi://duiba/' + encodeURIComponent(data.url) + '?statusCode=302';
                        }else if(!!data && (data.code == -100 || data.code == -200)){
                            KCwidget.toast('登录失效，请重新登录');
                            //未登录
                            KCucApi.logOut();
                        }else{
                            KCwidget.toast('服务器异常');
                        }

                    },
                    error:function(xhr, status){
                    }
                });
            }
        },
        created () {
            let self = this;
            self.dbredirect = Util.getQueryString('dbredirect');
            //开始请求
            self.getDuibaUrl();
        }
    }


</script>

<style>
    b{
        width: 100%;
        text-align: center;
        height: 50px;
        line-height: 50px;
        position: fixed;
        top: 50%;
        margin-top: -25px;
    }
</style>
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>