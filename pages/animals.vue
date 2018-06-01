<template>
  <div class="container animals-back" >
    <svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%"  id="svgBack">
      <linearGradient id="background" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop id="start" offset="0%" stop-color="#527fe1"/>
          <stop id="end" offset="100%" stop-color="#0f1e3d"/>
      </linearGradient>
      <rect id="rect" width="100%" height="100%" fill="url(#background)"/>
    </svg>
  
    <div class="top-nav">
      <ul>
        <li ><nuxt-link to="/"  exact><i class="material-icons">home</i></nuxt-link></li>
        <li ><a>Wildlife</a></li>
        <li ><nuxt-link to="/animals/Invertebrates" @click.native="animalClass($event,$router)" data-category="Invertebrates" data-hue="221" data-hex="#04297b">Invertebrates</nuxt-link></li>
        <li ><nuxt-link to="/animals/Mammals" @click.native="animalClass($event,$router)" data-category="Mammals"  data-hue="202" data-hex="#156a9b">Mammals</nuxt-link></li>
        <li ><nuxt-link to="/animals/Fish" @click.native="animalClass($event,$router)" data-category="Fish"  data-hue="178" data-hex="#28918d">Fish</nuxt-link></li>
        <li ><nuxt-link to="/animals/Salmon" @click.native="animalClass($event,$router)" data-category="Salmon"  data-hue="28" data-hex="#61350e">Salmon</nuxt-link></li>
        <li ><nuxt-link to="/animals/Birds" @click.native="animalClass($event,$router)" data-category="Birds"  data-hue="97" data-hex="#426f26">Birds</nuxt-link></li>
      </ul>
    </div>
  
	  	<a   ><div @click="backNav()" class="back-button nav-button"><i class="material-icons">keyboard_arrow_left</i></div></a>


    <div class="animals-holder"  >
      <nuxt-child v-bind="{ 'msgChild': msgChild }" :key="$route.params.category" :categoryColor="current"/>
    </div>
    
   <div class="overlay-w"></div>

    <div class="particles">
      <video id="homevid" autoplay loop><source src="/video/particles2.mp4" type="video/mp4" ></video>
    </div>

    <div class="animals-back-img">
      <img :src="catImages[category]" class="img-fluid obj-fit-cover obj-pos-c" >
      <img :src="catImages[category]" class="img-fluid obj-fit-cover obj-pos-c active" >
    </div>  

  </div>

</template>

<script>
if (process.browser) {
    Velocity.RegisterEffect("trans.slideUpIn", {
        defaultDuration: 800,
        easing: 'easeOutBack' ,
        calls: [[ { opacity: [1,0], translateY: [0,50] } ]]
    })
  var DEBUG = false;
  if(!DEBUG){
        if(!window.console) window.console = {};
        var methods = ['log', 'debug', 'warn', 'info'];
        for(var i=0;i<methods.length;i++){
          console[methods[i]] = function(){};
        };
    };
  }

let category

