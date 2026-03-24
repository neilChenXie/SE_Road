<template><!--html内容-->
    <h3>条件渲染</h3>
    <div v-if="flag">can see?</div>
    <div v-else>false to see</div>
    <button></button>
</template>

<!--js code-->
<script>

export default {
    data() {
        return {
            flag:true
        }
    }
}
</script>