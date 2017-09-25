<template>
    <section class="mod-content signing-express">
        <div class="form-widget normal">
            <div class="form-tips">填写资料验证手机，可更快上岗并确保工资到账</div>
            <comNecessary></comNecessary>
            <comLimitedcondition></comLimitedcondition>
            <comLogin v-model="loginInfo"></comLogin> 
            <div class="form-opt"  @click="checkInfo">
                <button type="button" class="btn btn-primary btn-large js-touch-state">完成并报名</button>
            </div>
            <comNoidencode></comNoidencode>
        </div> 
    </section>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCdetailPage from 'clientApi/KCdetailPage'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCPageCompleteResume from 'clientApi/KCPageCompleteResume'
    import {mapGetters} from 'vuex'
    
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import comLogin from 'components/com-login/com-login'
    import * as comLogin_mt from 'components/com-login/com-login-mutation-types'
    import comNecessary from 'components/com-necessary/com-necessary'
    import * as comNecessary_mt from 'components/com-necessary/com-necessary-mutation-types'
    import comLimitedcondition from 'components/com-limitedcondition/com-limitedcondition'
    import * as comLimitedcondition_mt from 'components/com-limitedcondition/com-limitedcondition-mutation-types'
    import comNoidencode from 'components/com-noidencode/com-noidencode'
    import * as comNoidencode_mt from 'components/com-noidencode/com-noidencode-mutation-types'
    /**
     *  组件实例对象
     */
    export default {
        components: {
            comLogin,
            comNecessary,
            comLimitedcondition,
            comNoidencode
        },
        data () {
            return {
                rapidlyapplyObj:{},
                tjStr: '',
                loginInfo: {}
            }
        },
        computed: {
            ...mapGetters([
                'get_comlogin_showLogin', 
                'get_comlogin_loginCheckStatus',
                'get_comnecessary_info',
                'get_comnecessary_necessaryStatus',
                'get_comnecessary_necessaryCheckStatus',
                'get_comlimitedcondition_limitedconditionData',
                'get_comlimitedcondition_limitedconditionDataStatus'
            ])
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
                self.setInfo();
                self.mountingWindow();
            },
            setInfo(){
                let self = this;
                //获取简历基本信息,获取客户端引导页用户填写信息
                KCPageCompleteResume.getResumeInfo(function(resumeInfo) {
                    let baseInfo = {
                        real_name: '',
                        gender: 0,
                        birth_date: '',
                        at_school: ''
                    };
                    if(!!resumeInfo) {
                        if(!!resumeInfo.gender) {
                            baseInfo.gender = resumeInfo.gender;
                        }
                        if(!!resumeInfo.identity) {
                            baseInfo.at_school = resumeInfo.identity == 3 ? 0 : resumeInfo.identity;
                        }
                        if(!!resumeInfo.birth && resumeInfo.birth != 0) {
                            baseInfo.birth_date = resumeInfo.birth;
                        }
                        if(!!resumeInfo.name) {
                            baseInfo.real_name = resumeInfo.name;
                        }
                        
                        self.$store.commit(comNecessary_mt.SET_NECESSARY_INFO, baseInfo);
                    }
                });

                // self.setLimitedconditionData();
                self.$store.commit(comLimitedcondition_mt.SET_LIMITEDCONDITION_DATA);
                KCdetailPage.getLayoutParam(function(data){
                    // console.log(data);
                    self.rapidlyapplyObj.jobId=data.job_id;
                    self.rapidlyapplyObj.is_login=data.is_login;
                    self.rapidlyapplyObj.is_resume_complete=data.is_resume_complete;
                    // data.is_resume_complete=1;
                    // console.log(data);
                    if(data.is_login==0){
                        // self.setLoginStatus(true);
                        self.$store.commit(comLogin_mt.SET_LOGIN_STATUS, true);
                        // self.setIsShowEntry(true);
                        self.$store.commit(comNoidencode_mt.SET_IS_SHOW_ENTRY, true);
                        KCloggerApi.addLog('1','/jianzhi/'+data.job_type+'/detail/applyconfirm/fastreg' + self.tjStr);
                        KCloggerApi.addLog('0','报名限制页_展现&登录状态&{"登录状态":"未登录"}');
                    }else{
                        // self.setLoginStatus(false);
                        self.$store.commit(comLogin_mt.SET_LOGIN_STATUS, false);
                        // self.setIsShowEntry(false);
                        self.$store.commit(comNoidencode_mt.SET_IS_SHOW_ENTRY, false);
                        KCloggerApi.addLog('0','报名限制页_展现&登录状态&{"登录状态":"登录"}');
                        if(data.is_resume_complete==0){
                            KCloggerApi.addLog('1','/jianzhi/'+data.job_type+'/detail/applyconfirm/noresume' + self.tjStr);
                        }else{
                            KCloggerApi.addLog('1','/jianzhi/'+data.job_type+'/detail/applyconfirm/hasresume' + self.tjStr);
                        }
                    }

                    if(data.is_resume_complete==0){
                        // self.necessaryInfo.necessaryStatus=true;
                        self.$store.commit(comNecessary_mt.SET_STATUS, true);
                    }else{
                        // self.necessaryInfo.necessaryStatus=false;
                        self.$store.commit(comNecessary_mt.SET_STATUS, false);
                    }
                    if(!!data.extra_requirement){
                        if(data.extra_requirement.entry_date){
                            self.get_comlimitedcondition_limitedconditionDataStatus.entry_dateData=data.extra_requirement.entry_date;
                            self.get_comlimitedcondition_limitedconditionDataStatus.entry_date=true;
                            self.get_comlimitedcondition_limitedconditionDataStatus.entry_dateStr='请选择到岗时间';
                        }else{
                            self.get_comlimitedcondition_limitedconditionDataStatus.entry_date=false;
                            delete self.get_comlimitedcondition_limitedconditionData.entry_date;
                        }


                        if(data.extra_requirement.work_experience){
                            self.get_comlimitedcondition_limitedconditionData.work_experience=data.extra_requirement.work_experience.value;
                            self.get_comlimitedcondition_limitedconditionDataStatus.work_experienceData=data.extra_requirement.work_experience.require;
                            self.get_comlimitedcondition_limitedconditionDataStatus.work_experience=true;
                            // self.limitedconditionDataStatus.work_experienceStr=data.extra_requirement.work_experience.length>0 ? data.extra_requirement.work_experience.join('、') : '请选择工作经验';
                            let arrStr=[];
                            if(!!data.extra_requirement.work_experience.value){
                                for(let i=0;i<data.extra_requirement.work_experience.value.length;i++){
                                    for(let j=0;j<data.extra_requirement.work_experience.require.length;j++){
                                        if(data.extra_requirement.work_experience.value[i]==data.extra_requirement.work_experience.require[j].id){
                                            arrStr.push(data.extra_requirement.work_experience.require[j].title);
                                        }
                                    }
                                }
                                if(arrStr.length>0){
                                    self.get_comlimitedcondition_limitedconditionDataStatus.work_experienceStr=arrStr.join('、');
                                    self.get_comlimitedcondition_limitedconditionDataStatus.work_experienceBoolean=true;
                                }else{
                                    self.get_comlimitedcondition_limitedconditionDataStatus.work_experienceStr='请选择工作经验';
                                }   
                            }
                        }else{
                            self.get_comlimitedcondition_limitedconditionDataStatus.work_experience=false;
                            self.get_comlimitedcondition_limitedconditionDataStatus.work_experienceStr='请选择工作经验';
                            delete self.get_comlimitedcondition_limitedconditionData.work_experience;
                        }


                        if(!!data.extra_requirement.height || data.extra_requirement.height=='' || data.extra_requirement.height=='0'){
                            if(data.extra_requirement.height=='0'){
                                self.get_comlimitedcondition_limitedconditionData.height='';
                            }else{
                                self.get_comlimitedcondition_limitedconditionData.height=data.extra_requirement.height;
                            }
                            self.get_comlimitedcondition_limitedconditionDataStatus.height=true;
                        }else{
                            self.get_comlimitedcondition_limitedconditionDataStatus.height=false;
                            delete self.get_comlimitedcondition_limitedconditionData.height;
                        }

                        if(!!data.extra_requirement.weight || data.extra_requirement.weight=='' || data.extra_requirement.weight=='0'){
                            if(data.extra_requirement.weight=='0'){
                                self.get_comlimitedcondition_limitedconditionData.weight='';
                            }else{
                                self.get_comlimitedcondition_limitedconditionData.weight=data.extra_requirement.weight;
                            }
                            self.get_comlimitedcondition_limitedconditionDataStatus.weight=true;
                        }else{
                            self.get_comlimitedcondition_limitedconditionDataStatus.weight=false;
                            delete self.get_comlimitedcondition_limitedconditionData.weight;
                        }

                        if(!!data.extra_requirement.is_health_cert || data.extra_requirement.is_health_cert==''){
                            self.get_comlimitedcondition_limitedconditionData.is_health_cert=data.extra_requirement.is_health_cert;
                            self.get_comlimitedcondition_limitedconditionDataStatus.is_health_cert=true;
                        }else{
                            self.get_comlimitedcondition_limitedconditionDataStatus.is_health_cert=false;
                            delete self.get_comlimitedcondition_limitedconditionData.is_health_cert;
                        }

                        if(!!data.extra_requirement.address){
                            // console.log(data.extra_requirement.address);
                            self.get_comlimitedcondition_limitedconditionData.ad_city_id=data.extra_requirement.address.value.ad_city_id;
                            self.get_comlimitedcondition_limitedconditionData.ad_district_id=data.extra_requirement.address.value.ad_district_id;
                            self.get_comlimitedcondition_limitedconditionData.ad_street_id=data.extra_requirement.address.value.ad_street_id;
                            self.get_comlimitedcondition_limitedconditionDataStatus.address=true;
                            self.get_comlimitedcondition_limitedconditionDataStatus.addressName=!!data.extra_requirement.address.value.city_name ? data.extra_requirement.address.value.city_name+data.extra_requirement.address.value.district_name+data.extra_requirement.address.value.street_name : '请选择居住地点';
                            if(!!data.extra_requirement.address.value.ad_city_id){
                                self.get_comlimitedcondition_limitedconditionDataStatus.addressBoolean=true;
                            }
                        }else{
                            self.get_comlimitedcondition_limitedconditionDataStatus.address=false; 
                            delete self.get_comlimitedcondition_limitedconditionData.ad_city_id;
                            delete self.get_comlimitedcondition_limitedconditionData.ad_district_id;
                            delete self.get_comlimitedcondition_limitedconditionData.ad_street_id;
                        }
                    }

                    // console.log(self.limitedconditionData);
                });
            },

            checkInfo(){
                let self=this;
                // console.log(self.rapidlyapplyObj);
                //addLog EV
                if(self.rapidlyapplyObj.is_login==0){
                    KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=m@ca_from=applyconfirm_fastapply' + self.tjStr);
                    KCloggerApi.addLog('0','报名限制页_完成并报名点击&登录状态&{"登录状态":"未登录"}');
                }else{
                    KCloggerApi.addLog('0','报名限制页_完成并报名点击&登录状态&{"登录状态":"登录"}');
                    if(self.rapidlyapplyObj.is_resume_complete==0){
                        KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=m@ca_from=applyconfirm_noresume' + self.tjStr);
                    }else{
                        KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=m@ca_from=applyconfirm_hasresume' + self.tjStr);
                    }
                }
                //状态重置
                // self.necessaryInfo.necessaryCheckStatus=false;
                self.$store.commit(comNecessary_mt.SET_CHECK_STATUS, false);
                // self.loginInfo.loginCheckStatus=false;
                self.$store.commit(comLogin_mt.SET_LOGIN_CHECK_STATUS, false);

                self.get_comlimitedcondition_limitedconditionDataStatus.limitedconditionStatus=false;

                if(self.rapidlyapplyObj.is_resume_complete==0){
                    // self.checkNecessaryInfo();
                    self.$store.commit(comNecessary_mt.CHECK_NECESSARY_INFO);
                }else{
                    // self.necessaryInfo.necessaryCheckStatus=true;
                    self.$store.commit(comNecessary_mt.SET_CHECK_STATUS, true);
                }

                if(self.get_comnecessary_necessaryCheckStatus){
                    // self.checkLimitedconditionInfo();
                    self.$store.commit(comLimitedcondition_mt.CHECK_LIMITEDCONDITION_INFO);
                }
                if(self.get_comlimitedcondition_limitedconditionDataStatus.limitedconditionStatus){
                    if(self.rapidlyapplyObj.is_login==0){
                        // self.checkLoginInfo(true);
                        self.$store.commit(comLogin_mt.SET_LOGIN_INFO, self.loginInfo);
                        self.$store.commit(comLogin_mt.CHECK_LOGIN_INFO);
                    }else{
                        // self.loginInfo.loginCheckStatus=true;
                        self.$store.commit(comLogin_mt.SET_LOGIN_CHECK_STATUS, true);
                    }
                }
                if(self.get_comlogin_loginCheckStatus){
                    let data={};
                    data.job_id=self.rapidlyapplyObj.jobId;
                    if(self.rapidlyapplyObj.is_resume_complete==0){
                        data.resume={};
                        data.resume.real_name=self.get_comnecessary_info.realName;
                        data.resume.gender=self.get_comnecessary_info.gender;
                        data.resume.birth_date=self.get_comnecessary_info.birthDate;
                        data.resume.at_school=self.get_comnecessary_info.atSchool;
                    }
                    data.extra_requirement=self.get_comlimitedcondition_limitedconditionData;
                    if(self.rapidlyapplyObj.is_login==0){
                        data.mobile={};
                        data.mobile.number=self.loginInfo.phoneNumber;
                        data.mobile.verification=self.loginInfo.code;
                    }

                    KCdetailPage.submit(data);
                }
                
            },
            /**
             * 在window上挂载供Native调用接口的方法
             * @method mountingWindow
             * @public
             * @return {Null} void
             */
            mountingWindow (){
                let self = this;
                window.loadData=function(){
                    self.setInfo();
                };
            }
        },
        beforeCreate() {

        },
        created() {
            let self = this;
            self.initFun();
            // console.log(this.getLoginInfo);
            let from = Util.getQueryString('from');
            if (from == 'push') {
                let messageType = Util.getQueryString('messageType') || '-';
                let business_date = Util.getQueryString('business_date') || '-';
                let push_id = Util.getQueryString('push_id') || '-';
                let push_channel = Util.getQueryString('push_channel') || '-';//v3.2
                self.tjStr = '@from=' + from + '@messageType=' + messageType + '@business_date=' + business_date + '@push_id=' + push_id + '@push_channel=' + push_channel;
            }else{
                self.tjStr = '@from=' + from;
            }
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/form.css"></style>
<style src="static/css/signing_express.css"></style>