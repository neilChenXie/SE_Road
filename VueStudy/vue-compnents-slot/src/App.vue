
<script setup>
  import SlotTwo from './components/SlotTwo.vue';
  import SlotThree from './components/SlotThree.vue';
</script>
<template>
  <SlotTwo v-slot="SlotPropName">
    <h3>{{ msg }}-{{ SlotPropName.backData }}</h3>
  </SlotTwo>
  <SlotThree>
    <template #header="slotProps">
      <h3>{{ msg }}-{{ slotProps.data }}</h3>
    </template>
    <template #body="slotProps">
      <p>插槽正文-{{ slotProps.data }}</p>
    </template>
  </SlotThree>
</template>
<script>
  export default {
    data: function () {
      return {
        msg: 'Welcome to Your Vue.js App',
      };
    },
  };
</script>
<style scoped></style>
