<template>
    <ul class="ul">
        <li v-for="n in 10" >{{msg}}</li>
    </ul>
</template>
<script>
    export default {
        data() {
            return {
                msg: 'hello word'
            }
        },
    }
</script>

<style>
html {
    background: yellow;
}

html ul{
    padding:0;
    margin: 0;
}

ul li{
    color: cyan;
    font-size: 16px; 
    line-height: 28px;
    border:1px solid red;
    margin-top: 10px;
}

</style>