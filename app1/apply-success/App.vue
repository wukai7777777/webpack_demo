<template>
    <!-- page start -->
    <div class="mod-page">
        <section class="mod-content deliver">
            <div class="mod-push"  v-if="showToPerfect">
                <a href="doumi://perfect-resume?from=applySuccess" class="mod-push-info" @click="setLog"><b class="mod-push-btn">去完善</b>完善更多信息，为你推荐优选职位</a>
                <i class="mod-push-close" @click="closeToPerfect">关闭</i>
            </div>
            <!-- form start -->
            <div class="form-widget">
                <div class="form-deliver" v-if="contact.consulting_display == 0">
                    <div class="deliver-title">请打电话主动联系商家
                        <br>完成录取并上岗</div>
                    <div class="deliver-opt">
                        <a href="javascript:;" class="btn btn-phone btn-large" @click.prevent="goToConsulting(0, contact.contact_phone, contact.consulting_remark)">拨打电话</a>
                    </div>
                    <div class="deliver-ds">
                        <span v-if="contact.contact_person">联系人：{{contact.contact_person}}</span>
                        <span v-if="!!!contact.contact_person">{{contact.consulting_content}}</span>
                    </div>
                </div>
                <div class="form-deliver" v-if="contact.consulting_display == 2">
                    <div class="deliver-title">请加QQ主动联系商家
                        <br>完成录取并上岗</div>
                    <div class="deliver-opt">
                        <a href="javascript:;" class="btn btn-qq btn-large" @click.prevent="goToConsulting(2, contact.consulting_info, contact.consulting_remark)">{{contact.consulting_info}}</a>
                    </div>
                    <div class="deliver-ds">点击QQ号复制，加好友请备注姓名/性别/年龄</div>
                </div>
                <div class="form-deliver" v-if="contact.consulting_display == 1">
                    <div class="deliver-title">请加微信主动联系商家
                        <br>完成录取并上岗</div>
                    <div class="deliver-opt">
                        <a href="javascript:;" class="btn btn-wechat btn-large" @click.prevent="goToConsulting(1, contact.consulting_info, contact.consulting_remark)">{{contact.consulting_info}}</a>
                    </div>
                    <div class="deliver-ds">点击微信号复制，加好友请备注姓名/性别/年龄</div>
                </div>
                <div class="form-deliver" v-if="contact.consulting_display == 4">
                    <div class="deliver-title">请加微信主动联系商家
                        <br>完成录取并上岗</div>
                    <div class="deliver-opt">
                        <a href="javascript:;" class="btn btn-wechat btn-large" @click.prevent="goToConsulting(4, contact.consulting_info, contact.consulting_remark)">{{contact.consulting_info}}</a>
                    </div>
                    <div class="deliver-ds">点击微信号复制，加好友请备注姓名/性别/年龄</div>
                </div>
                <div class="form-text form-text-center">
                    <p class="fc-grey">温馨提示：正规兼职不会收取费用，若收费请提高警惕</p>
                    <p class="fc-grey"><a href="https://mp.weixin.qq.com/s?__biz=MzIwNzA5NjUxOQ==&mid=2650996961&idx=1&sn=cfcf4a890784274bb820317027601d8e&scene=1&srcid=0809HGZJq2BJ6FlZUx8qj7Os&key=8dcebf9e179c9f3a56e9c3f4ede428c30b12573c6c9b779bc4124b819f85275cab1ce55d06e220890b672f138e6dd2d7&ascene=0&uin=MjA3NDgwMTc2Mg%3D%3D&devicetype=iMac+MacBookPro10%2C1+OSX+OSX+10.11.6+build" class="fc-blue">查看防骗指南</a></p>
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
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCdetailPage from 'clientApi/KCdetailPage'
    import KCucApi from 'clientApi/KCucApi'
    import KCcache from 'clientApi/KCcache'
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    let userId = '';
    /**
     *  组件实例对象
     */
    export default {
        components: {

        },
        data: function() {
            return {
                contact: {},
                showToPerfect: false
            }
        },
        computed: {

        },
        methods: {
            goToConsulting(status = '', info = '', detail = '') {
                if (status === '') return false;
                switch(status + '') {
                    case '0':
                        KCclientUI.showPhoneDialog(info + '', '', '呼叫', '取消', 'Phone', function(data){
                            if(data.status==1){}
                        });
                    break;
                    case '1':
                        KCclientUI.copyDialog('商家微信号', info + '', detail, '复制微信号', '取消', function(data){
                            if(data.status==1){
                                KCwidget.toast('已复制到剪切板');
                            }
                        });
                    break;
                    case '2':
                        KCclientUI.copyDialog('商家QQ号', info + '', detail, '复制QQ号', '取消', function(data){
                            if(data.status==1){
                                KCwidget.toast('已复制到剪切板');
                            }
                        });
                    break;
                    case '4':
                        KCclientUI.copyDialog('商家微信公众号', info + '', detail, '复制微信公众号', '取消', function(data){
                            if(data.status==1){
                                KCwidget.toast('已复制到剪切板');
                            }
                        });
                    break;
                }
            },
            /**
             * 设置埋点
             */
            setLog() {
                KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@ca_from=prefer');
            },
            /**
             * 关闭去完善简历入口
             * @return {[type]} [description]
             */
            closeToPerfect() {
                // 缓存关闭动作 ，三天内不再显示广告（去完善简历入口）
                KCcache.setCache('applySuccess_' + userId ,{'close': 1}, 3 * 24 * 60 * 60);
                this.showToPerfect = false;
            }

        },
        beforeCreate() {

        },
        created() {
            let self = this;
            let job_id = Util.getQueryString('job_id'),
                job_type = Util.getQueryString('job_type'),
                apply_id = Util.getQueryString('apply_id');
            KCdetailPage.getCompanyData(job_id, function(data) {
                if (data instanceof Object) {
                    self.contact = data;
                    KCucApi.getUserInfo(function(userInfoData){
                        userId = userInfoData.userId;
                         // resume_audit 字段为0 时，显示去完善简历的入口
                        if(data.resume_audit == 0) {
                            //判断是否过了三天，点击关闭按钮后三天内不再显示广告（去完善简历入口）
                            KCcache.getCache('applySuccess_' + userId, function(cacheData) {
                                if(!cacheData) {
                                    self.showToPerfect = true;
                                }
                            })
                        }
                    });
                }
            });
            KCloggerApi.addLog('1', `/jianzhi/${job_type}/detail/apply_success&post_id=${job_id}&apply_id=${apply_id}`);
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/form.css"></style>
<style src="static/css/detail_deliver.css"></style>



