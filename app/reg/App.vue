<template>
    <div>
        <div v-for="n in 10" >{{msg}}</div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                msg: 'welcome to reg'
            }
        },
    }
</script>

<style>
html{
    background: cyan;
}
div{
    color: purple;
    font-size: 30px;
    background: yellow;
}
</style>