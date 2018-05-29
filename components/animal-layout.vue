<template>
<div>
<h2>{{animal.name}}</h2>
<div class="col-10"> <img :src="'/images/animals/'+ animal.image + '.jpg'" class="img-fluid obj-fit-cover obj-pos-c"></div>
</div>
</template>

<script>
export default {

    props: ['src','animal']
  
}
</script>


<style scoped>
.obj-fit-cover{
  object-fit:cover ;height:100%;position:absolute;width:100%;top:0;left:0;
}
.obj-pos-t{
  object-position:50% 0%;
}
.obj-pos-c{
  object-position:50% 50%;
}
.obj-pos-b{
  object-position:50% 100%;
}
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  font-family: sans-serif;
  box-sizing: border-box;
}
.col-10{
	display:block;

}
.col-10{
	width:41.666%;
	height:50%;
}
.col-7{
	width:3.42%;
}
.full-h{
	height:100%;
}

</style>