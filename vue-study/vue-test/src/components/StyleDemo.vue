<template><!--html内容-->
    <p :style="{color:activeColor,fontSize:fontSize+'px'}">Styl绑定</p>
    <p :style="styleObject">Styl绑定</p>
</template>

<!--js code-->
<script>
	export default {
		data (){
			return {
				activeColor:'green',
                fontSize:30,
				styleObject: {
					color:'red',
					fontSize:'30px'
				}
			}
		},
        methods:{

        },
        computed:{
            
        }
	}
</script>