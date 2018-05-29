<template>
<div class="" style="height:100vh;width:100vw">
 
  <div class="right">
   <div id="impetusInfo">
    <div class="info-con">
      <h1>{{ project.title }}</h1>

    </div>
    <div class="info-body">
      <div v-html="project.__content"></div>
    </div>
    </div>
  </div>
</div>
</template>

<script>

 //import d3 from '~/plugins/d3.min.js'
  //import topojson from '~/plugins/topojson.min.js'
  //import Datamap from '~/plugins/datamaps.all.min.js'
  //'~/plugins/d3.min.js', '~/plugins/topojson.min.js','~/plugins/datamaps.all.min.js'
 // d3 = require('d3')
 //let d3
 //let topojson
// let Datamap
if (process.browser) {
 //d3 = require('~/plugins/d3.min.js')
  //topojson = require('~/plugins/topojson.min.js')
  //Datamap = require('~/plugins/datamaps.all.min.js')
  //Datamap = require('~/plugins/datamaps.all.min.js')

}
let project
export default {

  validate({ params }) {
    console.log(params,'paramssss',this.props)
    return (params.name)
  },
  asyncData( { params, env, error }) {
     console.log(params.name,'paramsideee')
    //const project = env.projects.find((project) => String(project.name) === params.name)
   // console.log(project,'projects')
  
    const project =  require('~/content/research/'+ params.name + '.md');
    
  console.log('projectt',project)
    return{
      project,
  
      projects: env.projects,
    }
  },
  transition: {
    name:'id',
		mode:'out-in',
		css:true,
		leave: function(el){
		console.log('indexleave')
	
    var videoEl = document.getElementById("homevid");
    Velocity(nav, { translateX: '500px', opacity: 0}, { duration: 800 ,easing: [.65,.05,.51,.99]})
    Velocity(heading, { translateX: '-500px', opacity: 0}, { duration: 800,easing: [.65,.05,.51,.99] })
    Velocity(video, { scale: '1.5', opacity: 0}, { duration: 800,easing: [.65,.05,.51,.99] })

		},
		beforeEnter:function(){
      console.log('beforeevnt')
      var title= document.getElementsByClassName("animal-type-heading")[0];
     

      Velocity(title, { translateY: '50px', opacity:0}, { duration:0  })
      //Velocity(mapNav, { translateX: '500px', opacity:0}, { duration:0  })

		},
		enter:function(el){
      console.log('categoryenter')
      var title= document.getElementsByClassName("animal-type-heading")[0];
     

      Velocity(title, { translateY: '0px', opacity:0}, { duration:800,easing:[100,0]    })
     // var title= document.getElementsByClassName("page-title")[0];
     // var text= document.getElementsByClassName("text-col-3")[0];
       //Velocity(buildingImg, {  opacity:1}, { duration:800,delay:1250,easing:[100,0]  })
      //Velocity(mapNav, { translateX: '0px', opacity:1}, { duration:1250,delay:1350,easing:[100,0]  })


		},
		leave: function(el){
		//	var page= document.getElementsByClassName("content")[0];
		//	Velocity(page, { opacity: 0}, { duration: 600,easing: [.65,.05,.51,.99], complete: function(elements) { done() } })
		},
	}  ,
  head() {
    return {
      title: this.name
      
    }
  },
  mounted(project) {

    var impetus= document.getElementById("impetusInfo");
    var boundY
    
    impetus.clientHeight>1080 ?  boundY= Math.abs(impetus.clientHeight-1480):  Math.abs(boundY= impetus.clientHeight+660)
    console.log(impetus.clientHeight,boundY,'boundsss')
    var impetus2=new Impetus({
    onUp:function() {
    },
    route: this,
    source: impetus,
    boundY: [-boundY, 0], // width of content - width of mask => 1310 - 400
    initialValues: [0, 0],
    update: function(x, y) {
        //event.preventDefault();
        //console.log(y,boundY,'nav')
          impetus.style.transform= 'translateY('+y+'px)'
        }
    });
    var impetus= document.getElementById("impetusInfo");
  
  }
}
</script>

