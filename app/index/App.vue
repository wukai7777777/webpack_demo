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
        created(){

            alert(1231231)
        }
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
    color: red;
    font-size: 16px; 
    line-height: 28px;
    border:1px solid #000;
    margin-top: 10px;
    text-shadow: 0 0 0 10px pink;
}

</style>