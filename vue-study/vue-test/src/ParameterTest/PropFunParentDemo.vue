<template><!--html内容-->
    <h3>通过Function实现子传父</h3>
    <PropFunChildDemo :fun="fun"></PropFunChildDemo>
    <p>父组件：子组件传参-{{ msg }}</p>
</template>

<script setup>
import PropFunChildDemo from './PropFunChildDemo.vue';
</script>
<!--js code-->
<script>
	export default {
		data (){
			return {
				msg:""
			}
		},
        methods:{
            fun(val){
                console.log('子组件传递过来的值：' + val)
                this.msg = val
            }
        },
        computed:{
            
        },
        watch:{

        }
	}
</script>