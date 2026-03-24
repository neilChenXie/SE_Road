<template><!--html内容-->
    <h3>事件传参</h3>
    <button @click="addCount">add</button>
    <p>{{ count }}</p>

    <p @click="getNameHandler(value,$event)" v-for="(value,index) of names" :key="index">{{ value }}</p>
</template>

<!--js code-->
<script>
	export default {
		data (){
			return {
				count:0,
                names:["owen","amy","frank"]
			}
		},
        methods:{
            //传递Event对象
            addCount(e){
                // console.log(e);
                e.target.innerHTML = "Add" + this.count;
                this.count +=1
            },
            getNameHandler(name,e){
                console.log(name);
                console.log(e);
            }
        }
	}
</script>