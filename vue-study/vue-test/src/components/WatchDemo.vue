<template><!--html内容-->

</template>

<!--js code-->
<script>
	export default {
		data (){
			return {
				msg
			}
		},
        methods:{

        },
        computed:{
            
        },
        watch:{
            msg(newValue,oldValue){
                console.log('new value:' + newValue + 'old value: ' + oldValue)
            }
        }
	}
</script>