<template>
<div>
  <div class="container home" >
    <div class="mark-brand"></div>
  <div class="progress">
            <div class="progress-bar" role="progressbar" id="progress"></div>
        </div>

    <div class="video" >
       <div class="vignette"></div>
       <div class="bottom-vignette"></div>
      <video id="homevid" autoplay loop><source :src="buildEnv == 'netlify' ? 'https://drive.google.com/uc?export=null&id=1tRnGd9OpHrWCA4feOSBFcJaJBUkMwPVU' : '/video/Background_Video.mp4'" type="video/mp4" ></video>
    </div>
    
    <div class="overlay"></div>
    <div class="heading home-heading" v-html="settings.__content"></div>
    <div class="nav-con"> 
 
   
          
      <div class="nav">
        
        <ul>
          <li @click="disabled ? '' : routeLink(page.link,value)" :id="value" v-for="(page,value) in pages" :to="page.link || value.toLowerCase()" :event="disabled ? '' : 'click'" v-bind:class="{ selected: selected == page.title}">
           <a >
            <img :src="page.homeThumbnail" class="img-fluid obj-fit-cover obj-pos-c">
            <div class="animal-name" >
              
              <span class="animal-name-text"> {{page.title}}</span>
            </div>
           </a>
          </li>

          
        
        </ul>
      </div>
    </div>
  </div>
</div>

</template>

