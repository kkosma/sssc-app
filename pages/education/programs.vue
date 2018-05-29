<template>
<div class="" style="height:100%;width:100%">
    		<galleryList :projects="projects" :title="'Education'" path="/education/programs" v-bind="{ 'msgChild': msgChild }"/>

 
</div>
</template>

<script>

if (process.browser) {


}
let animal
let category
import galleryList from '~/components/galleryList.vue'
export default {  
  components:{
    galleryList
  },
  props: ['msgChild'],
  asyncData(context) {

    //var animalPath='/'+context.params.category.toLowerCase()+'/'
   //var matcher = new RegExp(/(${animalPath})\/.*md$/);
    //const newPath= path.resolve(__dirname, animalPath)
    var animalsCategory = require.context('~/content/education/', true, /\.*md$/);
    var activeAnimals=[]
   // console.log(animalsCategory.keys(),'leeeys',animalPath)
    const context2 = require.context('~/content/education/', true, /\.md$/);

    const posts = context2.keys().map(key => ({
      ...context2(key),
      _path: `${key.replace('.md', '').replace('./', '')}`
    }));


    return{
      animal,
      catImages:{Fish:'/images/fish-back.jpg',
      Salmon:'/images/salmon-back.jpg',
      Invertebrates:'/images/crab-back.jpg',
      Salmon:'/images/fish-back.jpg',

			},
			 projects:posts,
      category:context.params.category,
  
      someObject:{'width':2, 'height':3,'top':1, 'left':0, 'img':1},
    }
  },
  head() {
    return {
      title: this.name
    }
  },
  mounted() {
        var onUp=function(){
          
        }
       
  },
  	transition: {
		mode:'out-in',
		css:true,
		
		beforeEnter:function(){
			console.log('projectsenterbefore')
		
			
		},
		enter:function(el){
			console.log('projectsenter')
		
		},
		leave:function(el){
console.log('projectleave')
    }
  }
	
    
    
  
}
</script>

<style scoped >

.page-enter-active, .page-leave-active {
  transition-duration: .7s

}
.page-enter{
  opacity:1;
}
 .page-leave-to .animals-con {
  opacity: 0;
  transform:translateY(-75px);
    transition: opacity .6s cubic-bezier(.65,.05,.51,.99) , transform .6s cubic-bezier(.65,.05,.51,.99);
 
}
.page-leave-to  {
opacity:1
 }
.row {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    margin-top: 240px;
    z-index: 2;
    padding-right: 120px;
    position: relative;
    max-height: 100vh;
}
.history-nav{
	position:fixed;
}
.animals-back{
  /*
  background: linear-gradient(-45deg ,#0f1e3d,#527fe1);*/
  overflow: hidden;
 
}
.animals-holder{
  display:block;

  height:100vh;
  width:100%;
}
.animals-con{
  display:block;

  height:100vh;
  width:100%;
  padding:80px 120px;
  z-index:1;
  position: relative;
  white-space: nowrap;
  display: flex;
  white-space: nowrap;
 
  z-index:2;
  height:100%;
  position:relative;
  max-height:100vh;
    overflow:hidden;
  -webkit-overflow-scrolling: touch;
  overflow-x:scroll;

  flex-wrap: nowrap;
  overflow-x: auto;
}
.animals-back-img{
  content:'';
  width:100%;
  height:100%;
  position:fixed;;
  opacity:.25;
  top:0;
  left:0;

  mix-blend-mode:luminosity;
  z-index:0
}
.animals-back-img img{

  transition: opacity .4s;
  position: absolute;
  
  transition-timing-function: ease-in-out;
}
.animals-back-img .active{
  opacity:1
}

.overlay-w{
  position:fixed;
  pointer-events:none;
  width:100vw;
  height:100vh;
  top:0;
  left:0;
  background:#3255a3;
  z-index:3;
  opacity:0;
 
}
.animal-name{
	box-sizing: border-box;
	position:absolute;
  width:400px;
	top:calc(100% - 100px);
  pointer-events:none;
  font-family:Sofia;
  font-weight:500;
  color:white;
  font-size:2.5rem;
  left:-30px;

  box-decoration-break: clone;
  word-wrap: wrap break-word;
}
.animal-name span{
  display:inline;
  vertical-align: top;
  box-decoration-break: clone;
  word-wrap: wrap break-word;
  white-space: normal;
  
}
.animal-name-text{
  z-index:1;
  line-height:1.3;
  position:relative;
  position:absolute;
  top:0;
  left:0;
  padding:0px 20px;
}
.animal-name-back{
  padding:0px 20px;
  padding-bottom:10px;
  margin:0;
  line-height:1.2;
  color:#5f88df;

  z-index:0;
  background-color:#5f88df;

}
.animal-tile img{
 pointer-events:none;
}
.animal-tile{
  width:500px;
  height:610px;
  position: relative;
  margin:40px;
  display:flex;
  background-color:rgba(255,255,255,.2)


}

.overflow-hide{
  overflow:hidden;
}

</style>