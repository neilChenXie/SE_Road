<template>
    <h3>Child</h3>
    <p>{{ globalData }}</p>
    <p>Child get:{{ rootMsg1 }}</p>
    <p>Child get:{{ rootMsgWay2}}</p>
    <p>Child get:{{ childMsg }}</p>
</template>

<script>
    export default {
        name: 'Child',
        inject: ['globalData', 'rootMsg1', 'rootMsgWay2'],
        data () {
            return {
                childMsg: this.rootMsgWay2
            };
        },
    }
</script>

<style scoped></style>