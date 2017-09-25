<template>
    <!-- page start -->
    <noidencode :is-show="true"></noidencode>
    <!-- page end -->

</template>

<script>
    /**
     *  引入工具类库 或 Native API
     *  example : import widget from 'gapi/widget'
     */

    /**
     *  引入组件 以及 组件接口(Action)
     *  example : import Somecomponents from 'components/Somecomponents/Somecomponents'
     */
    import noidencode from 'components/com-noidencode/com-noidencode'
    import * as comNoidencode_mt from 'components/com-noidencode/com-noidencode-mutation-types'
    /**
     *  组件实例对象
     */
    export default {
        components: {
            noidencode
        },
        data: function(){
            return{
                
            }
        },
        methods: {
            
        },
        created(){
            let self = this;
            self.$store.commit(comNoidencode_mt.SET_IS_SHOW_ENTRY, false);
            self.$store.commit(comNoidencode_mt.SET_IS_SHOW_CLOSE, false);
        }
        
    }

    
</script>

<!-- CSS 样式 -->
<style src="static/style/account.css"></style>
<style>
    body {
        background-color: rgba(255, 255, 255, 0);
    }
</style>



