<template>
    <h3>Parent</h3>
    <Child />
</template>

<script>
    import Child from './Child.vue'
    export default {
        name: 'Parent',     
        components: {
            Child
        }
    }   
</script>

<style scoped></style>