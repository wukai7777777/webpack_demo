<template>
    <div>
        <div v-for="n in 10" >{{msg}}</div>
    </div>
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
html{
    background: purple;
}
</style>