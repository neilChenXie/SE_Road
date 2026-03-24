<template>
    <h3>插槽二</h3>
    <slot :backData="data"></slot>
</template>
<script>
    export default {
        name: 'SlotTwo',
        data() {
            return {
                data:'data of child',
            };
        },
    }
</script>   