<style scoped>
.info-distribution-map{
  position:relative;
height:100%;
}
#dmapus, #dmapworld{
  top:0;
  left:0;
  z-index:2;
  width:200px;
}
#dmapus{
  z-index:3;
  position:absolute
}
.animal-back{
  width:100vw;
  height:100vh;
  position:absolute;
  top:0;
  left:0;
  display:block;
  background-color: #13284b;


}
.animal-id-img{
  

  
  display:flex;
  align-self:center;
  position:relative;
}
.video-back{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  mix-blend-mode: soft-light;
  opacity:.35
}
.info-nav{
  margin:4rem 0rem;
  padding:0rem 7rem;
  font-family: Proxima Nova;
  font-size:1.3rem;
  color:#2e3131;
}
.info-nav i{
  font-size:2.75rem;
  color:#355da7;
  text-align: center;
  vertical-align: middle;
  line-height: 1rem
  }
.info-nav li{
  display:inline-block;
  margin:0 .5rem;
}
.info-con{
  padding: 100px 100px;
  padding-top: 140px;
  position: relative;
  min-height: 480px;
  display: flex;
  align-self: center;
  align-content: center;
  justify-content: center;
  flex-direction: column;
 
}
.info-con:after{
  content:'';
  width:100%;
  height:100%;
  position:absolute;
  top:5%;
  left:30%;
  background: url('/images/research/research.svg') no-repeat  ;
  opacity:.05;
  background-size:80%;
  transform: rotate(-15deg)
}
.info-body{
    padding:60px 100px;
    background-color:#fffcf6;
    color:black;
    min-height:50%;
    padding-bottom:640px;
  
   
}
.info-body p{
  color:#454545;
 
}

.info-row{
  display:flex;
  justify-content: space-between;
  width:100%;
  
}
.info-header{
  width:100%;
  display:block;
  margin:3rem 0;
  margin-bottom:2rem;
  display:flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.info-item,.info-item-text{
  display:flex;
  flex-direction:column;

  align-self:center;
  flex:1;

}
.info-item-text{
  align-self:start;
  font-weight:300;

}
.info-icon{
  width:60px;
  height:60px;
  margin:0 auto;
  
}
.info-lifespan{
  background: url('/images/lifespan.svg') no-repeat  ;
  opacity:.5;

}
.info-population{
  background: url('/images/population-icon.svg') no-repeat  ;
}
.info-length{
  background: url('/images/size.svg') no-repeat  ;
  width:120px;
  opacity:.5;

  background-position:center;
}

.info-label, .info-text{
  text-transform: uppercase;
  font-size:1rem;
  color:white;
  text-align: center;
  font-family:Proxima Nova;
  font-weight:700;
  margin:.3rem 0;
  
}
.info-label{
  margin-top:20px;
  color:rgba(255,255,255,.55);
  font-size:1.2rem;
}

.info-text{
  font-weight:300;
  font-size:1.3rem;
  text-transform: initial;
  

}
h1{
  font-family:Sofia;
  font-size:4rem;
  color:white;
  line-height: 1.2;
  left:0;
  text-transform: initial;
  text-align:left;

  font-weight:900;
  text-transform:uppercase
}

h2{
  color:#00b3ad;
  font-family:'museo-sans',sans-serif;
  font-size:3rem;
  font-style:italic;
  font-weight:300;
  margin:.75rem 0;
  padding:0 7rem;
}
h3{
  font-family:Sofia;
  font-size:2.4rem;
  margin-top:1rem;
  font-weight:300;
  font-style:italic;
  color:rgba(255,255,255,.55)
}
hr{
  opacity: .25;
  height: 25px;
  margin-top: 32px;
  margin-top: 2rem;
  margin-bottom: 32px;
  margin-bottom: 2rem;
  border-top: 0;
  background: url(/images/dotted-line.svg);
  background-size: 25px 25px;
  background-origin: content-box;
  background-position: center;
  background-repeat: repeat-x;
  border:none;
  opacity:1;
}
p{
font-size:20px;
  
}

.player {
  text-align: center;
  margin-top: 100px;
  font-family: sans-serif;
}
.page-enter-active, .page-leave-active {
  transition: opacity .7s;transition-timing-function: easeInQuad;
}
.page-enter, .page-leave-to {
  transition: opacity .s;transition-delay:0s;transition-delay:.05s;
}
.page-enter-active .info-con,.page-enter-active .info-body, .page-leave-active .info-con,.page-leave-active .info-body {
 transition:  transform .6s, opacity .5s;transition-delay:0s;transform:translateY(0%);opacity:1; transition-delay:.1s;
}
.page-enter .info-con, .page-enter .info-body {
  transform:translateY(3rem);opacity:0; transition-delay:0s;
}
.page-leave-to .info-con,.page-leave-to .info-body{
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
}
</style>