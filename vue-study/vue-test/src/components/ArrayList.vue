<template><!--html内容-->
    <button @click="addListHandler">add</button>
    <ul>
        <li v-for="(value,index) in names" :key="index">{{ value }}</li>
    </ul>
    <button @click="combineNumHandler">合并数组</button>
    <h3>数据1</h3>
    <p v-for="(item,index) of num1" :key="index">{{ item }}</p>
    <h3>数据2</h3>
    <p v-for="(item,index) of num2" :key="index">{{ item }}</p>
</template>

<!--js code-->
<script>
	export default {
		data (){
			return {
				names:["bill","Mick","amy"],
                num1:[1,2,3,4],
                num2:[5,6,7,8]
			}
		},
        methods:{
            addListHandler(){
                //引起UI自动更新
                this.names.push("sakura")
                //不引起UI自动更新
                this.name.concat(["sakura"])
                console.log(names)
                //如果要更新需要
                this.name = this.name.concat(["sakura"])
            },
            combineNumHandler(){
                this.num1 = this.num1.concat(this.num2)
                // this.num1.push(this.num2)
            }
        }
	}
</script>