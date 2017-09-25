<template>
 <div>
    <!-- com-mid-loading -->
    <com-mid-loading :com-mid-is-show="isShowPageloading" />
    <!-- section start -->
    <section class="mod-content resume" v-cloak v-show="showBody">
        <!-- form start -->
        <div class="form-widget normal">
            <div class="form-group" @click="selectLogo()">
                <div class="form-field extend">
                    <div class="form-item">
                        <label class="form-label">头像</label>
                        <div class="form-control" >
                            <!-- pic-group为默认，上传中加loading，上传后加active  -->
                            <div class="pic-group pic-avatar active" :class="{active: resumeData.logo}">
                                <label class="btn-file">
                                    <img v-if="resumeData.logo == ''" src="../../static/imgs/default.png" alt="avatar">
                                    <img v-else :src="resumeData.logo" alt="avatar">
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-warning">
                    <span>请上传头像</span>
                </div>
            </div>
            <h2 class="form-heading">基本信息
                <span class="fc-grey">{{resumeData.id_audit ? '（实名认证用户必填资料不可修改）' : '（必填）'}}</span>
            </h2>
            <div class="form-group">
                <div class="form-renzheng" v-show="resumeData.audit_status == -404">
                    <a :href="'doumi://browser/'+encodeURIComponent('https://m.doumi.com/member/auth_profile')" class="form-text"><i class="icon icon-renzheng"></i>完成实名认证享受更多特权</a>
                </div>
                <div class="form-renzheng" v-show="resumeData.audit_status == -1">
                    <a :href="'doumi://browser/'+encodeURIComponent('https://m.doumi.com/member/index')" class="form-text"><i class="icon icon-renzheng"></i>实名认证中，请等待</a>
                </div>
                <div class="form-renzheng" v-show="resumeData.audit_status == 2">
                    <a :href="'doumi://browser/'+encodeURIComponent('https://m.doumi.com/member/auth_profile')" class="form-text"><i class="icon icon-renzheng"></i>实名认证未通过，请修改</a>
                </div>
                <div class="form-renzheng active" v-show="resumeData.audit_status == 1">
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">姓名</label>
                            <div class="form-control">
                                <span class="text-group disabled">{{resumeData.real_name}}</span>
                            </div>
                        </div>
                        <div class="form-item">
                            <label class="form-label">性别</label>
                            <div class="form-control">
                                <span class="text-group disabled">{{resumeData.gender == 1 ? '男' : '女'}}</span>
                            </div>
                        </div>
                        <div class="form-item">
                            <label class="form-label">出生年份</label>
                            <div class="form-control">
                                <span class="text-group disabled">{{resumeData.birth_date}}</span>
                            </div>
                        </div>
                    </div>
                    <span class="form-text"><i class="icon icon-renzheng"></i>实名认证已通过</span>
                </div>
                <div v-show="resumeData.audit_status != 1">
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">姓名</label>
                            <div class="form-control">
                                <span class="text-group disabled" v-if="resumeData.id_audit">{{resumeData.real_name}}</span>
                                <label class="input-group" v-else>
                                    <input type="text" v-model="resumeData.real_name" @input="checkInputLen('real_name', '', 20)" @focus="inputFocus('real_name', $event)" maxlength="20" class="input-text" placeholder="填写真实姓名更易被录取">
                                </label>
                            </div>
                        </div>
                        <div class="form-warning">
                            <span>请输入姓名</span>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">性别</label>
                            <div class="form-control">
                                <span class="text-group disabled" v-if="resumeData.id_audit">{{resumeData.gender == 1 ? '男' : '女'}}</span>
                                <template v-else>
                                    <div class="multi-group">
                                        <label for="male" class="radio-group">
                                            <input type="radio" name="radio-sex" value="1" v-model="resumeData.gender">
                                            <span>男</span>
                                        </label>
                                        <label for="female" class="radio-group">
                                            <input type="radio" name="radio-sex" value="2" v-model="resumeData.gender">
                                            <span>女</span>
                                        </label>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="form-warning">
                            <span>请选择性别</span>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="form-item">
                            <label class="form-label">出生年份</label>
                            <div class="form-control">
                                <span class="text-group disabled" v-if="resumeData.id_audit">{{resumeData.birth_date == 0 ? '选择自己的生日' : resumeData.birth_date + '年'}}</span>
                                <template v-else>
                                    <div class="filter-group">
                                        <div class="filter-tips" :class="{active:resumeData.birth_date != 0}" @click="selectBirthDate()">{{resumeData.birth_date == 0 ? '选择自己的生日' : resumeData.birth_date + '年'}}</div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="form-warning">
                            <span>请选择出生年月</span>
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
                <div class="form-warning">
                    <span>请选择身份</span>
                </div>
            </div>
            <h2 class="form-heading">详细信息</h2>
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">身高</label>
                        <div class="form-control">
                            <div class="multi-group">
                                <label class="input-group">
                                    <input type="tel" v-model="resumeData.height" @input="checkInputLen('height', '身高', 3)" @focus="inputFocus('height', $event)" class="input-text" maxlength="3" placeholder="请填写身高">
                                </label>
                                <span class="text-group">厘米</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-warning">
                        <span>请输入身高</span>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">体重</label>
                        <div class="form-control">
                            <div class="multi-group">
                                <label class="input-group">
                                    <input type="tel" v-model="resumeData.weight" @input="checkInputLen('weight' ,'体重', 3)" @focus="inputFocus('weight', $event)" class="input-text" maxlength="3" placeholder="请填写体重">
                                </label>
                                <span class="text-group">公斤</span>
                            </div>
                        </div>
                        <div class="form-warning">
                            <span>请输入体重</span>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">健康证</label>
                        <div class="form-control">
                            <div class="multi-group">
                                <label class="radio-group">
                                    <input type="radio" name="health-card" value="1" v-model="resumeData.is_health_cert">
                                    <span>有</span>
                                </label>
                                <label class="radio-group">
                                    <input type="radio" name="health-card" value="0" v-model="resumeData.is_health_cert">
                                    <span>无</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-warning">
                        <span>请选择健康证</span>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">居住地点</label>
                        <div class="form-control">
                            <div class="filter-group">
                                <div class="filter-tips" :class="{active: !!resumeData.ad_city_name}" @click="selectAddress()">
                                    <template v-if="!!resumeData.ad_street_name">
                                        {{!!resumeData.ad_city_name ? resumeData.ad_city_name + resumeData.ad_district_name + resumeData.ad_street_name : '请选择居住地点'}}
                                    </template>
                                    <template v-else>
                                        {{!!resumeData.ad_city_name ? resumeData.ad_city_name + resumeData.ad_district_name :'请选择居住地点'}}
                                    </template>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2 class="form-heading" :class="{hide: resumeData.at_school != 1}">教育经历</h2>
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">学校</label>
                        <div class="form-control">
                            <!-- <label class="input-group">
                                <input type="text" v-model="resumeData.school_name" maxlength="15" class="input-text" placeholder="请输入学校名称">
                            </label> -->
                            <div class="filter-group">
                                <div class="filter-tips" :class="{active: !!resumeData.school_name}" @click="selectSchoolName()">{{resumeData.school_name == '' ? '请选择学校名称' : resumeData.school_name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">学历</label>
                        <div class="form-control">
                            <div class="filter-group">
                                <div class="filter-tips" :class="{active: resumeData.degreeStr != ''}" @click="selectDegree()">{{resumeData.degreeStr != '' ? resumeData.degreeStr : '请选择学历'}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="form-warning">
                        <span>请选择学历</span>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">入学年份</label>
                        <div class="form-control">
                            <div class="filter-group">
                                <div class="filter-tips" :class="{active: resumeData.enrol_date != 0}" @click="selectEnrolDate()">{{resumeData.enrol_date == 0 ? '请选择入学年份' : resumeData.enrol_date}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h2 class="form-heading">联系方式</h2>
            <div class="form-group">
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">微信号</label>
                        <div class="form-control">
                            <label class="input-group">
                                <input type="text" v-model="resumeData.contact_wechat" @input="checkInputLen('contact_wechat', '微信号', 20)" @focus="inputFocus('contact_wechat', $event)" maxlength="20" class="input-text" placeholder="请填写微信号">
                            </label>
                        </div>
                    </div>
                </div>
                <div class="form-field">
                    <div class="form-item">
                        <label class="form-label">QQ号</label>
                        <div class="form-control">
                            <label class="input-group">
                                <input type="tel" v-model="resumeData.contact_qq" @input="checkInputLen('contact_qq', 'QQ号', 15)" @focus="inputFocus('contact_qq', $event)" maxlength="15" class="input-text" placeholder="请填写QQ号">
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <h2 class="form-heading">个人照片</h2>
            <div class="form-group">
                <div class="form-field extend">
                    <div class="form-item">
                        <div class="form-control">
                            <div class="multi-group">
                                <!-- pic-group为默认，上传中加loading，上传后加active  -->
                                <label v-for="(item, index) in pslPhotos" :key="item.id" class="pic-group active">
                                    <span class="btn-file" @click="delAndViewBigPho(pslPhotos, index)">
                                        <!-- <input type="file"> -->
                                        <img v-bind:src="item.url" alt="">
                                    </span>
                                </label>
                                <label class="pic-group" @click="selectPhotos()" v-show="photosflag">
                                    <span class="btn-file">
                                        <!-- <input type="file"> -->
                                        <img src="https://sta.doumistatic.com/src/image/logo_doumi.png" alt="">
                                    </span>
                                </label>
                                <!-- <label class="pic-group loading" data-role="photo-item">
                                    <span class="btn-file">
                                        <input type="file">
                                        <img src="http://sta.doumistatic.com/src/image/logo_doumi.png" data-role="actionsheet-target" alt="">
                                    </span>
                                </label> -->
                            </div>
                            <span class="text-group">单张照片不超过5M，最多不能超过3张</span>
                        </div>
                    </div>
                    <div class="form-warning"><span>表单验证内容</span></div>
                </div>
            </div>
        </div>
        <!-- form end -->
    </section>
    <!-- section end -->
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
    import fastclick from 'tool/lib/fastclick'
    import Util from 'tool/widget/Util'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCclientInfo from 'clientApi/KCclientInfo'
    import KCcityApi from 'clientApi/KCcityApi'
    import KCloggerApi from 'clientApi/KCloggerApi'
    import KCucPage from 'clientApi/KCucPage'
    import KCwidget from 'clientApi/KCwidget'
    import md5 from 'tool/lib/md5'
    
    /**
     *  引入组件 以及 组件mutation
     *  example : import comName from 'components/com-name/com-name'
     *  example : import * as comname_mt from 'components/com-name/com-name-mutation-types'
     */
    import comMidLoading from 'components/com-mid-loading/com-mid-loading'

    /**
     *  组件实例对象
     */
    export default {
        components: {
            comMidLoading
        },
        data () {
            return {
                isShowPageloading: true,
                signMd5Str: '',
                requestTimes: 1,
                //通知客户端是否需要加积分，就是简历是否首次填写  1首次加积分 0非首次不加
                resumeCredit: 0,
                //是否是第一次填写简历
                isFirstFill: true,
                //图片服务器地址
                picDomain: 'https://image.doumi.com/',
                //当前获取焦点的表单元素
                focusDom: null,//############
                //记录当前正在校验的输入
                currentInput: '',
                //记录超出字数次数
                overNum: 0,
                //记录预输入时数字长度
                reachedLenObj: {
                    'real_name': 0,
                    'height': 0,
                    'weight': 0,
                    'contact_qq': 0
                },
                resumeData: {},
                //存储个人照片
                pslPhotos: [],
                //限制上传照片3张
                photosflag: true,
                showBody: false,
            }
        },
        computed: {

        },
        methods: {
            /**
             * 初始化
             * @method init
             * @public
             * @return {Null} void
             */
            initFn () {
                let self = this;
                self.isShowPageloading = true
                self.getResumeData();
                //点击返回的时候调用此函数检查简历是否有修改
                window.checkChange = function () {
                    //埋点
                    let real_name = self.resumeData.real_name != '' ? '' : '真实姓名';
                    let sex = self.resumeData.gender > -1 ? '' : '性别';
                    let birthday = self.resumeData.birth_date ? '' : '出生年份';
                    let isSchool = self.resumeData.at_school > -1 ? '' : '在校生';
                    let allFill = '';
                    if(real_name == '' && sex == '' && birthday == '' && isSchool == ''){
                        allFill = '全部填写';
                    }

                    let strArray = [real_name, sex, birthday, isSchool, allFill];

                    while(strArray.indexOf('') > -1){
                        let pos = strArray.indexOf('');
                        strArray.splice(pos, 1)
                    }

                    let logStr = strArray.join('、');

                    KCloggerApi.addLog('0', '简历_离开退出页面&点击界面返回按钮&{"未填项":"' + logStr + '"}');

                    if (self.signMd5Str != self.signMd5()) {
                        //有修改 title,message,fn,okBtn,cancelBtn,imageName
                        KCclientUI.showDialog('确定退出简历?', '退出不保存修改的内容', function(data){
                            if (data.status == 1) {
                                //2.8.5 弹窗退出埋点
                                KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@ca_from=quit')
                                //2.8.5 我的简历返回按钮点击埋点
                                KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@ca_from=back')
                                KCucPage.goBack();
                                KCucPage.resumeComplete(false);
                            } else {
                                //2.8.5 弹窗继续编辑埋点
                                KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@ca_from=continue')
                            }
                        }, '退出', '继续编辑', 'Unsaved');
                    } else {
                        //直接退出
                        //2.8.5 我的简历返回按钮点击埋点
                        KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@ca_from=back');
                        KCucPage.goBack();
                        KCucPage.resumeComplete(false);
                    }
                };

                //客户端选择学校后，设置学校名称
                window.setSchoolName = function (data) {
                    self.resumeData.school_name = data;
                };

                //客户端点击 保存 按钮的时候调用此函数
                window.saveResume = function () {
                    //表单校验
                    let errorMsg = self.formValidate();

                    //如果有错误信息输出，说明校验未通过
                    if (!!errorMsg) {
                        //做一些其他的事
                        KCloggerApi.addLog('0', '简历_点击保存简历按钮&保存失败&{"校验失败":"' + errorMsg + '"}');
                        KCwidget.toast(errorMsg);
                        return false;
                    }
                    //2.8.5 我的简历保存成功埋点
                    KCloggerApi.addLog('2', '@atype=click@ca_name=doumi@ca_source=app@ca_from=save');
                    // 通过验证，保存简历

                    self.saveResumeData();
                };

                if(Util.OS() == 'ios'){
                    window.scrollTo = function(){
                        var pos = Util.getAbsPoint(self.focusDom);
                        KCucPage.domPosition(pos.y, $(self.focusDom).height())
                    }
                }

                KCloggerApi.addLog('0', '简历_查看简历页面&简历_简历页面展现量&{"简历页面":"展现量"}');
            },
            /**
             * 获取简历数据　
             * @method getResumeData
             * @public
             * @return {Null} void
             */
            getResumeData () {
                let self = this;
                Util.ajax({
                    url:'/ucenter/resume',
                    timeout:10000,
                    ctrlStatus: {
                        loading: 1,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        if (!!data && data.user_id && typeof(data) == 'object') {
                            if (data.real_name == '') {
                                self.isFirstFill = true;
                            } else {
                                self.isFirstFill = false;
                            }

                            if (data.can_apply < 1) {
                                data.degree = '-1';
                            }

                            if (data.birth_date != 0) {
                                data.birth_date = data.birth_date.substring(0, 4);
                            } else{
                                self.resumeCredit = 1;
                            }

                            switch (data.degree) {
                                case '-1':
                                    data.degreeStr = '';
                                    break;
                                case '0':
                                    data.degreeStr = '初中及以下';
                                    break;
                                case '1':
                                    data.degreeStr = '高中';
                                    break;
                                case '2':
                                    data.degreeStr = '专科';
                                    break;
                                case '3':
                                    data.degreeStr = '本科';
                                    break;
                                case '4':
                                    data.degreeStr = '硕士';
                                    break;
                                case '5':
                                    data.degreeStr = '博士及以上';
                                    break;
                                default:
                                    data.degreeStr = '';
                                    break;
                            };

                            data.logoName = data.logo_origin.replace('@base@tag=imgScale&amp;h=65&amp;w=65', '');
                            data.heacerName = self.picDomain + data.health_certificate;
                            if (data.real_name.length > 20) {
                                data.real_name = data.real_name.substring(0, 21);
                            }

                            if(data.personal_photos.length==3){
                                self.photosflag = false;
                            }
                            //console.log(data.personal_photos)
                            data.personal_photos.forEach(function(item){
                                //var thumbUrl = item.thumbUrl.replace('http://', 'https://');
                                var thumbUrl = item.thumbUrl.replace('http://', 'https://');
                                if (Util.OS() == 'ios') {
                                   var falseUrl = thumbUrl.replace('_100-100c_6-0', '');
                                } else {
                                   var falseUrl = thumbUrl.replace('_60-60c_6-0', '');
                                }
                                let index = falseUrl.indexOf('&');
                                falseUrl = falseUrl.substring(0,index);
                                let imgurl = {
                                    url : thumbUrl,
                                    falseurl: falseUrl,
                                    phoName: item.url
                                };
                                self.pslPhotos.push(imgurl);
                            })
                            //console.log(self.pslPhotos)

                            self.resumeData = data;
                            self.resumeData.birthdayStr = self.resumeData.birth_date + '年';

                            // 设置title bar 文案和动作
                            KCucPage.updateTitleBar({
                                backAction: 'checkChange',
                                leftDisplay: false,
                                leftText: '',
                                leftAction: 'checkChange',
                                rightDisplay: true,
                                rightText: '保存',
                                rightAction: 'saveResume'
                            });

                            self.signMd5Str = self.signMd5();
                        }else{
                            if (self.requestTimes == 1) {
                                // 重新请求
                                self.requestTimes++;

                            } else if (self.requestTimes == 2){
                                KCucPage.loadPageStatus('netWorkFailed');
                                KCucPage.updateTitleBar({
                                    backAction: '',
                                    leftDisplay: false,
                                    leftText: '',
                                    leftAction: '',
                                    rightDisplay: false,
                                    rightText: '保存',
                                    rightAction: 'saveResume'
                                });
                            }
                        }
                        self.showBody = true
                        self.isShowPageloading = false;
                    },
                    error:function(xhr, status){
                        self.isShowPageloading = false;
                    },
                    noNetwork: function(){
                        self.isShowPageloading = false;
                        KCucPage.updateTitleBar({
                            backAction: '',
                            leftDisplay: false,
                            leftText: '',
                            leftAction: '',
                            rightDisplay: false,
                            rightText: '保存',
                            rightAction: 'saveResume'
                        });
                    }
                });
            },
            /**
             * 保存简历数据
             * @method saveResumeData
             * @public
             * @return {Null} void
             */
            saveResumeData () {
                let self = this;
                let photots = [];

                self.pslPhotos.forEach(function(item){
                    photots.push(item.phoName);
                });

                let postData = {
                    logo: self.resumeData.logoName,
                    real_name: self.resumeData.real_name,
                    gender: self.resumeData.gender,
                    birth_date: self.resumeData.birth_date + '-1',
                    at_school: self.resumeData.at_school,
                    height: self.resumeData.height,
                    weight: self.resumeData.weight,
                    is_health_cert: self.resumeData.is_health_cert,
                    ad_city_id: self.resumeData.ad_city_id,
                    ad_district_id: self.resumeData.ad_district_id,
                    ad_street_id: self.resumeData.ad_street_id,
                    health_certificate: self.resumeData.health_certificate,
                    school_name: self.resumeData.at_school == 1 ? self.resumeData.school_name : '',
                    degree: self.resumeData.at_school == 1 ? self.resumeData.degree : -1,
                    enrol_date: self.resumeData.at_school == 1 ? self.resumeData.enrol_date : 0,
                    contact_wechat: self.resumeData.contact_wechat,
                    contact_qq: self.resumeData.contact_qq,
                    declaration: self.resumeData.declaration,
                    photos: photots
                };
                //console.log(postData.photos)

                KCucPage.loadPageStatus('loading', '保存中');

                Util.ajax({
                    url:'/ucenter/resume',
                    type: 'POST',
                    data:postData,
                    timeout:10000,
                    ctrlStatus: {
                        loading: 0,
                        cache: false,
                        errNum: 0,
                        netNum: 0,
                    },
                    success:function(data){
                        //alert(99)
                        // console.log(data);
                        if(data.code == 0){
                            KCucPage.loadPageStatus('loadSuccess', '保存成功');
                            KCwidget.toast('保存成功');
                            // 通知客户端状态，保存成功
                            KCucPage.resumeComplete(true, self.resumeCredit);
                            if(self.isFirstFill){
                                KCloggerApi.addLog('0', '简历_点击保存简历按钮&保存成功&{"简历状态":"第一次填写"}');
                            }else{
                                KCloggerApi.addLog('0', '简历_点击保存简历按钮&保存成功&{"简历状态":"修改"}');
                            }

                            // 更新md5值
                            self.signMd5Str = self.signMd5();

                            KCucPage.goBack(1);

                        }else{
                            KCwidget.toast('服务器异常');
                            KCucPage.loadPageStatus('loadSuccess');
                        }
                    },
                    error:function(xhr, status){
                    },
                    noNetwork: function(){
                    }
                });
            },
            /**
             * 数字签名
             * @method signMd5
             * @public
             * @return {String}
             */
            signMd5() {
                let self = this;
                //头像src值
                let headSrcStr = self.resumeData.logo || '../../static/imgs/default.png';
                //姓名值
                let nameStr = self.resumeData.real_name;
                //性别
                let sexStr = self.resumeData.gender || '';
                //生日
                let birthdayStr = self.resumeData.birth_date || '选择自己的生日';
                //身份
                let sfStr = self.resumeData.at_school || '';
                //身高
                let heightStr = self.resumeData.height;
                //体重
                let weightStr = self.resumeData.weight;
                //健康证
                let certSrcStr = self.resumeData.is_health_cert || '';
                //住址
                let addressStr = self.resumeData.ad_city_name + self.resumeData.ad_district_name + self.resumeData.ad_street_name || '请选择居住地点';
                //学校
                let schoolStr = self.resumeData.school_name;
                //学历
                let eduStr = self.resumeData.degree || '请选择学历';
                //入学年份
                let schoolyearStr = self.resumeData.enrol_date || '请选择入学年份';
                //微信号
                let wxStr = self.resumeData.contact_wechat;
                //qq号
                let qqStr = self.resumeData.contact_qq;
                //自我评价
                // let commStr = $('#comm-textarea').val();
                //个人照片
                let photoStr = JSON.stringify(self.pslPhotos);

                let signatureStr = headSrcStr + nameStr + sexStr + birthdayStr + sfStr + heightStr + weightStr + certSrcStr + addressStr + schoolStr + eduStr + schoolyearStr + wxStr + qqStr + photoStr;

                return md5(signatureStr);
            },
            /**
             * 选择学校
             * @method selectSchoolName
             * @public
             * @return {Null} void
             */
            selectSchoolName () {
                KCucPage.selectSchoolName();
            },
            /**
             * 选择学历
             * @method selectDegree
             * @public
             * @return {Null} void
             */
            selectDegree () {
                let self = this;
                //选择学历
                let eduParam = {
                    data1 : ['初中及以下', '高中', '专科', '本科', '硕士', '博士及以上']
                }
                let eduParamPos = self.resumeData.degree == '-1' ? '2' : self.resumeData.degree;

                KCclientUI.showPicker(eduParam, [eduParamPos], '选择学历', function (data) {
                    if(data.status == 1){
                        eduParamPos = data.data1
                        let dataStr = eduParam.data1[eduParamPos];
                        self.resumeData.degreeStr = dataStr;
                        self.resumeData.degree = eduParamPos;
                    }
                });
            },
            /**
             * 选择入学年份
             * @method selectEnrolDate
             * @public
             * @return {Null} void
             */
            selectEnrolDate () {
                let self = this;
                //选择入学年份
                let schoolyearParam = {
                    data1 : []
                };
                for(let sy = 1990; sy <= new Date().getFullYear(); sy++){
                    schoolyearParam.data1.push("" + sy)
                }
                let syPos = "" + (schoolyearParam.data1.length - 1);
                if(self.resumeData.enrol_date != 0){
                    syPos = schoolyearParam.data1.indexOf(self.resumeData.enrol_date).toString();
                }

                KCclientUI.showPicker(schoolyearParam, [syPos], '选择入学年', function (data) {
                    if(data.status == 1){
                        syPos = data.data1
                        let syStr = schoolyearParam.data1[syPos];
                        self.resumeData.enrol_date = syStr;
                    }

                });
            },
            /**
             * 选择居住地点
             * @method selectAddressCityName
             * @public
             * @return {Null} void
             */
            selectAddress () {
                let self = this;
                KCcityApi.showCityPicker(function (data) {
                    if(data.status==1){
                        self.resumeData.ad_city_id = data.cityId;
                        self.resumeData.ad_city_name = data.cityName;
                        self.resumeData.ad_district_name = data.selected[0].name;
                        self.resumeData.ad_district_id = data.selected[0].id;

                        if (data.selected.length == 1) {
                            self.resumeData.ad_street_name = '';
                            self.resumeData.ad_street_id = '';
                        } else {
                            self.resumeData.ad_street_name  =  data.selected[1].name;
                            self.resumeData.ad_street_id = data.selected[1].id;
                        }
                    }
                });
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

                let dateRegArr = self.resumeData.birth_date.split('-');
                dateRegArr[0] = (dateRegArr[0] == 0 || dateRegArr[0] < minYear) ? (maxYear - 4)+'' : dateRegArr[0];

                let dateParamPos1 = dateParam.data1.indexOf(dateRegArr[0]).toString();

                KCclientUI.showPicker(dateParam, [dateParamPos1], '选择出生年份', function (data) {
                    if(data.status == 1){
                        dateParamPos1 = data.data1;
                        // dateParamPos2 = data.data2;
                        let dateStr = dateParam.data1[dateParamPos1];
                        self.resumeData.birth_date = dateStr;
                        self.resumeData.birthdayStr = dateStr + '年';
                    }

                });
            },
            /**
             * 选择头像
             * @method selectLogo
             * @public
             * @return {Null} void
             */
            selectLogo () {
                let self = this;
                KCclientUI.selectAndUploadImage(function(data){
                    if(data.status == '1'){
                        self.resumeData.logo = data.imageURL;
                        self.resumeData.logoName = data.imageName;
                    }else if(data.status == '-1') {
                        KCwidget.toast('上传图片超过5M');
                     }else{
                        KCwidget.toast('上传失败');
                    }
                }, 1, 2);
            },
            /**
             * 添加个人照片
             * @method addPhotos
             * @public
             * @return {null} void
             */
             selectPhotos () {
                 let self = this;
                 KCclientUI.selectAndUploadImage(function(data){
                     //console.log(data)
                     if(data.status == '1'){
                         if (Util.OS() == 'ios') {
                            data.imageURL = data.imageURL.replace('http://', 'https://');
                            var falseUrl = data.imageURL.replace('_100-100c_6-0', '');
                            var phoName = data.imageName;
                         } else {
                            var falseUrl = data.imageURL.replace('_60-60c_6-0', '');
                            var phoName = data.info[0].url;
                         }
                         let index = falseUrl.indexOf('&');
                         falseUrl = falseUrl.substring(0, index);
                         var imgurl = {
                             url: data.imageURL,
                             falseurl: falseUrl,
                             phoName: phoName
                         };
                        self.pslPhotos.push(imgurl);
                         if (self.pslPhotos.length==3) {
                             self.photosflag = false;
                         }
                     } else if(data.status == '-1') {
                        KCwidget.toast('上传图片超过5M');
                     } else {
                         KCwidget.toast('上传失败');
                     }
                 }, 0, 3);

             },
             /**
              * 删除和查看大图个人照片
              * @method deletePho
              * @public
              * @return {null} void
              */
             delAndViewBigPho (imgUrls, index) {
                  let self = this;
                  let urls = [];
                  $.each(imgUrls,function(index, el) {
                     urls.push(el.falseurl);
                  });
                  KCclientUI.pictureOperationDialog('查看大图', urls, index, function(){
                       // 删除图片
                       self.pslPhotos.splice(index, 1);
                       // 重置 上传按钮
                       if (self.pslPhotos.length<3) {
                           self.photosflag = true;
                       }
                  })
             },
            /**
             * 表单校验
             * @method formValidate
             * @public
             * @return {String}
             */
            formValidate () {
                let self = this;
                if (!self.resumeData.real_name) {
                    return '请填写姓名';
                } else if (!/^([\u4e00-\u9fa5]|[A-Za-z])+([\.\u00B7]?([\u4e00-\u9fa5]|[A-Za-z])+)+$/.test(self.resumeData.real_name)) {
                    return '姓名只能输入汉字或字母';
                } else if (self.resumeData.gender == '') {
                    return '请选择性别';
                } else if (self.resumeData.birth_date == '') {
                    return '请选择生日';
                } else if (self.resumeData.at_school == '') {
                    return '请选择身份';
                } else if (!!self.resumeData.height && (self.resumeData.height < 130 || self.resumeData.height > 250)) {
                    return '身高输入有误';
                } else if (!!self.resumeData.height && (!/^\d+$/.test(self.resumeData.height) || parseInt(self.resumeData.height, 10) == 0)) {
                    return '身高输入有误';
                } else if (!!self.resumeData.weight && (self.resumeData.weight < 30 || self.resumeData.weight > 200)) {
                    return '体重输入有误';
                } else if (!!self.resumeData.weight && (!/^\d+$/.test(self.resumeData.weight) || parseInt(self.resumeData.weight, 10) == 0)) {
                    return '体重输入有误';
                } else if(!!self.resumeData.contact_wechat && /[\u4e00-\u9fa5]/g.test(self.resumeData.contact_wechat)) {
                    return '微信号不可输入汉字';
                } else if (!!self.resumeData.contact_wechat && !/^([A-Za-z]|[0-9]|-|_)*$/.test(self.resumeData.contact_wechat)) {
                    return '微信号格式错误';
                } else if(!!self.resumeData.contact_qq && !/^\d+$/.test(self.resumeData.contact_qq)){
                    return 'QQ号只能是数字';
                } else if(self.resumeData.contact_qq.length<5 && !!self.resumeData.contact_qq) {
                    return 'QQ号不小于5位';
                }
            },
            /**
             * 输入校验长度
             * @method checkInputLen
             * @public
             * @return {null} void
             */
            checkInputLen (ele, info, len) {
                let self = this;

                if (self.currentInput != ele) {
                    self.currentInput = ele;
                    self.overNum = 0;
                }

                if (self.reachedLenObj[ele] == len) {
                    if (self.resumeData[ele].length == len) {
                        self.overNum = 2;
                    } else {
                        self.overNum = 0;
                    }
                } else {
                    if (self.resumeData[ele].length == len) {
                        if (self.overNum < 2) {
                            self.overNum++;
                        }
                    } else {
                        self.overNum = 0;
                    }
                }

                self.reachedLenObj[ele] = self.resumeData[ele].length;

                if (self.overNum > 1) {
                    if(ele=='contact_wechat') {
                        KCwidget.toast(`${info}最多输入${len}个字符`);
                    }else {
                        KCwidget.toast(`${info}最多输入${len}个数字`);
                    }
                    //return false;
                }
            },
            /**
             * 记录获取焦点时长度
             * @method checkInputLen
             * @public
             * @return {null} void
             */
            inputFocus (ele, event) {
                let self = this;
                self.focusDom = $(event.target)[0];
                self.reachedLenObj[ele] = self.resumeData[ele].length;
            }
        },
        beforeCreate() {

        },
        created() {
            this.initFn();
        }
        
    }
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/form.css"></style>
<style src="static/css/resume.css"></style>