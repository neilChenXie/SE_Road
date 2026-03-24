<template><!--html内容-->
    <h3>Key属性添加到v-for中</h3>
    <p v-for="(item,index) in names" :key="index">{{ item }}</p>
    <p v-for="(value,key,index) in result" :key="value.id">{{ value.title }}</p>
</template>

<!--js code-->
<script>
	export default {
        data() {
			return {
				names:["AA","BB","CC"], 
                result: [
                    {
                        "id":11,
                        "title":"AA",
                        "url":"https://baidu.com"

                    },
                    {
                        "id":22,
                        "title":"BB",
                        "url":"https://google.com"
                    },
                    {
                        "id":33,
                        "title":"CC",
                        "url":"https://quark.com"
                    }
                ]
			}
		}
	}
</script>