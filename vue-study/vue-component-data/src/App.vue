<template>
  <h3>Root</h3>
  <Parent />
</template>

<script>
  import { provide } from 'vue';
import Parent from './components/Parent.vue'
  export default {
    provide: {
      rootMsg1: "fixed data from root",
    },
    // provide() {
    //   return {
    //     rootMsgWay2: this.rootMsg
    //   }
    // },
    data() {
      return {
        rootMsg: 'Hello from Root'
      }
    },
    components: {
      Parent
    }
  }
</script>

<style scoped></style>
