<template><!--html内容-->
 <!-- <div class="{{ msg }}">test</div> 不行-->
 <div v-bind:class="msg" v-bind:title="dynamicTitle">test</div>
 <div v-bind="objectAttrs">dynamicAttrcs</div>
</template>

<!--js code-->
<script>
export default {
    data() {
        return {
            msg:"active",
            dynamicTitle:null,
            objectAttrs: {
                id: "appId",
                class: "appclass"
            }
        }
    }
}
</script>