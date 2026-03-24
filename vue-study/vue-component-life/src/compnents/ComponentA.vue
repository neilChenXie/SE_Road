<template>
    <h3>componentA</h3>
    <p>{{ msg }}</p>
    <button @click="handleClick">切换内容</button>
</template>
<script>
    export default {
        name: 'ComponentA',
                name: 'ComponentB',
        beforeCreate() {
        console.log('ComA beforeCreate');
        },
        created() { 
        console.log('ComA created');
        }, 
        beforeMount() {
        console.log('ComA beforeMount');
        },
        mounted() {
        console.log('ComA mounted');
        },
        beforeUpdate() {
        console.log('ComA beforeUpdate');
        },
        updated() {
        console.log('ComA updated');
        },
        beforeUnmount() { 
        console.log('ComA beforeUnmount');
        },
        unmounted() {
        console.log('ComA unmounted');
        },
        data() {
            return {
                msg:'Hello ComA!'
            } 
        },
        methods: {
            handleClick() {
                this.msg = this.msg === 'Hello ComA!' ? 'Content Changed!' : 'Hello ComA!';
            },
        },
    }
</script>   