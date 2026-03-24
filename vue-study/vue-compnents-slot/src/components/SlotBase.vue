<template>
    <h3>插槽基础</h3>
    <slot v-for="(value,index) in names" :key="index">{{ value }}</slot>
    <slot name="header">默认标题</slot>
    <a href="#">我是插在中间的子级内容</a>
    <slot name="body">默认正文</slot>
</template>
<script>
    export default {
        name: 'SlotBase',
        data() {
            return {
                names:['张三','李四','王五']
            };
        },
    }
</script>