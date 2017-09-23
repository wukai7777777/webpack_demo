<template>
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content position">
            <!-- form start -->
            <div class="form-widget">
                <p class="form-tips">请选择您期望的职位，最多可选3个</p>
                <div class="form-group">
                    <div class="form-field vertical" v-for="(item, item_index) in expectjobtype">
                        <div class="form-item">
                            <label class="form-label">{{item.name}}</label>
                            <div class="form-control">
                                <ul class="filter-type mod-list">
                                    <template v-for="(itemType, itemType_index) in item.child_items">
                                        <li class="mod-list-item" @click="selectJobType(item_index, itemType_index, itemType)" v-bind:class="{ active:selectIDArr.indexOf(itemType.value) != -1 }">
                                            <span class="mod-list-info js-touch-state">{{itemType.name}}</span>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>       
            </div>
            <!-- form end -->
        </section>
        <!-- section end -->
    </div>
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCwidget from 'clientApi/KCwidget'
    import { KCpageInstances } from 'clientApi/KCpage'
    import KCclientUI from 'clientApi/KCclientUI'
    import KCpreferencesPage from 'clientApi/KCpreferencesPage'
    import KCcache from 'clientApi/KCcache'
    import KCloggerApi from 'clientApi/KCloggerApi'
    
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
               expectjobtype:[],
                selectIDArr:[],
                serverIDArr:[],
                selectNameArr:[] 
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
            initFun () {
                let self=this;
                let selectID = '';
                if (Util.OS() == 'ios') {
                    selectID = decodeURIComponent(Util.getQueryString('selectID'));
                }else{
                    selectID = Util.getQueryString('selectID');
                }
                
                if (selectID) {
                    self.selectIDArr = selectID.split(',');
                    self.serverIDArr = selectID.split(',');
                    self.selectIDArr.forEach(function(item, index){
                        if (item == '10' || item == 'null') {
                            self.selectIDArr.splice(self.selectIDArr.indexOf(item), 1);
                            self.serverIDArr.splice(self.serverIDArr.indexOf(item), 1);
                        }
                    });
                }
                
                KCcache.getCache('jobTypeData',function(data){
                    if (data) {
                        self.expectjobtype=data.data;
                        self.getJobType();
                    }else{
                        self.getJobType();
                    }
                });
                window.checkJobType = function () {
                    if(self.serverIDArr.sort().toString() != self.selectIDArr.sort().toString()){
                        KCclientUI.showDialog('确定退出？', '退出之后将无法保存本次修改', function(data){
                            if(data.status == 1){
                                KCloggerApi.addLog('0','期望职位_返回按钮点击量&期望职位_返回按钮点击量&{"选择":"已选未保存"}');
                                KCpageInstances.goBack();
                            }
                        }, '退出', '继续编辑', '');
                    }else{
                        KCloggerApi.addLog('0','期望职位_返回按钮点击量&期望职位_返回按钮点击量&{"选择":"未选择"}');
                        KCpageInstances.goBack();
                    }
                };

                window.finishSelect = function () {
                    if(self.serverIDArr.sort().toString() != self.selectIDArr.sort().toString()){

                        KCloggerApi.addLog('0','期望职位_完成按钮点击量&期望职位_完成按钮点击量&{"选择":"'+self.selectNameArr.join('、')+'"}');
                        KCpageInstances.goBack(1,'',encodeURIComponent(self.selectIDArr.join(',') + '&' + self.selectNameArr.join('、')));

                    }else{
                        KCloggerApi.addLog('0','期望职位_完成按钮点击量&期望职位_完成按钮点击量&{"选择":"未选择"}');
                        KCpageInstances.goBack();
                    }
                };

                KCpageInstances.updateTitleBar({
                    backAction: 'checkJobType', //安卓
                    leftDisplay: false,
                    leftText: '',
                    leftAction: 'checkJobType', //ios
                    rightDisplay: true,
                    rightText: '完成',
                    rightAction: 'finishSelect'
                }); 
                KCloggerApi.addLog('0','期望职位页面_展现量&期望职位页面_展现量&');      
            },

            getJobType () {
                let self = this;
                KCpreferencesPage.getExpectJobType (function (data) {
                    data.data.shift();//除去热门
                    // data.data.pop();//出去其他
                    self.expectjobtype=data.data;
                    self.selectFromServer(data);
                    KCcache.setCache('jobTypeData', data, 10 * 24 * 60 * 60);
                });
            },
            selectFromServer (data) {
                let self = this;
                // if (self.selectIDArr.length != 0) {
                    data.data.forEach(function(item,index){
                        item.child_items.forEach(function(child_item, item_index){
                            self.selectIDArr.forEach(function(value){
                                if (child_item.value == value) {
                                    child_item.active = true;
                                    self.selectNameArr.push(child_item.name);
                                }
                            });
                            if (child_item.value == '10') {
                                item.child_items.splice(item_index, 1);
                            }
                        });
                    });
                // }
            },
            selectJobType (index, subIndex, itemType) {
                let self = this;
                
                let child_item = self.expectjobtype[index].child_items[subIndex];
                // console.log(itemType.active);
                if(itemType.active || self.selectIDArr.length < 3){
                    if (child_item.value == itemType.value) {
                        let activeValue = child_item.active;
                        child_item.active = !activeValue;
                        if (child_item.active) {
                            self.selectIDArr.push(child_item.value);
                            self.selectNameArr.push(child_item.name);
                        }else{
                            self.selectIDArr.splice(self.selectIDArr.indexOf(child_item.value), 1);
                            self.selectNameArr.splice(self.selectNameArr.indexOf(child_item.name), 1);
                        }
                    }
                }else{
                    KCwidget.toast('最多可选3个');
                }
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
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/form.css"></style>
<style src="static/css/job-type-options.css"></style>