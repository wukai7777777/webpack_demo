<template>
    <!-- section start -->
    <section class="mod-content complain">
        <ul class="menu mod-list bc-main com-border-bottom">
            <li class="mod-list-item com-border-bottom" v-for="(item,index) in navTitleArr">
                <a href="javascript:;" class="mod-list-info com-arrow-right" @click="goToTargetPage(index)">{{item}}</a>
            </li>
        </ul>
    </section>
    <!-- section end -->
</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */
    import Util from 'tool/widget/Util'
    import KCloggerApi from 'clientApi/KCloggerApi'
    
    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */

    /**
     *  组件实例对象
     */
    export default {
        components: {

        },
        data () {
            return{
                navTitleArr: ['兼职投诉', '特工申诉', '意见反馈']
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
             * @method init
             * @public
             * @return {Null} void
             */
            goToTargetPage (navId) {
                let self = this;
                let url = 'doumi://';
                let webViewId = Util.getQueryString('webViewId') || '';
                switch (navId) {
                    case 0: {
                        let title = encodeURIComponent("选择职位投诉");
                        let subtitle = encodeURIComponent("全部,已报名,已录取,已拒绝");//v3.0.0全部,已报名,已录取,已结束=》全部,已报名,已录取,已拒绝
                        url += `applylist?entry='tsyfk'&title=${title}&subtitle=${subtitle}&subpath=modules/new_frame/apply-list.html`;
                        KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=jz_complain');
                        break; 
                    }
                    case 1: {
                        url += 'online-complain-select';
                        KCloggerApi.addLog('2','@atype=click@ca_name=doumi@ca_source=app@ca_from=dmtg_complain');
                        break;
                    } 
                    case 2: {
                        url += `feedback?&webViewId=${webViewId}`;
                        KCloggerApi.addLog(2,'@atype=click@ca_name=doumi@ca_source=app@ca_from=feedback');
                        break;
                    }   
                };
                // console.log(url)
                window.location.href = url;
            }
        },
        created () {
            
        }
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/complain.css"></style>