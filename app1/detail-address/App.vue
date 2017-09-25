<template>
    <!-- page start -->
    <div class="mod-page">
        <!-- section start -->
        <section class="mod-content mod-flex bc-main address">
            <!-- banner start -->
            <div class="mod-banner" v-if="!!addressListData.head_image">
                <a href="javascript:;"><img :src="addressListData.head_image" :style="{height: imageHeight}" alt=""></a>
            </div>
            <!-- banner end -->
            <!-- address start -->
            <div class="mod-column mod-flex-item address-list">
                <div class="mod-column-head">
                    <h2 class="mod-column-title">城市列表</h2>
                </div>
                <div class="mod-column-body">
                    <ul class="mod-list">
                        <li class="mod-list-item com-border-bottom" v-for="(postAddr, index) in addressListData.post_addr_list">
                            <a href="javascript:;" class="mod-list-info">
                                <span class="product-location" v-if="!!addressListData.nearest_distance && addressListData.nearest_distance != -1 && index == 0">
                                    <i class="icon icon-needle-sm"></i>
                                    {{addressListData.nearest_distance}}
                                </span>
                                {{postAddr.city_name}}{{postAddr.district_name}}{{postAddr.street_name}}{{postAddr.address}}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- address end -->
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
    import KCcache from 'clientApi/KCcache'
    import Util from 'tool/widget/Util'
    
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
                addressListData: {},
                imageHeight: Math.round(document.documentElement.clientWidth * 170.66/320) + 'px'
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
                let self = this;
                let post_id = Util.getQueryString('post_id');
                KCcache.getMemoryCache(`detail_post_addrs_${post_id}`,(data)=>{
                    self.addressListData = data;
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
<style src="static/css/global.css"></style>
<style src="static/css/common.css"></style>
<style src="static/css/address.css"></style>