<template><!--html内容-->
    <h3>内联事件处理器</h3>
    <button @click="count++">add</button>
    <p>{{ count }}</p>

    <h3>方法事件处理器</h3>
    <button @click="addCount">add</button>
    <p>{{ count2 }}</p>
</template>

<!--js code-->
<script>
	export default {
		data (){
			return {
				count:0,
                count2:0
			}
		},
        methods:{
            addCount(){
                this.count2 +=1
            }
        }
	}
</script>