<script>
let homeSlidePos=0
let environment
let buildEnv
//const ImagePreloader = require('image-preloader')
if (process.browser) {


  
}
  import animallayout from '../components/animal-layout.vue'



  export default {
    components: {
      animallayout,
      
    },
    head() {
      return{
        script:[
          {src:this.netlifyIDJS},
          { src: 'js/netlifyCheck.js', body: true },
        ]
      }
    },
    methods:{
      routeLink(link,activeLink){
        console.log('route',link,)
        document.getElementById(activeLink).classList.add('selected')
        this.$router.push({ path: link})
      }
    },
    mounted(){
       document.getElementById('homevid').play()
      var DEBUG = true;
      this.environment == 'production' ? DEBUG = false : null
      this.buildEnv == 'electron' ? DEBUG = false : null
      if(!DEBUG){
        if(!window.console) window.console = {};
        var methods = ['log', 'debug', 'warn', 'info'];
        for(var i=0;i<methods.length;i++){
          console[methods[i]] = function(){};
        };
      };
/*
      const context2 = require.context('~/static/images', true, /\.jpg$/);
     // console.log(context2.keys(),'imagess')
      var imageArray=context2.keys()
      for (var i =0; i < imageArray.length-1; i++){
        imageArray[i]=imageArray[i].replace('./', '/images/')
      }
    const posts = context2.keys().map(key => ({
     
      _path: `/static/images/${key.replace('./', '')}`
    }));
*/
    //var keyArrays= Array.from( posts.keys() )
   // console.log(imageArray,'imagess')


   setTimeout(() => {
      /*
     console.log(this.$store.state.loaded,'stat')
     if(this.$store.state.loaded==false){
       var app=this
      function callLoaded(){
        app.$store.state.loaded=true
        console.log(app.$store.state.loaded,'stat')
      }
      var preloader = new ImagePreloader(),
    
          images = imageArray,
          total = images.length,
          loaded = 0;

      preloader.onProgress = function() {
        //console.log(loaded,'loaded')
          progress.textContent = progress.style.width = parseInt(100 / total * ++loaded) + '%';
      };

      preloader.fallbackImage = 'https://browshot.com/static/images/not-found.png';
     
      preloader.preload(images)
        
          .then(function(result) {
              //loadingBlock.classList.add('hidden');
              document.getElementById('homevid').play()
            //  console.log('done')
           callLoaded()
             
              result.forEach(function(image) {
                  if (image.status) {
                      //container.appendChild(image.value);
                      //image.value.classList.add('img-rounded', 'loaded');
                  } else {
                      image.value.remove();
                  }
              })
          });
     }*/
   }, 10);

   

        var nav= document.getElementsByClassName("nav")[0];
        var boundX= nav.clientWidth-1920
        var route = this;
    this.impetus=new Impetus({
        route: this,
        
        source: nav,
        boundX: [-boundX, 0], // width of content - width of mask => 1310 - 400
        initialValues: [this.$store.homeSlidePos, 0],
        update: function(x, y) {
            //event.preventDefault();
          //console.log(x,nav,'nav')
          homeSlidePos=x
            nav.style.transform= 'translate('+x+'px, 0)'
            //console.log(this)
        }
    });


    },
    asyncData (context) {
      //console.log(context.env,'env')
      var netlifyIDJS
    context.env.buildEnv == 'netlify' ? netlifyIDJS='https://identity.netlify.com/v1/netlify-identity-widget.js' : netlifyIDJS=''
    var pages=[]
    var education = require('~/content/education.md');
    education.link='/education'
    pages.push(education)
    var history = require('~/content/history.md');
    history.link='/history'
    pages.push(history)
    var research = require('~/content/research.md');
    research.link='/research'
    pages.push(research)
    var wildlife = require('~/content/wildlife.md');
    wildlife.link='/animals'
    pages.push(wildlife)
    var facility = require('~/content/facility.md');
    facility.link='/facility'
    pages.push(facility)
    var whalepuzzle = require('~/content/whalepuzzle.md');
    whalepuzzle.link='/kruzofpuzzle'
    pages.push(whalepuzzle)
    pages.sort(function(a,b){
      return a.order - b.order
    })
    //console.log(pages,'PAGES')

    /*
    var pages={}
    var education = require('~/content/education.md');
    pages['Education']=education
    var history = require('~/content/history.md');
    pages['History']=history
    var research = require('~/content/research.md');
    pages['Research']=research
    var wildlife = require('~/content/wildlife.md');
    pages['Wildlife']=wildlife
    var facility = require('~/content/facility.md');
    pages['Facility']=facility
    var whalepuzzle = require('~/content/whalepuzzle.md');
    pages['Whale Puzzle']=whalepuzzle
    console.log(pages,'PAGES')*/
    return { 
        selected:'',
        disabled: true,
        environment:context.env.environment,
        buildEnv:context.env.buildEnv,
        current: context.route.name,
        homeSlidePos:0,
        netlifyIDJS:netlifyIDJS,
        settings: require('~/content/settings.md'),
        pages: pages,
        someObject:{'width':2, 'height':3,'top':1, 'left':0, 'img':1},
      
      }
    },
    transition: {
      mode:'out-in',
      css:true,
      beforeLeave: function(el){
        console.log('indexbeforeleav')
      },
      leave: function(el){
        console.log('indexleave',this.$route,this.impetus,this,homeSlidePos)
        var video = document.getElementsByClassName("video")[0];
        var nav= document.getElementsByClassName("nav")[0];
        var heading= document.getElementsByClassName("heading")[0];
         var videoEl = document.getElementById("homevid");
         var container= document.getElementsByClassName("container")[0];
        //videoEl.currentTime=20;
        //this.$store.commit('increment')
        this.$store.homeSlidePos=homeSlidePos
        if (videoEl && this.$route.name != 'index'){
        this.$store.state.counter=videoEl.currentTime
        }
         // Velocity(container, {  opacity: 0}, { duration: 800 ,easing: [.65,.05,.51,.99]})
         // Velocity(nav, { translateX: '500px'}, { duration: 800 ,easing: [.65,.05,.51,.99]})
         // Velocity(heading, { translateX: '-500px'}, { duration: 800,easing: [.65,.05,.51,.99] })
          //Velocity(video, { scale: '1.5'}, { duration: 800,easing: [.65,.05,.51,.99], complete: function(elements) { done() } })
        
        console.log(this.$store,this.$store.state.counter,'store',homeSlidePos)
        
      },
      beforeEnter:function(){
        var videoEl = document.getElementById("homevid");
        var container= document.getElementsByClassName("container")[0];
        var nav= document.getElementsByClassName("nav")[0];
        videoEl.currentTime=this.$store.state.counter
        nav.style.transform="translateX("+this.$store.homeSlidePos+")"
        console.log(this.$store.homeSlidePos,'pos')

        
      },
      enter:function(el){
        console.log('indexenter')
        var video = document.getElementsByClassName("video");
        var nav= document.getElementsByClassName("nav")[0];
        var heading= document.getElementsByClassName("heading")[0];
        nav.style.transform="translateX("+this.$store.homeSlidePos+")"
     
      }
    }
  
}
</script>

<style scoped >

@import '~/assets/css/globals.css';
*{
  --transTime:.6s

}