export default {
  pageTitle: 'Title for H1 tag',

render(h) {
    return (
      <div style={{ height: "100%" }} onMousemove={this.handleMouseMove}>
        {this.$props.render(this)}
      </div>
    );
  },
  asyncData (context) {
    console.log('context')

   return { 
      animals: context.env.animals,
      catImages:{
      Fish:'/images/wildlife/fish2-back.jpg',
      Salmon:'/images/wildlife/salmon-back.jpg',
      Invertebrates:'/images/wildlife/crab-back.jpg',
      Mammals:'/images/wildlife/mammal-back.jpg',
      Birds:'/images/wildlife/bird-back.jpg',

      },
      msgChild:null,
      current: context.route.name,
      category: context.params.category || 'Mammals',
      someObject:{'width':2, 'height':3,'top':1, 'left':0, 'img':1,'categoryColor':'d'},
      domEls:{}
    }
    
  },
  data(){
    return{

    
    catImages2:{
      Fish:'/images/fish2-back.jpg',
      Salmon:'/images/salmon-back.jpg',
      Invertebrates:'/images/crab-back.jpg',
      Mammals:'/images/mammal-back.jpg',

      }
    }
  },
  head() {

    var preloads=[]
    for (var key in this.catImages) {
      preloads.push({
      rel: 'preload prerender',
      as: 'image',
      href: this.catImages[key]
      })
    }
    return {
    
      link:preloads,
      style: [
      { cssText: '.hero-image-con img,.animal-tile img{background:'+this.shadeColor('#3356a0',.3)+'!important}', type: 'text/css' }
    ]
      
    }
  },
 
  methods: {
    shadeColor: function(color,percent){
      var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
      return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    },
    backNav: function(){
      this.$route.name == "animals-category-name" ? this.msgChild = ['doIt']: null;
      var routePath=this.$route.path
      var backUrl=routePath.split('/');
      backUrl.pop()
      routePath = backUrl.join('/')
      console.log(routePath,this.$route,'backpath')
      routePath == '' ? this.$router.push('/') : this.$router.push(routePath)
    },
 
    animalClass: function (event,path){
      function shadeColor2(color, percent) {   
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
      }
      var overlay=document.getElementsByClassName("overlay-w")[0]
      //overlay.style.opacity=0
      //lastLink.classList.remove('active')
      var start=document.getElementById("start")
      var stop=document.getElementById("end")
      var nav=document.getElementsByClassName("top-nav")[0]
      var back=document.getElementsByClassName("back-button")[0]
      var hue=event.target.getAttribute('data-hue')
      var hex=event.target.getAttribute('data-hex')
      var nameBackground=document.querySelectorAll(".animal-name-back")
      var animalBack=document.querySelector(".animals-back-img img:not(.active)")
      animalBack.src=this.catImages[event.target.getAttribute('data-category')]
      var animalBackActive=document.querySelector(".animals-back-img img.active")
      console.log(event.target,animalBack, animalBackActive, 'ANimallssss')
      animalBack.classList.add("active");
       animalBackActive.classList.remove('active');
      var navHue="hsl("+hue+",73%,22%)"
      var overlayHue=shadeColor2(hex,.2)
      var textHue=shadeColor2(hex,.4)
      var startHue=shadeColor2(hex,.4)
      var stopHue=shadeColor2(hex,-.5)
      console.log('hue', event.target,navHue,startHue,stopHue,nameBackground)
      nav.style.backgroundColor=navHue
      Velocity(start, { stopColor: startHue}, { duration:500,easing:"easeInOutSine"  })
      Velocity(end, { stopColor: stopHue}, { duration:500,easing:"easeInOutSine"  })
      Velocity(back, { backgroundColor: stopHue}, { duration:500,easing:"easeInOutSine"  })
     // Velocity(nameBackground, { backgroundColor: textHue,color: startHue}, { duration:0,easing:"easeInOutSine"  })
      this.$set(this.someObject, 'startHue',startHue)
    
     this.$set(this.someObject, 'categoryColor',textHue)
      this.$set(this.someObject, 'overlayColor',overlayHue)
      console.log('overayyyyyyyy')
      console.log(path,'thiss')
    
       document.getElementsByClassName("right")[0] ? Velocity(document.getElementsByClassName("right")[0],{opacity:0}, {duration: 400,easing: [.65,.05,.51,.99],complete:function(){overlay.style.background=overlayHue}}):overlay.style.background=overlayHue
        Velocity(document.getElementsByClassName("overlay-w")[0],{opacity:0}, {duration: 400,delay:100,easing: [.65,.05,.51,.99]});
         Velocity(document.getElementById("my-holder"),{opacity:0}, {duration: 400,easing: [.65,.05,.51,.99]});
      
    },
  },
  transition:{
    mode:'out-in',
		css:true,
    beforeEnter(el){
  
    var nameBackground=document.querySelectorAll(".animal-name-back")
    console.log('beforeenter',nameBackground)
     nameBackground[0] != undefined  ? Velocity(nameBackground, { backgroundColor: this.someObject['categoryColor'],color: this.someObject['startHue']}, { duration:0,easing:"easeInOutSine"  }): null
    },
    enter(el){
         

    },
     beforeLeave(el){
      console.log('beforeleaveanimal',el)  
       var title=document.getElementsByClassName("animal-type-heading")[0]
       //title.classList.remove('animate')
     //  title.style.opacity=1
      // Velocity(title, {  opacity:0,translateY:'-10px'}, { duration:400,easing:'easeInOutSine'  })
    
    },
     leave(el){
        console.log('leave',el)
       var title=document.getElementsByClassName("animal-type-heading")[0]
       var row=document.getElementsByClassName("row")[0]
       var animalsCon=document.getElementsByClassName("animals-con")[0]
       var animalTiles=document.querySelectorAll(".animal-tile")
       var animalBack=document.getElementsByClassName("animals-back-img")[0]
       //Velocity(animalBack, {  opacity:0}, { duration:400,easing:'easeInOutSine'  })
       /*
       var st
        row !== undefined ? st=window.getComputedStyle(row, null):null
        var tr=st.getPropertyValue("transform") || "fail...";
        var values = tr.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');
     
         var xT=Number(values[4])
             console.log(xT,'tr')
             */
        animalsCon != undefined ? animalsCon.classList.add('animate'): null
       //Velocity(animalTiles, { scale:1.1, opacity:0}, { duration:400,easing:'easeInOutSine'  })
       if (row != undefined){
       Velocity(row, { color: '0x'}, { duration:400,easing: 'easeOutBack', complete: function(elements) { }  })
       }else{
         setTimeout(() => {
     
         }, 400);
       }

    },
  }
 
}
</script>

