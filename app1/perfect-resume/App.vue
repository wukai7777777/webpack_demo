<template>
    <div>
        <!-- com-mid-loading -->
        <com-mid-loading :com-mid-is-show="pageLoadingStatus" />
            <!-- section start -->
        <section class="mod-content resume" v-show="showBody">
            <!-- form start -->
            <div class="form-widget normal">
               
                <h2 class="form-heading">基本信息</h2>
                <div class="form-group">
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">姓名</label>
                            <div class="form-control">
                                <span class="text-group disabled" v-if="resumeData.audit_status">{{resumeData.real_name}}</span>
                                <label class="input-group" v-else>
                                    <input type="text" v-model="resumeData.real_name" @input="checkInputLen(20)" @focus="inputFocus($event)" maxlength="20" class="input-text" placeholder="请输入">
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="form-item" >
                            <label class="form-label">出生年份</label>
                            <div class="form-control">
                                <span class="text-group disabled" v-if="resumeData.audit_status">{{resumeData.birth_date == 0 ? '请选择' : resumeData.birth_date + '年'}}</span>
                                <div class="filter-group" @click="selectBirthDate()" v-else>
                                    <div class="filter-tips js-touch-state" :class="{active: !!resumeData.birth_date && resumeData.birth_date != 0}">{{(!resumeData.birth_date || resumeData.birth_date == 0) ? '请选择' : resumeData.birth_date + '年'}}</div>
                                    <div class="mask"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">性别</label>
                            <div class="form-control">
                                <div class="multi-group">
                                    <span class="text-group disabled" v-if="resumeData.audit_status">{{resumeData.gender == 1 ? '男' : '女'}}</span>
                                    <template v-else>
                                        <label for="male" class="radio-group">
                                            <input type="radio" name="radio-sex" value="1" v-model="resumeData.gender">
                                            <span>男</span>
                                        </label>
                                        <label for="female" class="radio-group">
                                            <input type="radio" name="radio-sex" value="2" v-model="resumeData.gender">
                                            <span>女</span>
                                        </label>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">身份</label>
                            <div class="form-control">
                                <div class="multi-group">
                                    <label for="stu-radio" class="radio-group">
                                        <input type="radio" name="radio-sf" value="1" v-model="resumeData.at_school">
                                        <span>学生</span>
                                    </label>
                                    <label for="nostu-radio" class="radio-group">
                                        <input type="radio" name="radio-sf" value="0" v-model="resumeData.at_school">
                                        <span>非学生</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                

                <h2 class="form-heading">求职偏好</h2>
                <div class="form-group">
                    <div class="form-field" >
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
                        <div class="form-item" >
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
                

                <!-- 登陆组件 -->

                <div class="form-opt">
                    <button type="button" class="btn btn-primary btn-large" @click="checkSubmitData()">完成</button>
                </div>

                <!-- 无法获取验证码提示组件 -->
            </div>
            <!-- form end -->
        </section>
    </div>
   
        <!-- section end -->
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCpreferencesPage from 'clientApi/KCpreferencesPage'
    import KCPageCompleteResume from 'clientApi/KCPageCompleteResume'
    import KCcache from 'clientApi/KCcache'
    import KCucApi from 'clientApi/KCucApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCwidget from 'clientApi/KCwidget'
    
    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'

    let checkChangeStatus = false;
    let province = 1, city = 12, district = 177;
    let freeTimeName = [], freeTimeID = [],selectTimeID = '', selectTimeIndex = '0';
    let selectID = [], selectName = [];
    let focusDom = null;
    /**
     *  组件实例对象
     */
    export default {
        components: {
            comMidLoading
        },
        data: function(){
            return{
                resumeData: {
                    birth_date: ''
                },
                data: {},
                //偏好区域
                areaName:'请选择',
                areaActive:false,
                // 空闲时间
                selectTimeName:'请选择',
                selectTimeActive:false,
                // 期望职位
                expectJobTypeName:'请选择',
                expectJobTypeActive:false,
                showBody: false,
                pageLoadingStatus: false,
                placeholder: '留下联系方式，方便我们联系您',
                checkLogin: true,
                oldData: {}
                
            }
        },
        vuex: {
            getters: {
               
            },
            actions: {
               
            }
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
                self.mountingWindow();
                        
                if(Util.OS() == 'ios'){
                    window.scrollTo = function(){
                        var pos = Util.getAbsPoint(focusDom);
                        KCucPage.domPosition(pos.y, $(focusDom).height())
                    }
                }
                self.loadData();
            },
            loadData() {
                var self=this;
                self.pageLoadingStatus = true

                Util.ajax({
                    url:'/resume',
                    apiPath: '/api/v3/client',
                    timeout:10000,
                    ctrlStatus: {
                        loading: 1,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function (data) {
                        self.pageLoadingStatus = false;
                        if(!!data && data.code == 1000) {
                            self.showBody = true
                            self.setPerfect(data.data);
                        }else {
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
            /**
             * 3.0.0埋点
             * @param {[type]} data [description]
             */
            setLog(data) {
                if(!!data && !data.real_name && !data.birth_date && (data.at_school === '' || data.at_school === undefined) && !data.gender) {
                    //无简历
                    KCloggerApi.addLog('1', '/jianzhi/profile/noprofile_login');
                }else {
                    //有简历
                    KCloggerApi.addLog('1', '/jianzhi/profile/hasprofile_login');
                }
                
            },
            /**
             *  设置求职偏好
             * @param {[type]} data [description]
             */
            setPerfect(data) {
                var self = this;
                self.setLog(data);
                //获取客户端引导页用户填写信息
                KCPageCompleteResume.getResumeInfo(function(resumeInfo) {
                    if(!!data && data.audit_status) {
                        //实名认证用户
                        data.birth_date = !!data.birth_date ? data.birth_date.substring(0,4) : '';
                        self.resumeData = data;
                    }else {
                        //非实名认证用户(客户端拿到的数据优先级高)
                        if(!!data) {
                           data.birth_date =  !!data.birth_date ? data.birth_date.substring(0,4) : '';
                           self.resumeData = data
                        }
                        if(!!resumeInfo) {
                            if(!!resumeInfo.gender) {
                                self.resumeData.gender = resumeInfo.gender;
                            }
                            if(!!resumeInfo.identity) {
                                self.resumeData.at_school = resumeInfo.identity == 3 ? 0 : resumeInfo.identity;
                            }
                            if(!!resumeInfo.birth && resumeInfo.birth != 0) {
                                self.resumeData.birth_date = resumeInfo.birth;
                            }
                            if(!!resumeInfo.name) {
                                self.resumeData.real_name = resumeInfo.name;
                            }
                        }
                        
                    }
                    self.oldData.real_name = self.resumeData.real_name;
                    self.oldData.gender = self.resumeData.gender;
                    self.oldData.at_school = self.resumeData.at_school;
                });
                // 偏好区域
                if(!!data.province_name) {
                    self.areaActive = true;
                    self.areaName = data.province_name;
                    province = data.province_id;
                }
                if(!!data.city_name) {
                    self.areaName += data.city_name;
                    city = data.city_id;
                }
                if(!!data.district_name) {
                    self.areaName += data.district_name;
                    district = data.district_id;
                }
               
               // 期望职位
                if(!!data.job_type && data.job_type.length > 0) {
                    for (let item in data.job_type) {
                        selectName.push(data.job_type[item].title);
                        selectID.push(data.job_type[item].id);
                    }
                    selectID = selectID.join(',')
                    self.expectJobTypeName = selectName.join('、');
                    self.expectJobTypeActive = true;

                }

                // 空闲时间
                for (let freetimeType in data.free_time) {
                    if (freetimeType == '-1') {
                        freeTimeID.unshift(freetimeType);
                        freeTimeName.unshift(data.free_time[freetimeType]);
                    }else{
                        freeTimeID.push(freetimeType);
                        freeTimeName.push(data.free_time[freetimeType]);
                    }   
                }
                if (data.freetime_type != 0 && !!data.freetime_type) {
                    self.selectTimeName = data.free_time[data.freetime_type];
                    selectTimeID = data.freetime_type;
                    self.selectTimeActive = true;
                    freeTimeID.forEach(function (value,index) {
                        if (value == self.selectTimeID) {
                            selectTimeIndex = index;
                        }
                    });
                }
            },
            checkSubmitData() {
                var self=this;
                if(!!self.resumeData.real_name) {
                    if(!/^([\u4e00-\u9fa5]|[A-Za-z])+([\.\u00B7]?([\u4e00-\u9fa5]|[A-Za-z])+)+$/.test(self.resumeData.real_name)) {
                        KCwidget.toast('姓名格式错误！');
                        return false;
                    }
                } else {
                    KCwidget.toast('请填写姓名');
                    return false;
                }
                if(!self.resumeData.birth_date) {
                    KCwidget.toast('请选择生日');
                    return false;
                }
                if(!self.resumeData.gender) {
                    KCwidget.toast('请选择性别');
                    return false;
                }
                if(self.resumeData.at_school === '' || self.resumeData.at_school === undefined) {
                    KCwidget.toast('请选择身份');
                    return false;
                }
                if(!self.areaActive) {
                    KCwidget.toast('请选择偏好区域');
                    return false;
                }
                if(!self.selectTimeActive) {
                    KCwidget.toast('请选择空闲时间');
                    return false;
                }
                if(!self.expectJobTypeActive) {
                    KCwidget.toast('请选择期望职位');
                    return false;
                }
             
                KCucPage.loadPageStatus('loading','加载中');
                self.submit();
               
            },
            loginFn () {
                var self=this;
                KCucPage.loadPageStatus('loading','加载中');
                KCucApi.logIn(self.loginInfo.phoneNumber, self.loginInfo.code, '', {from:'nologin'}, function(data) {
                    if (data.status == 1) {
                        self.checkLogin = false;
                        self.submit();
                    }else{
                        KCucPage.loadPageStatus('loadSuccess');
                    }
                });
            },
            submit() {
                var self=this;
                let postData = {
                    real_name: self.resumeData.real_name,
                    gender: self.resumeData.gender,
                    birth_date: self.resumeData.birth_date,
                    at_school: self.resumeData.at_school,//0: 非学生，1: 学生
                    province_id: province,
                    city_id: city,
                    district_id: district,
                    job_type: selectID,
                    free_time: selectTimeID
                };
                Util.ajax({
                    url:'/resume',
                    apiPath: '/api/v3/client',
                    type:'POST',
                    data:postData,
                    timeout:10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: true,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function (data) {
                        KCucPage.loadPageStatus('loadSuccess');
                        if(!!data && data.code == 1000) {
                            //刷新个人中心页面用户信息
                            KCcache.getCache('accountWebViewID', (webViewIdData) => {
                                if(!!webViewIdData && (!!webViewIdData.WebViewID || webViewIdData.WebViewID == 0)) {
                                    KCPageCompleteResume.refreshPage(null, webViewIdData.WebViewID)
                                }
                                KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@ca_from=save');
                                // 跳转设置成功页
                                let from = Util.getQueryString('from');
                                window.location.href = 'doumi:///set-resume-success.html?statusCode=302&from=' + from;
                            });
                        }else if(!!data && !!data.message){
                            KCwidget.toast(data.message);
                        }else {
                            KCwidget.toast('服务器异常');
                        }
                    },
                    error:function (xhr,status) {
                    },
                    noNetwork:function () {
                    }
                });
            },
            checkInputLen(len) {
                if(this.resumeData.real_name.length == len) {
                    KCwidget.toast(`姓名最多输入${len}个字符`);
                    return false;
                }
            },
            inputFocus(event) {
                focusDom = $(event.target)[0];
            },
            /**
             * 选择出生年月
             * @method selectBirthDate
             * @public
             * @return {Null} void
             */
            selectBirthDate () {
                let self = this;

                //选择生日
                let dateParam = {
                    data1 : []
                };
                let minYear = new Date().getFullYear() - 55;
                let maxYear = new Date().getFullYear() - 16;
                for(let year = minYear; year <= maxYear; year++){
                    dateParam.data1.push("" + year);
                }
                
                let birth_date = !!self.resumeData.birth_date ? self.resumeData.birth_date : (!!self.data.birth_date ? self.data.birth_date : '');
                let dateRegArr = birth_date.split('-');
                dateRegArr[0] = (dateRegArr[0] == 0 || dateRegArr[0] < minYear) ? (maxYear-4)+'' : dateRegArr[0];

                let dateParamPos1 = dateParam.data1.indexOf(dateRegArr[0]).toString();

                KCclientUI.showPicker(dateParam, [dateParamPos1], '选择出生年份', function (data) {
                    if(data.status == 1){
                        checkChangeStatus = true;
                        dateParamPos1 = data.data1;
                        // dateParamPos2 = data.data2;
                        let dateStr = dateParam.data1[dateParamPos1];
                        self.resumeData.birth_date = dateStr;
                    }
                    
                });
            },
            /**
             * 偏好设置点击
             * @return {[type]} [description]
             */
            showProvinceAndCityPicker () {
                var self=this;
                KCpreferencesPage.showProvinceAndCityPicker('偏好区域', function (data) {
                    if (data.status==1) {
                        checkChangeStatus = true;
                        province = data.selected[0].id;
                        city = data.selected[1].id;
                        district = data.selected[2].id;

                        self.areaActive = true;
                        self.areaName = '';
                        data.selected.forEach(function(item) {
                            self.areaName += item.name;
                        });

                    }
                });
            },
            /**
             * 空闲时间点击
             * @return {[type]} [description]
             */
            showFreeTime () {
                var self=this;

                KCclientUI.showPicker({data1: freeTimeName}, [selectTimeIndex], '空闲时间', function (data) {
                    if (!!data && data.status == 1) {
                        checkChangeStatus=true;
                        selectTimeIndex = data.data1+'';
                        selectTimeID = freeTimeID[data.data1];
                        self.selectTimeName = freeTimeName[data.data1];
                        self.selectTimeActive = true;
                    }
                });
            },
            /**
             * 期望职位点击
             * @return {[type]} [description]
             */
            jumpJobTypeSelect () {
                window.location.href="doumi://jobtypeselect?selectID=" + selectID;
            },
            mountingWindow () {
                var self = this;
                window.checkChange = function () {
                    if(checkChangeStatus || self.setCheckChangeStatus()){
                        KCclientUI.showDialog('确定退出？', '退出后将无法保存此次填写信息', function(data){
                            if(data.status == 1){
                                KCpreferencesPage.goBack();
                            }
                        }, '退出', '继续编辑', '');
                    }else{
                        KCpreferencesPage.goBack();
                    }
                }

                window.loadData = function (data) {
                    if(!!data) {
                        let selectDataArr = decodeURIComponent(data).split('&');
                        if (selectDataArr[1].length == 0) {
                            self.expectJobTypeName = '请选择';
                            self.expectJobTypeActive = false;
                        }else{
                            self.expectJobTypeName = selectDataArr[1];
                            self.expectJobTypeActive = true; 
                        }
                        checkChangeStatus = true;
                        selectID = selectDataArr[0];
                    }
                }
            },
            /**
             * 设置checkChangeStatus字段，点击返回时是否提示
             */
            setCheckChangeStatus() {
                if(this.oldData.real_name != this.resumeData.real_name) {
                    return true;
                }else if(this.oldData.gender != this.resumeData.gender) {
                    return true;
                }else if(this.oldData.at_school != this.resumeData.at_school) {
                    return true;
                }else{
                    return false;
                }
            }
        },
        created(){

            this.initFun();
             // 设置title bar 文案和动作
            KCucPage.updateTitleBar({
                backAction: 'checkChange', //安卓
                leftDisplay: false,
                leftText: '',
                leftAction: 'checkChange', //ios
                rightDisplay: false,
                rightText: '',
                rightAction: ''
            });
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/form.css"></style>
<style src="static/css/resume.css"></style>