.progress{
  z-index:2;
  color:white
}
h1{
	font-family:Crimson-Roman;
	color:white;
	left:3rem;
	font-size:4.2vw;
	bottom:0;
  font-weight:normal;
	line-height:1;
  margin: 0em 0em;
   font-size:4rem;
   text-shadow:2px 2px 10px rgba(0,0,0,.5)
}
h3{
	color:white;
	font-family:"museo" serif;
	font-weight:500;
	font-style:italic;
	font-size:1.75rem;
	margin:.3em 0em;
}
.heading{
  padding-bottom:120px;
  margin-left:70px;
  transform:translateZ(0);
  max-width:600px;
  line-height:1
}
.vignette{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 -150px 300px rgba(0,0,0,0.9) inset;
  z-index:7
}
.overlay{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.0;
  background-color: black;
}
.nav-con{
  position:absolute;
  transform:translateZ(0);
  /*background-color:#9ac661ae;*/
  width:28vw;
  min-width:100%;
  height:360px;
  perspective: 700px;
  bottom:10px;
   overflow-x:auto;
  overflow-y:hidden;
  display:flex;
  

}
.nav-background{
     content:'';
  height:100%;
min-width:100%;
  position:absolute;
  
  top:0;
  left:0;
  z-index:0;
  opacity:.9;
   background:linear-gradient(180deg,#81f7fd,#3568a7);
  mix-blend-mode: color;
  
  
}
.nav{ 
  height:calc(100vh - 0px);
  padding:20px 0px;
  z-index:2;
height:360px;

 padding:20px 40px;


display:flex;


}
.nav:before{
   content:'';
  height:100%;
  width: 100%;
  position:absolute;
  top:0;
  left:0;
  z-index:-1;

}
.nav-background-lum{
  content:'';
  height:100%;
  width: 100%;
  position:absolute;
  top:0;
  left:0;
  z-index:0;
  opacity:.25;
   opacity:.7;
  background:grey;
  mix-blend-mode: luminosity;

 /*background:linear-gradient(180deg,#6fe9fb,#355da7)*/
}
.nav ul{
  width:100%;
  display:flex;
  transform: translateZ(0);
  align-self: center;
  list-style-type: none;
  -webkit-margin-before:0;
  -webkit-padding-start:0; 

  
}
.nav a{
  text-decoration: none;
  line-height:1;
  position:relative;
      width: 380px;
    height: 260px;
    display:block;
}
.nav li, .nav a li{
  font-size:2.4rem;
  color:white;
  font-family:Sofia;
  margin:1.5rem 1.75rem;
  position:relative; 

  width:380px;

  
}
.nav a li{
  font-size:4rem;

}
.nav span{

}
.nav li:not(:last-child), .nav a:not(:last-child) li{

}
.nav img{

  position:absolute;
  
   
}
.italic{
  font-family: Crimson-Italic;
}

.video video {
  /*object-fit: contain;*/
  /*       object-fit: fill; */
  object-fit: cover;
  width:100%;
  height:80%;
  top:0;
  position:absolute;
      object-position: 50% 50%;

  
}
.bottom-vignette{
  width:100%;
  position:absolute;
  height:40%;
  background: linear-gradient(rgba(0,0,0,0)5%,rgba(0,0,0,1) 40%,rgba(0,0,0,1));
    bottom:0;
  z-index:7;
  bottom:0
}
.video{
  width:84%;
  height:70%;
    width:100%;
  height:100%;
  transform:translateZ(0);
  top:0;
  position:absolute;

 overflow:hidden;
 
  perspective: 1800px;
}
.back-button{
  display:block;
  position:fixed;
  top:2.5rem;
  left:150px;
  z-index:30;
  color:white;
  font-family: 'museo-sans';
  font-size:3rem;
  font-weight: 300;
  cursor: pointer

}
.back-button h1{
    font-family: 'museo-sans';
  font-size:3.75rem;
  font-weight: 300;
  display:inline-block;
  text-transform: initial;
  vertical-align: middle;
  }
.back-button i{
  font-size:4.25rem;
  vertical-align: middle;
  margin:0 2.5rem;

  }
.overlay-w{
  position:fixed;
  pointer-events:none;
  width:100vw;
  height:100vh;
  top:0;
  left:0;
  background:#f8f8f8;
  z-index:3;
  opacity:0;
 
}

.animal-tile img{
 pointer-events:none;
}
.row{
	display: flex;

	flex-wrap: wrap;
	width:100vw;
	height:100vh;
	max-height:100vh;

}
.margin-t50{
	margin-top:-50vh;
}
.margin-t16{
	margin-top:-16.666vh;
}
.container {
  justify-content: center;
	max-height:100%;
	overflow:hidden;
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

.col{

}
.col-10{
	overflow:hidden;
	width:41.666%;
	height:50%;
	position:relative;
	display:block;
	float:left;
}
.col-11{
	overflow:hidden;
	width:45.833%;
	height:50%;
	position:relative;
	display:block;
	float:left;
}
.col-6{
	overflow:hidden;
	width:25%;
	height:50%;
	position:relative;
	display:block;
	float:left;
}
.col-7{
	overflow:hidden;
	width:29.1666%;
	height:50%;
	position:relative;
	display:block;
	float:left;
}
.col-8{
	overflow:hidden;
	width:33.333%;
	height:50%;
	position:relative;
	display:block;
	float:left;
}
.full-h{
	height:100%;
}
.height-two-third{
	height:66.666%;
}
.height-one-third{
	height:33.333%;
}
.obj-fit-cover{
  object-fit:cover ;height:100%;position:absolute;width:100%;top:0;left:0;
}
.obj-fit-new{
	  object-fit:cover ;position:absolute;width:100%;top:0;left:0;
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
.obj-pos-l {
	object-position:0% 50%;
}
.obj-pos-r {
	object-position:85% 50%;
}
#my-holder{
  transform-origin: top left;background-size:cover;background-position: center;left:50%;top:50%;
  width:500px;height:400px;background:transparent;position:absolute;z-index:5;opacity:0;overflow:hidden;
}

.animal-name{
	box-sizing: border-box;
	position:absolute;
width:100%;
height:30px;
bottom:0px;
  pointer-events:none;
  font-family:Sofia;
  font-weight:400;
  color:white;
  font-size:2.1rem;
  left:-0px;
  z-index:6;
  display:block;
  box-decoration-break: clone;
  word-wrap: wrap break-word;
}
.animal-name span{
  display:block;
  vertical-align: top;
  box-decoration-break: clone;
  word-wrap: wrap break-word;
  white-space: normal;
  width:100%;
  
}
.animal-name-text{
  z-index:1;
  line-height:1.3;
  position:relative;
  position:absolute;
  
  left:0;
  bottom:0;
  width:100%;
  padding:20px 30px;
   background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.65));
}
.animal-name-back{
  padding:10px 20px;
  padding-bottom:10px;
  margin:0;
  line-height:1.2;
  color:#325bb4;

  z-index:0;
 

}

