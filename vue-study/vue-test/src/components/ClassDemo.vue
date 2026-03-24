<template><!--html内容-->
    <!-- id不能解析，Class可以解析 -->
    <p :id="{ 'active':isActive,'hasError':hasError }" :class="{ 'active':isActive,'hasError':hasError }">Class样式绑定</p>
    <!-- 对象 -->
    <p :class="classObject">Class样式绑定2</p>
    <!-- 数组 -->
    <p :class="[arrActive, arrHasError]">Class样式绑定3</p>
    <!-- 数组里嵌套对象（不能对象里嵌套数组），不推荐，不好理解 -->
    <p :class="[ isActive? 'active' : '',{'hasError':hasError}]">Class样式绑定4</p>
    <button @click="showObjectHandler">check</button>
    <button @click="activeTrueHandler">activeTrue</button>
    <button @click="hasErrorTrueHandler">hasErrorTrue</button>
</template>

<!--js code-->
<script>
	export default {
		data (){
			return {
				isActive:true,
                hasError:true,
                classObject:{
                    'active':this.isActive,
                    'hasError':this.hasError
                },
                arrActive:'active', 
                arrHasError:'hasError',
                'active':true
			}
		},
        methods:{
            showObjectHandler(){
                console.log(this.classObject)
            },
            activeTrueHandler(){
                this.isActive=true
            },
            hasErrorTrueHandler(){
                this.hasError=true
            }
        },
        computed:{

        }
	}
</script>
<style>
.active{
    font-size:30px
}
.hasError{
    color:red;
}
</style>