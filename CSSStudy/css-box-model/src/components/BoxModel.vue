<template><!--html内容-->
    <div class="box1">Box1(默认Block)</div>
    <div class="box3">
        Box3:this is a saf asdfaa  asdfsa f sa safsdfs  fsadasfasfa fasfdsfsfsff fsafa fdafaf  sadfffsdfasfasfaf
        safasfsa
        asfas
        sfasfa  sfasdff  fsdfsfas s sdfa asfsdf asdfsdsf  dfsaf dfasdsfsf  asfasdfasdfsf  fs asf fssfasfsfsaffsf  fsfs
        sfasfa  sfasdff  fsdfsfas s sdfa asfsdf asdfsdsf  dfsaf dfasdsfsf  asfasdfasdfsf  fs asf fssfasfsfsaffsf  fsfs
        sfasfa  sfasdff  fsdfsfas s sdfa asfsdf asdfsdsf  dfsaf dfasdsfsf  asfasdfasdfsf  fs asf fssfasfsfsaffsf  fsfs
        sfasfa  sfasdff  fsdfsfas s sdfa asfsdf asdfsdsf  dfsaf dfasdsfsf  asfasdfasdfsf  fs asf fssfasfsfsaffsf  fsfs
        sfasfa  sfasdff  fsdfsfas s sdfa asfsdf asdfsdsf  dfsaf dfasdsfsf  asfasdfasdfsf  fs asf fssfasfsfsaffsf  fsfs
    </div>
    <div class="box2">Box2</div>

    <div class="box4">Box4</div>
</template>

<!--js code-->
<script>
	export default {
		data (){
			return {
				
			}
		},
	}
</script>
<!--css样式-->
<style scoped>
    .box1 {
        width: 200px;
        height: 100px;
        padding: 20px;
        border: 5px solid blue;
        margin: 15px;
        background-color: lightgray;
    }
    .box2 {
        width: 200px;
        height: 2px;
        padding: 20px;
        border: 5px solid red;
        margin: 18px;
        background-color: lightpink;
        float: right;
    }
    .box3 {
        display: inline-block;
        width: auto;
        height: auto;
        padding: 10px;
        border: 5px solid green;
        margin: 20px;
        background-color: lightgreen;
    }
    .box4 {
        display: inline;
        width: 200px;
        height: 100px;
        padding: 20px;
        border: 5px solid orange;
        margin: 22px;
        background-color: lightyellow;
    }
</style>