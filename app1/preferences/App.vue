<template>
    <div>
        <!-- com-mid-loading -->
        <com-mid-loading :com-mid-is-show="pageLoadingStatus" />
        <div class="mod-page" v-show="showActive">
            <!-- section start -->
            <section class="mod-content position">
                <!-- form start -->
                <div class="form-widget">
                    <p class="form-tips">设置偏好后，斗米可为你精准推荐优质职位</p>
                    <div class="form-group">
                        <div class="form-field">
                            <div class="form-item">
                                <label class="form-label">偏好区域</label>
                                <div class="form-control" @click="showProvinceAndCityPicker">
                                    <div class="filter-group">
                                        <div class="filter-tips js-touch-state" v-bind:class="{ active: areaActive }">{{areaName}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-field">
                            <div class="form-item">
                                <label class="form-label">空闲时间</label>
                                <div class="form-control" @click="showFreeTime">
                                    <div class="filter-group">
                                        <!-- <div class="filter-tips js-touch-state active">不限</div> -->
                                        <div class="filter-tips js-touch-state" v-bind:class="{ active: selectTimeActive }">{{selectTimeName}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-field">
                            <div class="form-item">
                                <label class="form-label">期望职位</label>
                                <!-- <div class="form-control" @click="showExpectJobList"> -->
                                <div class="form-control" @click="jumpJobTypeSelect">
                                    <div class="filter-group">
                                        <div class="filter-tips js-touch-state" v-bind:class="{ active: expectJobTypeActive }"> {{expectJobTypeName}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <login v-model="loginInfo"></login> 

                    <div class="form-opt" @click="checkUserPreferences">
                        <button type="button" class="btn btn-primary btn-large js-touch-state">保存</button>
                    </div>

                    <noidencode></noidencode>
                </div>
                <!-- form end -->
            </section>
            <!-- section end -->
        </div>
    </div>
   
</template>

<script>
    /**
     *  引入工具类库 或 模块API
     */
    import Util from 'tool/widget/Util'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCpreferencesPage from 'clientApi/KCpreferencesPage'
    import KCcache from 'clientApi/KCcache'
    import KCucApi from 'clientApi/KCucApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCwidget from 'clientApi/KCwidget'
    import {mapGetters} from 'vuex'
    /**
     *  引入组件 以及 组件接口(Action)
     */
    import Login from 'components/com-login/com-login'
    import Noidencode from 'components/com-noidencode/com-noidencode'
    import * as comlogin from 'components/com-login/com-login-mutation-types'
    import * as comnoidencode from 'components/com-noidencode/com-noidencode-mutation-types'
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'

    /**
     *  组件实例对象
     */
    export default {
        components: { Login, Noidencode, comMidLoading},
        data () {
            return{
                pageLoadingStatus:true,
                checkChangeStatus:false,
                isLogin:true,
                showActive:false,
                isSetting:true,
                // 偏好区域
                province: 1,
                city: 12,
                district: 177,
                areaName:'请选择偏好区域',
                areaActive:false,

                //期望职位
                // expectJobTypeIDList:[],
                // expectJobTypeNameList:[],
                expectJobTypeName:'请选择期望职位',
                expectJobTypeActive:false,
                selectID:[], //已选职位的id
                selectName:[], // 已选职位的name
                selectedJobTypeIndex:[], // 已选择的职位的index
                // 空闲时间
                freeTimeName:[],
                freeTimeID:[],
                selectTimeName:'请选择空闲时间',
                selectTimeID:'',
                selectTimeActive:false,
                selectTimeIndex:'0',
                userId: '0',
                loginInfo: {}
            }
        },
        computed: {
            ...mapGetters(['get_comlogin_showLogin', 'get_comlogin_loginCheckStatus'])
        },
        methods: {
            initFun () {
                var self=this;
                self.mountingWindow();
                KCucApi.getUserInfo(function (data) {
                    self.userId = data.userId;
                    if(data.userId!='0'){
                        self.$store.commit(comlogin.SET_LOGIN_STATUS, false);
                        self.$store.commit(comnoidencode.SET_IS_SHOW_ENTRY, false);
                        self.$store.commit(comnoidencode.SET_LOG_SOURCE, '急速报名页面');
                        self.isLogin=true;
                        KCloggerApi.addLog('0', '职位偏好设置_页面展现量&登录状态&{"状态":"登录"}');
                    }else{
                        self.isLogin=false;
                        self.$store.commit(comnoidencode.SET_IS_SHOW_ENTRY, true);
                        self.$store.commit(comnoidencode.SET_LOG_SOURCE, '职位偏好页面');
                        self.$store.commit(comlogin.SET_LOGIN_STATUS, true);
                        KCloggerApi.addLog('0', '职位偏好设置_页面展现量&登录状态&{"状态":"未登录"}');
                    }
                });

                KCucPage.updateTitleBar({
                    backAction: 'checkChange', //安卓
                    leftDisplay: false,
                    leftText: '',
                    leftAction: 'checkChange', //ios
                    rightDisplay: false,
                    rightText: '',
                    rightAction: ''
                });
            },
            showProvinceAndCityPicker () {
                var self=this;
                KCpreferencesPage.showProvinceAndCityPicker('偏好区域',function (data) {
                    if (data.status==1) {
                        self.checkChangeStatus=true;
                        self.province=data.selected[0].id;
                        self.city=data.selected[1].id;
                        self.district=data.selected[2].id;
                        self.areaActive=true;
                        self.areaName='';
                        data.selected.forEach(function(item){
                            self.areaName+=item.name;
                        });

                        KCloggerApi.addLog('0', '偏好区域_选项点击量&偏好区域_选项点击量&');
                    }
                });
                KCloggerApi.addLog('0', '偏好选区域项_点击&偏好选区域项_点击&{"位置":"'+self.province+self.city+self.district+'"}');
            },
            showFreeTime () {
                var self=this;

                KCclientUI.showPicker({data1:self.freeTimeName},[self.selectTimeIndex],'空闲时间',function (data) {
                    if (!!data && data.status==1) {
                        self.checkChangeStatus=true;
                        self.selectTimeIndex=data.data1+'';
                        self.selectTimeID=self.freeTimeID[data.data1];
                        self.selectTimeName=self.freeTimeName[data.data1];
                        self.selectTimeActive=true;
                        KCloggerApi.addLog('0', '空闲时间_选项点击量&空闲时间_选项点击量&{"位置":"'+self.selectTimeIndex+'"}');
                    }
                });
                KCloggerApi.addLog('0', '空闲时间选项_点击&空闲时间选项_点击&');
            },
            jumpJobTypeSelect () {
                let self=this;

                KCloggerApi.addLog('0', '期望职位选项_点击&期望职位选项_点击&');
                // window.location.href="http://169.254.86.147:8000/app/preferences-job-type-select/preferences-job-type-select.html?selectID="+self.selectID.join(',');
                window.location.href="doumi://jobtypeselect?selectID="+self.selectID.join(',');
            },
            loadUserPreferences () {
                var self=this;
                Util.ajax({
                    url:'/prefer/get',
                    timeout:10000,
                    ctrlStatus: {
                        loading: 1,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function (data) {
                        self.pageLoadingStatus = false;
                        // KCloggerApi.addLog('1','/jianzhi/my/prefer');
                        if (!!data && !!data.free_time) {
                            self.showActive=true;
                            if (data.code == -100 || data.code == -200) {
                                self.showActive=true;
                                self.$store.commit(comlogin.SET_LOGIN_STATUS, true);
                                self.$store.commit(comnoidencode.SET_IS_SHOW_ENTRY, true);
                                self.$store.commit(comnoidencode.SET_LOG_SOURCE, '职位偏好页面');
                                self.isLogin = false;
                            }
                            for (var name in data.free_time) {
                                if (name=='-1') {
                                    self.freeTimeID.unshift(name);
                                    self.freeTimeName.unshift(data.free_time[name]);
                                }else{
                                    self.freeTimeID.push(name);
                                    self.freeTimeName.push(data.free_time[name]);
                                }   
                            }

                            var settingData=data.setting;

                            if (!!settingData.place) {
                                if (!!settingData.place.province) {
                                    self.areaActive=true;
                                    self.areaName=settingData.province_name;
                                    self.province=settingData.place.province;
                                }
                                if (!!settingData.place.city) {
                                    self.areaName+=settingData.city_name;
                                    self.city=settingData.place.city;
                                }
                                if (!!settingData.place.district) {
                                    self.areaName+=settingData.district_name;
                                    self.district=settingData.place.district;
                                }
                            }else{
                                self.isSetting=false;
                            }

                            if (!!settingData.job_type || settingData.job_type=='0') {
                                self.selectID=settingData.job_type.split(',');
                                for (var name in settingData.job_type_name) {
                                    self.selectName.push(settingData.job_type_name[name]);
                                }
                                self.expectJobTypeName=self.selectName.join('、');
                                self.expectJobTypeActive=true;
                                // self.expectJobTypeIDList.forEach(function(value,index){
                                //     self.selectID.forEach(function(key){
                                //         if(value==key){
                                //            self.selectedJobTypeIndex.push(index); 
                                //         }
                                //     });
                                // });
                                
                            }

                            
                            if (!!settingData.freetime_type) {
                                self.selectTimeName=data.free_time[settingData.freetime_type];
                                self.selectTimeID=settingData.freetime_type;
                                self.selectTimeActive=true;
                                self.freeTimeID.forEach(function (value,index) {
                                    if (value==self.selectTimeID) {
                                        self.selectTimeIndex=index;
                                    }
                                });
                            }


                        }else{
                            KCucPage.loadPageStatus('loadFailed');    
                        }
                    },
                    error:function (xhr,status) {
                        self.pageLoadingStatus = false;
                    },
                    noNetwork:function () {
                        self.pageLoadingStatus = false;
                    }
                });
            },
            checkUserPreferences () {
                var self=this;
                if (!self.areaActive) {
                    KCwidget.toast('请选择偏好区域');
                    return false;
                }else if (!self.selectTimeActive) {
                    KCwidget.toast('请选择空闲时间');
                    return false;
                }else if (!self.expectJobTypeActive) {
                    KCwidget.toast('请选择期望职位');
                    return false;
                }else{
                    //登录操作
                    if (self.isLogin) {
                        // self.get_comlogin_loginInfo.loginCheckStatus=true;
                        self.$store.commit(comlogin.SET_LOGIN_CHECK_STATUS, true);
                        KCucPage.loadPageStatus('loading','加载中');
                        self.updateSetting();
                    }else{
                        self.$store.commit(comlogin.SET_LOGIN_INFO, self.loginInfo);
                        self.$store.commit(comlogin.CHECK_LOGIN_INFO, true);
                        if(self.get_comlogin_loginCheckStatus){
                            //登录
                            self.loginFn();
                        } 
                    }    
                }
                    
            },
            loginFn () {
                var self=this;
                KCucPage.loadPageStatus('loading','加载中');
                KCucApi.logIn(self.loginInfo.phoneNumber, self.loginInfo.code,'',{from:'nologin'},function(data){
                    if (data.status == 1) {
                        self.updateSetting();
                    }else{
                        KCucPage.loadPageStatus('loadSuccess');
                    }
                });
            },
            updateSetting () {
                var self=this;
                var place={"province":self.province,"city":self.city,"district":self.district};
                Util.ajax({
                    url:'/prefer/setting',
                    data:{
                        place:place,
                        free_time:self.selectTimeID,
                        job_type:self.selectID.join(',')
                    },
                    timeout:10000,
                    type:'POST',
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function (data) {
                        // console.log(data);
                        if(data.code == 1000){
                            KCucPage.loadPageStatus('loadSuccess');
                            KCwidget.toast('职位偏好设置成功');
                            if(self.isSetting){
                                KCloggerApi.addLog('0','保存按钮点击&修改&{"修改":"成功"}');
                            }else{
                                KCloggerApi.addLog('0','保存按钮点击&新建&{"新建":"成功"}');   
                            } 

                            if(self.isLogin){
                                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=save_login');
                            }else{
                                KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=save_no_login');
                            }
                             
                            KCpreferencesPage.setPreferencesSuccess(1);
                            KCcache.getCache('indexWebViewID', (webViewIdData) => {
                                if(!!webViewIdData && webViewIdData.WebViewID) {
                                    KCpreferencesPage.refreshPage(null, webViewIdData.WebViewID)
                                }
                                KCpreferencesPage.goBack(1);
                            })
                        }else{
                            KCwidget.toast('服务器异常');
                            if(self.isSetting){
                                KCloggerApi.addLog('0','保存按钮点击&修改&{"修改":"失败"}');
                            }else{
                                KCloggerApi.addLog('0','保存按钮点击&新建&{"新建":"失败"}');
                            } 
                            KCpreferencesPage.setPreferencesSuccess(0);
                        }   
                    },
                    error:function (xhr,status) {
                        // console.log(xhr);
                        // KCucPage.loadPageStatus('loadSuccess');
                        // if (status == 'timeout') {
                        //     KCwidget.toast('网络请求超时');
                        // }else{
                        //     KCwidget.toast('服务器异常');
                        // }
                        if (self.isSetting) {
                            KCloggerApi.addLog('0','保存按钮点击&修改&{"修改":"失败"}');
                        }else{
                            KCloggerApi.addLog('0','保存按钮点击&新建&{"新建":"失败"}');
                        }
                        KCpreferencesPage.setPreferencesSuccess(0);
                    },
                    noNetwork:function () {
                        // KCucPage.loadPageStatus('loadSuccess');
                        // KCwidget.toast('网络异常');
                        if(self.isSetting){
                            KCloggerApi.addLog('0','保存按钮点击&修改&{"修改":"失败"}');
                        }else{
                            KCloggerApi.addLog('0','保存按钮点击&新建&{"新建":"失败"}');
                        }
                        KCpreferencesPage.setPreferencesSuccess(0);
                    }
                });
            },
            mountingWindow () {
                var self = this;
                window.checkChange = function () {
                    if(self.checkChangeStatus){
                        KCclientUI.showDialog('确定退出？', '退出之后将无法保存本次修改', function(data){
                            if(data.status == 1){
                                if (self.userId != '0') {
                                    if (self.get_comlogin_showLogin) {
                                        KCucApi.logOut();
                                    } else {
                                        KCpreferencesPage.goBack();
                                    }
                                } else {
                                    KCpreferencesPage.goBack();
                                }
                            }
                        }, '退出', '继续编辑', '');
                    }else{
                        if (self.userId != '0') {
                            if (self.get_comlogin_showLogin) {
                                KCucApi.logOut();
                            } else {
                                KCpreferencesPage.goBack();
                            }
                        } else {
                            KCpreferencesPage.goBack();
                        }
                    }
                }

                window.loadData = function (data) {
                    let selectDataArr = decodeURIComponent(data).split('&');
                    
                    if (selectDataArr[1].length == 0) {
                        self.expectJobTypeName = '请选择期望职位';
                        self.expectJobTypeActive = false;
                    }else{
                       self.expectJobTypeName = selectDataArr[1];
                        self.expectJobTypeActive = true; 
                    }
                    self.checkChangeStatus = true;
                    self.selectID = selectDataArr[0].split(',');
                }
            }
        },
        created () {
            var self = this;
            self.initFun();
            self.loadUserPreferences();
        }
        
    }

    
</script>

<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/form.css"></style>
<style src="static/css/position_option.css"></style>