<template>
    <h3>componentB</h3>
</template>
<script>
    export default {
        name: 'ComponentB',
        beforeCreate() {
        console.log('ComB beforeCreate');
        },
        created() { 
        console.log('ComB created');
        }, 
        beforeMount() {
        console.log('ComB beforeMount');
        },
        mounted() {
        console.log('ComB mounted');
        },
        beforeUpdate() {
        console.log('ComB beforeUpdate');
        },
        updated() {
        console.log('ComB updated');
        },
        beforeUnmount() { 
        console.log('ComB beforeUnmount');
        },
        unmounted() {
        console.log('ComB unmounted');
        },
        data() {
        return {
            msg:'Hello ComB!'
        } 
        },
    }
</script>   