<style scoped>
*{
   -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body,html {
	overflow:auto;
	margin:0px;
	width:100%;
	height:100vh;
  background:black;

}

h1{
	font-family:"museo-sans";
	color:white;
	left:3rem;
	font-size:5rem;
	bottom:0;
	text-transform: uppercase;
	line-height:1;
	margin: 0em 0em;
}
h3{
	color:white;
	font-family:"museo" serif;
	font-weight:500;
	font-style:italic;
	font-size:1.75rem;
	margin:.3em 0em;
}
#svgBack{
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
  z-index:2
}
#svgBack .background{
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
}
.container {

	max-height:100%;
	
	width:100%;
  height:100%;
	display: flex;
 	flex-direction: column; 
	flex-wrap: wrap;
  position:absolute;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  font-family: sans-serif;
  box-sizing: border-box;
}
.animals-back{
  /*
  background: linear-gradient(-45deg ,#0f1e3d,#527fe1);*/
  overflow: hidden;
 
}
.animals-holder{
  display:block;

  height:100%;
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

  flex-wrap: nowrap;
  overflow-x: auto;
}
.animals-back-img{
  content:'';
  width:100%;
  height:100%;
  position:absolute;;
  opacity:.25;
  top:0;
  left:0;

  mix-blend-mode:luminosity;
  z-index:2
}
.animals-back-img img{
  opacity:0;
  transition: opacity .4s;
  position: absolute;
  
  transition-timing-function: ease-in-out;
}
.animals-back-img .active{
  opacity:1
}
.animal-type-heading{
  font-family: Sofia;
  font-weight:900;
  font-size:9.5rem;
  color:white;
  text-transform:uppercase;
  z-index:1;
  line-height:1;
  position:fixed;
  margin:0 auto;
  margin-top:40px;
  mix-blend-mode:overlay;
  text-align:center;
  display:inline;
  
}
.overlay-w{
  position:absolute;
  pointer-events:none;
  width:100%;
  height:100%;
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


}

.animal-tile:nth-child(odd){

}
.particles{
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;

  opacity: .4;
  mix-blend-mode: screen;
}
.back-button{
  border-radius:50%;
  background-color:#3356a0;
  margin:20px;
  z-index:10;
}
.row{
  display: flex;
  flex-wrap:nowrap;

  margin-top:240px;
  z-index:2;
  padding-right:120px;
  position:relative;
  max-height:100vh;

}
/* Transistions*/

.page-enter-active, .page-leave-active {
  transition-duration: .7s;
}
/* Enter Start */
.page-enter  {
	opacity:0
}
.page-enter .particles{
	z-index:0
}

/* Enter To */

.page-enter-to  {
	opacity:1
}
.page-enter-to .particles{
  z-index:1;
  transition-delay:.7s
}



/* Leave*/

.page-leave-to  {
opacity:0
 }



#my-holder{
  transform-origin: top left;background-size:cover;background-position: center;left:0%;top:0%;
  width:500px;height:400px;background:transparent;position:absolute;z-index:5;opacity:0;overflow:hidden;
  pointer-events:none;
}
/*
.page-enter-active, .page-leave-active {
  transition: opacity .7s;transition-timing-function: easeInQuad;
}
.page-enter, .page-leave-to {
  transition: opacity .s;transition-delay:0s;transition-delay:.05s;
}
.page-enter-active .right, .page-leave-active .right {
 transition:  transform .6s, opacity .5s;transition-delay:0s;transform:translateY(0%);opacity:1; transition-delay:.1s;
}
.page-enter .right {
  transform:translateY(3rem);opacity:0; transition-delay:0s;
}
.page-leave-to .right{
  transform:translateY(-3rem);opacity:0;  transition-delay:0s;
}
.page-enter-active .overlay-w, .page-leave-active .overlay-w {
  opacity:1; transition: opacity .6s;
}
.page-enter .overlay-w {
  opacity:0;
}
.page-leave-to .overlay-w{
  opacity:0;
}*/
.cat-enter-active, .cat-leave-active {
  transition-duration:.3s;
}
.cat-enter-active .animals-con, .cat-leave-active .animals-con {
   transition: transform .3s;
}
.cat-enter .animals-con, .cat-leave-active .animals-con {
   transition: transform .3s, opacity 3s;
}
.cat-enter .animals-con,
.cat-leave-active .animals-con{
  opacity: 0;
  transform: translate(30px, 0);  
}
.cat-leave-active .animals-con,
.cat-enter .animals-con{
  opacity: 0;
  transform: translate(-30px, 0);   
}

</style>
