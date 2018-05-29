<template>
<div class="">
  <div class="content">
    <div class="container-fluid">

      <!-- Vertical Layout -->
      <div v-if="yearsMD[year].layout == 'vertical-2-1'" class="row">
        <div v-if="yearsMD[year].layout == 'vertical-2-1'" class="col-6" style="padding: 0px 40px">
          <div class="text-con-v" >
              <h1 class="page-title" style="margin-top:120px"> {{ yearsMD[year].title }}</h1>
                <div class="body text-col" v-html="yearsMD[year].__content"></div>
          </div>
        </div>
        <div v-if="yearsMD[year].layout == 'vertical-2-1'" class="col-6 px-0">
          <img v-for="(image,value,key) in yearsMD[year].images" class="img-full obj-fit-cover h-50" :src="image.thumbnail"  />
        </div>
      </div>

      <!-- Vertical Layout -->
      <div v-if="yearsMD[year].layout == 'vertical-1-2'" class="row" style="padding-left:40px">
        <div v-if="yearsMD[year].layout == 'vertical-1-2'" class="col-4" style="padding: 0px 40px">
          <div class="text-con-v" >
              <h1 class="page-title" style="margin-top:120px"> {{ yearsMD[year].title }}</h1>
                <div class="body text-col" v-html="yearsMD[year].__content"></div>
          </div>
        </div>
        <div v-if="yearsMD[year].layout == 'vertical-1-2'" class="col-8 px-0">
          <img v-for="(image,value,key) in yearsMD[year].images" class="img-full obj-fit-cover obj-pos-t" :src="image.thumbnail"  />
        </div>
      </div>

      <!-- Horizontal Layout -->
      <div v-if="yearsMD[year].layout == 'horizontal'" class="" >
        <div class="row row-t-half">
          <div v-if="yearsMD[year].imagecompare" style="height:100%;overflow:hidden;width:100%;left:0;right:0;position:absolute" >
    
            <div class="juxtapose" style="width:100%!important" id="historycompare" data-animate="true" data-makeresponsive="false" data-startingposition="99%">
              <img :src="yearsMD[year].imagecompare.image1" />
              <img :src="yearsMD[year].imagecompare.image2" />
            </div>
        
          </div>
          <div v-for="(image,value,key) in yearsMD[year].images" :class="image.imagesize" >
            <img  class="img-full obj-fit-cover" :src="image.thumbnail"  />
          </div>
        </div>
        <div class="container2 horizontal-layout">
          <h1 class="page-title" style=""> {{ yearsMD[year].title }}</h1>
           <div class="body text-col-3" v-html="yearsMD[year].__content"></div>
        </div>
      </div>

      <!-- Full Image Text Overlay Layout -->
      <div v-if="yearsMD[year].layout == 'full-text-overlay'" class="" >
     
        	<div class="hero-image-con">
            <img class="obj-fit-cover obj-pos-lc" id="heroimage" :src="yearsMD[year].images[0].thumbnail"/>
            <div class="heading justify-center" style="padding-top:200px"><h1 v-html="yearsMD[year].__content"></h1></div>
          </div>

      </div>

      <!-- Landmark Map --> 
      <landmarkMap v-if="yearsMD[year].layout == 'landmark-map'" :yearsMD="yearsMD" :year="year" :selected="''"/>
      

    </div>
  </div>
</div>
</template>

<script>


let project

import landmarkMap from '~/components/landmark-map.vue'

export default {
  components:{
    landmarkMap
  },
  props: ['yearsMD'],
  validate({ params }) {
    //console.log(params,'paramsssees',this.props)
    return (params.year)
  },
  asyncData( context) {
     //console.log(context.params.year,'paramsideee')
    //const project = env.projects.find((project) => String(project.name) === params.name)
   // console.log(project,'projects')
  
    //const project =  require('~/content/history/'+ params.name + '.md');
    
  //console.log('projectt',project)
    return{
      project,
      year:context.params.year,
      selected: '',
      
    }
  },
  methods:{

    get (nestedObj, pathArr) {
    return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
    },
    getKeyByValue(object, value) {
      var value=value
      var result
      var scope =this
      object.forEach(function(keye,index) {
        var newObject=keye
      //  console.log(scope.get(keye,['year']),'balue')
      //console.log(Object.keys(newObject),'balue',value,keye)
      result =  Object.keys(keye).find(key => keye[key] === value);
     
    // key: the name of the object key
    // index: the ordinal position of the key within the object 
    });
    //console.log(this.get(['year'], object),'balue')
    return result
		},
  },
  transition: {

		mode:'out-in',
		css:true,
		leave: function(el){
		console.log('yearleav')
	


		},
		beforeEnter:function(){
      console.log('yearbefore')


		},
		enter:function(el){
      console.log('yearenter')
      


		},

	}  ,
  head() {
    return {
      title: this.name
      
    }
  },
  mounted() {
   
    juxtapose.sliders=[]
    juxtapose.scanPage();
    setTimeout(() => {
      //console.log('weereee',juxtapose.sliders,this)
     juxtapose.sliders.length != 0 ? juxtapose.sliders[0].updateSlider("50%", true):null
    }, 400);


  
  }
}
</script>
<style src="leaflet/dist/leaflet.css" lang="css"></style>
<style scoped>
@import '~/assets/css/globals.css';
.section{

}
.text-con-v{
  padding: 0px 80px;height:100%;overflow:auto;padding-bottom:80px
}
.body p{
  margin-right:80px
}
.horizontal-layout{
  overflow-x:auto
}
.px-0{
  padding-left:0px;
  padding-right:0px
}

