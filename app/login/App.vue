<template>
    <div>
        <ul class="list">
            <li  v-for="item in arrList">{{item}}</li>
        </ul>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                msg: 'hello word',
                arrList: [
                    'name',
                    'sex',
                    'age',
                    'wukai'
                ]
            }
        },
    }
</script>

<style>
html{
    background: #eee;
}
.list, li{
    margin:0;
    padding:0;
}
.list li{
    background: cyan;
    line-height: 24px;
    font-size:14px;
    color: #666;
}

</style>