<template>
    
    <settings></settings>
        
</template>

<script>
    /**
     *  引入工具类库 或 模块API
     */
    
    /**
     *  引入组件 以及 组件接口(Action)
     */
    import Settings from 'components/settings/settings'

    /**
     *  组件实例对象
     */
    export default {
        components: { Settings },
        methods: {
     
            
            /**
             * 在window上挂载供Native调用接口的方法
             * @method mountingWindow
             * @public
             * @return {Null} void
             */
            mountingWindow (){
                var self = this;

            }
        },


        
    }

    
</script>