.container2, .container-fluid {
  padding:0px 80px;
	max-height:100%;
	position:relative;

	width:100%;
  height:auto;
	display: flex;
	flex-wrap: wrap;

}
.container-fluid{
  padding:0px 0px;
}
.hero-image-con{
  width:100%;
  height:100%;
  top:0;
  left:0;
}
.row-t-half{
  margin-right:0px;
  margin-left:0px
}
.white p{
	color:rgb(70, 70, 70);
	
}
.white .section{
	background-color:white;
}
.white h2{
	color:rgb(129, 129, 129);
}
.white h2:after{
	background-color:rgb(194, 194, 194);
}
.heading h1{
  font-family: Crimson-Roman;
  color: white;
  left: 48px;
  left: 3rem;
  font-size: 72px;
  font-size: 4.5rem;
  bottom: 0;
  font-weight: normal;
  line-height: 1.1;
  margin: 0em 0em;
  text-shadow: 2px 2px 12px rgba(0, 0, 0, .7);
}


.white p{
	color:rgb(70, 70, 70);
	
}
.white .section{
	background-color:white;
}
.white h2{
	color:rgb(129, 129, 129);
}
.white h2:after{
	background-color:rgb(194, 194, 194);
}
#map .leaflet-control-attribution,.leaflet-container .leaflet-control-attribution{
  display:none!important;
}

/* Transistions*/

.page-enter-active, .page-leave-active {
transition-duration:.5s;


}
.page-enter-active{
  transition-duration:1.2s;
}
/* Enter Start */
.page-enter  {
opacity:1

}
 .page-enter .particles{
   z-index:0
}

.page-enter .heading  {
 transform:translateX(-300px);
  opacity:0
}
.page-enter .body  {
  transform:translateX(-50px);
  opacity:0
}
.page-enter .content  {
  opacity:0;
  transition:all .5s cubic-bezier(.65,.05,.51,.99);
}
.page-enter .page-title {
  transform:translateY(50px);
  opacity:0
}
.page-enter .hero-image-con img{
	transform:scale(1)
}

/* Enter To */
.page-enter-to .hero-image-con img{
	transform:scale(1.1)
}
.page-enter-to .heading  {
  transform:translateX(0px) .6s cubic-bezier(.65,.05,.51,.99);
  opacity:1;

}
.page-enter-to .content  {
opacity:1;
transition:all .5s cubic-bezier(.65,.05,.51,.99);
}

.page-enter-to .page-title {
  transition:opacity .6s cubic-bezier(0.175, 0.885, 0.32, 1.1), transform .6s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  transition-delay:.4s;
  transform:translateY(0px);
  opacity:1;
}
.page-enter-to .body {
   transition:all .6s cubic-bezier(0.175, 0.885, 0.32, 1.1);
transition-delay:.6s;
  transform:translateY(0px);
  opacity:1;
}

/* Leave*/

.page-leave-to  {
  opacity:1;

 }
 .page-leave {

  
}
.page-leave-to .content  {
  opacity:0;
  transition:all .5s cubic-bezier(.65,.05,.51,.99);
}

.heading{
   transition:all .6s var(--ease-out-quad);
}
.content{
   transition:all .5s cubic-bezier(.65,.05,.51,.99);
}
.body{
  transition:all .5s cubic-bezier(.65,.05,.51,.99);
}
.page-title{
  transition:all .5s cubic-bezier(.65,.05,.51,.99);
}
.page-leave-to .body  {
  opacity:0;


}
.page-leave-to .page-title {



  opacity:0;
}
.hero-image-con img{
	transition:all .8s var(--ease-in-out-quad);
		transform:scale(1.1)
}
</style>