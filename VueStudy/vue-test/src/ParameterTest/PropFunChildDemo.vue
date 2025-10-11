<template><!--html内容-->
    <h3>Child组件</h3>
    <p>
        <button @click="childTransParam">传参</button>
    </p>
</template>


<!--js code-->
<script>
	export default {
		data (){
			return {
				msg:"what does child say"
			}
		},
        methods:{
            childTransParam(){
                this.fun(this.msg)
            }
        },
        computed:{
            
        },
        watch:{

        },
        props:{
            fun:Function
        }
	}
</script>