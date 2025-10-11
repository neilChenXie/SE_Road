<template><!--html内容-->
    <!-- 不容易维护 -->
    <p >{{ this.testContent.content.length > 0 ? 'Yes' : 'No' }}</p>
    <!-- 计算1次 -->
    <p>{{ hasValue }}</p>
    <p>{{ hasValue }}</p>
    <p>{{ hasValue }}</p>
    <!-- 计算3次 -->
    <p>{{ hasValueHandler() }}</p>
    <p>{{ hasValueHandler() }}</p>
    <p>{{ hasValueHandler() }}</p>
</template>

<!--js code-->
<script>
	export default {
		data (){
			return {
				testContent:{
                    name:"bill",
                    content:["AA","BB"]
                }
			}
		},
        computed:{
            hasValue(){
                return this.testContent.content.length > 0 ? 'Yes' : 'No'
            }
        },
        methods:{
            hasValueHandler(){
                return this.testContent.content.length > 0 ? 'Yes' : 'No'
            }
        }
	}
</script>