.animals-back-img{
  content:'';
  width:100%;
  height:100%;
  position:fixed;;
  opacity:.2;
  top:0;
  left:0;

  mix-blend-mode:luminosity;
  z-index:0
}
.animals-back-img img{
  opacity:1;
  transition: opacity .4s;
  position: absolute;
  
  transition-timing-function: ease-in-out;
}

/* Transistions*/

.page-enter-active, .page-leave-active {
  transition-duration:  var(--transTime);

}

/* Enter Start */
.page-enter .video {
  opacity:0
}
.page-enter .container {
  opacity:0
}
.page-enter .nav-con  {
  opacity: 0;
  transform:translateY(100px);
}
.page-enter .heading  {
  opacity: 0;
  transform:translateX(-300px);
}


/* Enter To */

.page-enter-to .nav-con  {
  opacity: 1;
  transform:translateY(0px);
   transition: opacity   var(--transTime) var(--ease-out-quad), transform   var(--transTime) var(--ease-out-quad);
}
.page-enter-to .video {
  opacity: 1;
  transition: opacity   var(--transTime) var(--ease-out-quad);
     
}
.page-enter-to .heading {
  opacity: 1;
  transform:translateX(0px);
  transition: opacity   var(--transTime) var(--ease-out-quad), transform   var(--transTime) var(--ease-out-quad);
     
}
.page-enter-to .container  {
  opacity:1
}

/* Leave*/

.page-leave-to .video {
  transform:scale(1.5);
  transition: transform   var(--transTime) cubic-bezier(.65,.05,.51,.99);
}
.page-leave-to  .container{
  opacity:0;
  transition: opacity   var(--transTime) cubic-bezier(.65,.05,.51,.99);
 }
 
.page-leave-to .heading {
  transform:translateX(-300px);
  transition: transform   var(--transTime) cubic-bezier(.65,.05,.51,.99);
}
.page-leave-to .heading {
  transform:translateX(-300px);
  transition: transform   var(--transTime) cubic-bezier(.65,.05,.51,.99);
}
.page-leave-to .nav li.selected {

  transition: transform   var(--transTime) cubic-bezier(.65,.05,.51,.99);
}
.page-leave-to .nav-con {
  transform:translateY(200px);
  transition: transform   var(--transTime) cubic-bezier(.65,.05,.51,.99);
}

</style>
