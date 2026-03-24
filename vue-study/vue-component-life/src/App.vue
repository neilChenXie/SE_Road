<script setup>

</script>
<template>
  <h3>{{ msg }}</h3>
  <KeepAlive>
    <component :is="showComponent"></component>
  </KeepAlive>
  <button @click="handleClick">切换组件</button>
</template>
<script>
  import ComponentA from './compnents/ComponentA.vue'
  import { defineAsyncComponent } from 'vue';
  // 异步组件
  const ComponentB = defineAsyncComponent(() =>
    import('./compnents/ComponentB.vue')
  );
  export default {
    data() {
      return {
        msg:'Dynamic Component Example',
        showComponent:"ComponentA"
      } 
    },
    methods: {
      handleClick() {
        this.showComponent = this.showComponent === "ComponentA" ? "ComponentB" : "ComponentA";
      },
    },
    components: {
      ComponentA,
      ComponentB
    }
  };
</script> 

<style scoped></style>
