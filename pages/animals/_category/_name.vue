<template>
<div class="" style="height:100vh;width:100vw">
  <div v-if="animal.attribution" class="attribution"><p>{{animal.attribution}}</p></div>
  <div class="right" id="">
   
    <div id="impetusInfo">
       
      <div class="info-con">
      
        <h1>{{ animal.title }}</h1>
        <h3>{{ animal.scientific }}</h3>
        <div class="info-header">
          <div class="info-row">
            <div class="info-item" style="width:100%;height:100%;">
              <div class="info-distribution-map ">
                 
            
              </div>

            
            </div>
            <div class="info-item">
              <div class="info-icon info-lifespan"></div>
              <div class="info-label">Lifespan</div>
            
            </div>
            <div class="info-item">
              <div class="info-icon info-length"></div>
              <div class="info-label">Size</div>
          
            </div>
          </div>
          <div class="info-row">
            <div class="info-item-text">
              <div class="info-text">{{animal.distribution}}</div>
            </div>
            <div class="info-item-text">
          
              <div class="info-text">&#x2248; {{animal.lifespan}}</div>
            </div>
            <div class="info-item-text">

              <div class="info-text">{{animal.size}}</div>
            </div>
          </div>
          
        </div>
      </div>
      <div class="info-body" v-html="animal.__content">
        
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
let animal
export default {
  validate({ params }) {
   // console.log(params.name,'paramssss')
    return (params.name)
  },
  asyncData({ params, env, error }) {
  //console.log(params,'post','~/content/animals/'+params.category.toLowerCase()+'/' + params.name + '.md')
   const animal =  require('~/content/animals/'+params.category.toLowerCase()+'/' + params.name + '.md');
    //console.log('post',animal)
    //post.body=  post.body.replace(/\n/g, "<br />");'
    //console.log(post,'post')
    //return {post};

    return{
      animal,
  
      animals: env.animals,
    }
  },
  transition: {

		mode:'out-in',
		css:true,
		leave: function(el){
		//console.log('indexleave')
    console.log('nameleave')
    var videoEl = document.getElementById("homevid");
    Velocity(nav, { translateX: '500px', opacity: 0}, { duration: 800 ,easing: [.65,.05,.51,.99]})
    Velocity(heading, { translateX: '-500px', opacity: 0}, { duration: 800,easing: [.65,.05,.51,.99] })
    Velocity(video, { scale: '1.5', opacity: 0}, { duration: 800,easing: [.65,.05,.51,.99] })

		},
		beforeEnter:function(){
      //console.log('beforeevnt')
      var title= document.getElementsByClassName("animal-type-heading")[0];
     

      //Velocity(title, { translateY: '50px', opacity:0}, { duration:0  })
      //Velocity(mapNav, { translateX: '500px', opacity:0}, { duration:0  })

		},
		enter:function(el){
      //console.log('categoryenter')
      var title= document.getElementsByClassName("animal-type-heading")[0];
     

     // Velocity(title, { translateY: '0px', opacity:0}, { duration:800,easing:[100,0]    })
     // var title= document.getElementsByClassName("page-title")[0];
     // var text= document.getElementsByClassName("text-col-3")[0];
       //Velocity(buildingImg, {  opacity:1}, { duration:800,delay:1250,easing:[100,0]  })
      //Velocity(mapNav, { translateX: '0px', opacity:1}, { duration:1250,delay:1350,easing:[100,0]  })


		}
	}  ,
  head() {
    return {
      title: this.name
      
    }
  },
  mounted(animal) {
  
     
  
    
      var impetus= document.getElementById("impetusInfo");
        var boundY
        impetus.clientHeight>1080 ?  boundY= Math.abs(impetus.clientHeight-1480):  Math.abs(boundY= impetus.clientHeight+660)
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
#my-holder{
  transform-origin: top left;background-size:cover;background-position: center;left:0%;top:0%;
  width:500px;height:400px;background:transparent;position:absolute;z-index:5;opacity:0;overflow:hidden;
  pointer-events:none;
}
#impetusInfo{
 
}
.container {

	max-height:100vh;
	
	width:100%;
  height:100vh;
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


}

.animal-tile:nth-child(odd){

}
.particles{
  width:100vw;
  height:100vh;
  position:absolute;
  top:0;
  left:0;
  z-index:0;
  opacity: .4;
  mix-blend-mode: screen;
}
.animal-tile.animate{
  transition: transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1), opacity .8s cubic-bezier(0.215, 0.61, 0.355, 1);
  opacity:0;transform: translateY(50px);
  
}
.animal-tile.is-moved {
  transform: translateY(0px);
  opacity:1;
}

.info-distribution-map{
  position:relative;
height:95%;

 background: url('/images/map.svg') no-repeat  ;
 background-position: center;
 opacity:.5
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
    padding:150px 100px;
  padding-bottom:20px;
  position: relative;
  
 
}
.info-con:after{
  content:'';
  width:100%;
  height:100%;
  position:absolute;
  top:30%;
  left:10%;
  background: url('/images/map.svg') no-repeat  ;
  opacity:.05;
  background-size:130%;
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
  font-family: Sofia;
font-weight:300;
 
}
.right{

  position:absolute;
  height:100%;
  width:45%;
  overflow:hidden;
  right:0%;
  top:0;
  z-index:4;


  

}

.rights{
   position:absolute;
  height:100vh;
  width:55%;
  padding:40px 40px 40px 0px;
  right:0;
  top:0;
  display:flex;
  justify-content: center;

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
  font-weight:600;
  margin:.3rem 0;
  letter-spacing: 1px;
  
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
p {
font-size:20px;
font-family:Sofia;
  
}
.player {
  text-align: center;
  margin-top: 100px;
  font-family: sans-serif;
}
.namePage-enter-active, .namePage-leave-active {
  transition: opacity .7s;transition-timing-function: easeInQuad;
}
.namePage-enter, .namePage-leave-to {

}
.namePage-enter-active .info-con,.namePage-enter-active .info-body, .namePage-leave-active .info-con,.namePage-leave-active .info-body {
 transition:  transform .6s, opacity .5s;transition-delay:0s;transform:translateY(0%);opacity:1;
}
.namePage-enter .info-con, .namePage-enter .info-body {
  transform:translateY(3rem);opacity:0; transition-delay:0s;
}
.namePage-leave-to .info-con,.namePage-leave-to .info-body{
  transform:translateY(-3rem);opacity:0;  transition-delay:0s;
}
.namePage-enter-active .overlay-w, .namePage-leave-active .overlay-w {
  opacity:1; transition: opacity .6s;
}
.namePage-enter .overlay-w {
  opacity:0;
}
.namePage-enter .attribution{
  opacity:0;
}
.namePage-enter-to .attribution{
  opacity:1;
}
.namePage-leave-to .attribution{
  opacity:0
}
.namePage-leave-to .overlay-w{
  opacity:0;
}
.page-leave-to{
  opacity:0
}
.attribution{
  position:absolute;
  left:40px;
  bottom:40px;
  background:rgba(0,0,0,.25);
  border-radius:5px;
  z-index:7;
  transition:opacity .4s;

}
.attribution p{
  font-size:.75rem;
  color:white;
  padding:8px 12px;
  
  vertical-align:middle;
  margin-bottom:0;
}
</style>