<template><!--html内容-->
    <h3>列表渲染</h3>
    <!--一般案例-->
    <p v-for="item in names">{{ item }}</p>
    <!--默认还有index，of代替in-->
    <p v-for="(value,index) of names">{{index}}-{{ value }}</p>
    <!--模拟ajax返回值-->
    <div v-for="item in result">
        <p><a :href="item.url">{{ item.title }}</a></p>
    </div>
    <!--for也可以轮询key-value对-->
    <div v-for="(value,key,index) of usrInfo">
        <p>{{ index }}-{{ key }}-{{ value }}</p>
    </div>
</template>

<!--js code-->
<script>
	export default {
		data (){
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
                ],
                usrInfo:{
                    name:"owen",
                    age:20,
                    sex:"男"
                }
			}
		}
	}
</script>