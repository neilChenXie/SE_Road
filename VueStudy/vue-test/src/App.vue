<template>
  <!-- <h3>h3Title</h3>
  <p>{{ msg }}</p>
  <p>{{ number++ }}</p>
  <p>{{ ok ? 'yes' : 'no' }}</p>
  <p>{{ message.split("").reverse().join("") }}</p> -->
  <!-- <p>{{ var a=10 }}</p> -->
  <!-- <p>{{ if(ok){return message} }}</p> -->
  <!-- <p v-html="rawHtml"></p>
  <p>{{ rawHtml }}</p> -->

  <!-- <HelloWorld />
  <ifDemo />
  <ListView />
  <KeyDemo /> -->
<!-- <EventDemo1 /> -->
<!-- <EventDemo3 /> -->
<!-- <ArrayList /> -->
<!-- <ComputeDemo /> -->
<!-- <ClassDemo /> -->
<!-- <StyleDemo /> -->
  <PropFunParentDemo />
</template>

<script setup>
import PropFunParentDemo from './ParameterTest/PropFunParentDemo.vue';
// import ClassDemo from './components/ClassDemo.vue';
// import StyleDemo from './components/StyleDemo.vue';

// import HelloWorld from './components/HelloWorld.vue'
// import ifDemo  from './components/ifDemo.vue'
// import KeyDemo from './components/KeyDemo.vue'
// import ListView from './components/listview.vue'

// import EventDemo1 from './components/EventDemo1.vue';
// import ArrayList from './components/ArrayList.vue';

// import EventDemo3 from './components/EventDemo3.vue';
// import ComputeDemo from './components/ComputeDemo.vue';
</script> 

<script>
export default {
  data(){
    return{
      msg:"神奇的语法",
      number:10,
      ok:true,
      message:"大家好",
      rawHtml:"<a href='https://baidu.com'>百度链接</a>"
    }
  } 
}

</script> 