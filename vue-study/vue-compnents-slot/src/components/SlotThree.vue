<template>
    <h3>插槽三</h3>
    <slot :data="headData" name="header"></slot>
    <slot :data="bodyData" name="body"></slot>
</template>
<script>
    export default {
        name: 'SlotThree',
        data() {
            return {
                headData:'head data of child',
                bodyData:'body data of child',
            };
        },
    }
</script>   