<template>
<div class="" style="height:100%;width:100%">
    <div id="my-holder" @click="disabled ? {} :shrink()">
      <img class="img-fluid obj-fit-cover obj-pos-c" id="holder-img">
    </div>
  <div class="animals-con">
    
  <div class="animal-type-heading">{{category}}</div>
    <div class="row" id ="impetus">
      <div class="animal-tile-con">
        <div  v-for="(animal,value,key) in activeAnimals" v-if="value < Math.round(activeAnimals.length)/2" class="animal-tile" :class="{ 'animate': value<4 }" @click="disabled ? {} : greet(animal, $event)">
          <img :src="animal.image" :class="'img-fluid obj-fit-cover obj-pos-c '+animal.imgalign">
          <div class="animal-name" :id ="value">
          <span class="animal-name-back">{{animal.title}}</span>
          <span class="animal-name-text"> {{animal.title}}</span>
          </div>
        </div>
      </div>
       <div class="animal-tile-con">
        <div  v-for="(animal,value,key) in activeAnimals" v-if="value > Math.round(activeAnimals.length/2) -1" class="animal-tile" :class="{ 'animate': value<activeAnimals.length/2+5 }" @click="disabled ? {} : greet(animal, $event)">
          <img :src="animal.image" :class="'img-fluid obj-fit-cover obj-pos-c '+animal.imgalign">
          <div class="animal-name" :id ="value">
          <span class="animal-name-back">{{animal.title}}</span>
          <span class="animal-name-text"> {{animal.title}}</span>
          </div>
        </div>
      </div>
      
    </div>
    
 
  </div>
  
 	<transition name="namePage" mode="out-in" >
    <div class="" :key="$route.params.name" >
      <nuxt-child />
    </div>
  </transition>  
 
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

let animal
let category
let router
const path = require('path')
export default {
  
  validate({ params }) {
    return (params.category)
  },
    props: ['msgChild'],

    watch: {
      'msgChild': function(arMsg) {
         //console.log(arMsg[0],this);
         this.shrink()
      }
   },
  asyncData(context) {   console.log('router',context.app.router)
    var animalPath='/'+context.params.category.toLowerCase()+'/'
    var matcher = new RegExp(/(${animalPath})\/.*md$/);
    //const newPath= path.resolve(__dirname, animalPath)
    var animalsCategory = require.context('~/content/animals/', true, /\.*md$/);
    var activeAnimals=[]
   // console.log(animalsCategory.keys(),'leeeys',animalPath)
    Object.keys(animalsCategory.keys()).forEach(function(key,index,item) {
      if(animalsCategory.keys()[index].toString().includes(animalPath)){
        //console.log('fffff')
        activeAnimals.push(animalsCategory(animalsCategory.keys()[index]))
        activeAnimals[activeAnimals.length-1]._path=animalsCategory.keys()[key].replace('.', '').replace(animalPath, '').replace('.md', '').replace('./', '')
      }
       
      //console.log(key,animalsCategory.keys()[index],'thekeyyee',animalsCategory.keys()[index].includes('/salmon/'))
    // key: the name of the object key
    // index: the ordinal position of the key within the object 
    });
    /*
    var activeAnimals = animalsCategory.keys().map((key,item,index) => ({
      
      //key.toString().includes('salmon') ? animalsCategory(key): void 0
      
  }));*/
    //activeAnimals=animalsCategory.keys().forEach(animalsCategory);
   //console.log(activeAnimals,'leeeys')
   /*
    const animal = context.env.animals.find((animal) => String(animal.category) === context.params.category)
    if (!animal) {
      return error({ message: 'User not foundrr', statusCode: 404 })
    }
*/

    return{
      
     
      router:context.$router,
      catImages:{Fish:'/images/fish-back.jpg',
      Salmon:'/images/salmon-back.jpg',
      Invertebrates:'/images/crab-back.jpg',
      Salmon:'/images/fish-back.jpg',

      },
      category:context.params.category,
      /*
      activeAnimals:  env.animals.filter(function(animal, category) {
         if (animal.category == params.category){
          return animal
         }
        }),clientWidth*/
      activeAnimals:activeAnimals,
      animals: context.env.animals,
      domEls:{},
      someObject:{'width':2, 'height':3,'top':1, 'left':0, 'img':1},
    }
  },
  head() {
    return {
      title: this.name
      
    }
  },

  transition:{
    mode:'out-in',
		css:true,
    beforeEnter(el){
   //console.log('beforeanimalenter')
   var nameBackground=document.querySelectorAll(".animal-name-back")
    //console.log('beforeenter',nameBackground)
     nameBackground[0] != undefined  ? Velocity(nameBackground, { backgroundColor: this.someObject['categoryColor'],color: this.someObject['startHue']}, { duration:0,easing:"easeInOutSine"  }): null
    //console.log('beforeentercategot',nameBackground)

    },
    enter(el){
         

    },
     beforeLeave(el){
      //console.log('beforeleave',el)  
       var title=document.getElementsByClassName("animal-type-heading")[0]

    
    },
     leave(el){
        //console.log('leavecat',el)
    
    },
  },
  mounted() {
  
        var impetus= document.getElementById("impetus");
        var boundX
        impetus.clientWidth>1920 ?  boundX= impetus.clientWidth-1920:  boundX= impetus.clientWidth*.01
    this.impetus=new Impetus({
        onUp:function() {
        },
        route: this,
        source: impetus,
        boundX: [-boundX, 0], // width of content - width of mask => 1310 - 400
        initialValues: [0, 0],
        update: function(x, y) {
            //event.preventDefault();
        //console.log(x,impetus,'nav')
           impetus.style.transform= 'translateX('+x+'px)'
        }
    });
    var impetus= document.getElementById("impetus");
    //Velocity(newTiles,  "trans.slideUpIn", {duration:800,stagger:75 ,delay:800,easing: 'easeOutBack' ,complete: function(elements) { } })

     var nameBackground=document.querySelectorAll(".animal-name-back")
      Velocity(nameBackground, { backgroundColor: this.someObject['categoryColor'],color: this.someObject['startHue']}, { duration:0,easing:"easeInOutSine"  })
     // console.log(this,'thisss')
      this.$set(this.domEls, 'title',document.getElementsByClassName("animal-type-heading")[0])
      this.$set(this.domEls, 'overlay',document.getElementsByClassName("overlay-w")[0])
      var animalTiles=document.querySelectorAll(".animal-tile")
      var newTiles=[],outofView=[]
      newTiles=document.querySelectorAll(".animal-tile.animate")
      var nameBackground=document.querySelectorAll(".animal-name-back")
      this.domEls.overlay.style.background=this.someObject['overlayColor']
      //console.log(nameBackground,this.domEls.overlay,'background')
      var textHue=this.someObject['categoryColor']
      //title.style.opacity=0
      //title.style.transform='translateY(10px)'

      setTimeout(() => {
        this.domEls.title.classList.add('animate')
      }, 10);
      

      // Stagger Animate Animal IMages
      var isMoved = false;
      isMoved = !isMoved;

      for ( var i=0; i < newTiles.length; i++ ) {
        // get function in closure, so i can iterate
        var toggleItemMove = getToggleItemMove( i );
        // reverse stagger order
        var delay = isMoved ? ( 0 + i + 1 ) : i;
        delay *= 75;
        // stagger transition with setTimeout
        setTimeout( toggleItemMove, delay );
      }
      

      function getToggleItemMove( i ) {
        var item = newTiles[i];
        return function() {
          item.classList.toggle('is-moved');
        }
      }

  },
  events:{
    'shrink': function(){
     // console.log('shrink')
    }

  },
  methods: {
    shadeColor: function(color,percent){
      var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
      return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    },
  getClass:function(i){
      
  },
  getURL: function(image){
    //var url = require('~/assets/img/animals/${image}')
    //require(`@/assets/img/animals/${animal.image}.jpg`)
    //return url
  },
  	yo: function (event){
  		//console.log('yo')
    },
    animalClass: function (event,item){
      
    },
    getRouter: function(){
      //console.log(this,'this')
      return this.$router
    },
    shrink: function (event,item){
      //console.log(this.router,'router')
     
      this.getRouter().push({ path: '/animals/'+category})
      var myStore= this.someObject
      //console.log( this.someObject,'object')
      var scrollCon= document.getElementsByClassName("animals-con")[0]
      scrollCon.classList.remove('overflow-hide')
      var selectedAnimalDiv=myStore.selectedAnimal
      var routeThis=this
       function shrinkFinished(){
        document.getElementById("my-holder").style.opacity=0;
         document.getElementById("my-holder").style.pointerEvents = "none";
         var holderImg=document.getElementById("holder-img")
         holderImg.classList.remove(myStore.class)
         holderImg.classList.remove(myStore.addclass);
         myStore.thediv.style.opacity=1;console.log(myStore,'object')
         routeThis.impetus.resume()

      }
      Velocity(document.getElementsByClassName("overlay-w")[0],{
          opacity:0
        }, {
          duration: 400, 
          easing: [.65,.05,.51,.99],
          delay:400
        });
      /*
      Velocity(document.getElementById("my-holder"),{

        translateX: -this.someObject.left ,

      }, {
        duration: 600, 
        easing: [.65,.05,.51,.99],
 
      });*/
       var viewportOffset = this.someObject.thediv.getBoundingClientRect()
 
     // var width = event.target.clientWidth
      //var height = event.target.clientHeight
      var top = viewportOffset.top
      //var navTop=viewportOffset.top-document.getElementsByClassName("top-nav")[0].clientHeight+20
      var left = viewportOffset.left
      Velocity(document.getElementById("my-holder"),{
        
        width: this.someObject.width,
        height: this.someObject.height,
        left: left +  document.getElementsByClassName("animals-con")[0].scrollLeft,
        top: top,
        translateY: 0,
        translateX: 0

      }, {
        duration: 400, 
        delay:400,
        easing: "easeInOutQuad",
         complete:shrinkFinished
      });
       Velocity(selectedAnimalDiv.querySelector('.animal-name'),{
        opacity:1,

      }, {
        duration: 600, 
        delay:600,
        easing: [.65,.05,.51,.99],
        
        
      });

    },
  	 greet: function (animal, event) {
      this.impetus.pause()
      category=this.category
      //console.log(animal.id, 'item',this.$router)
      var viewportOffset = event.target.getBoundingClientRect()
 
      var width = event.target.clientWidth
      var height = event.target.clientHeight
      var top = viewportOffset.top
      var navTop=viewportOffset.top-document.getElementsByClassName("top-nav")[0].clientHeight+20
      var left = viewportOffset.left
      var scrollCon= document.getElementsByClassName("animals-con")[0]
      scrollCon.classList.add('overflow-hide')
      //console.log(this,'wdithe',scrollCon,scrollCon.scrollLeft,document.documentElement.scrollLeft,event.target.clientWidth,event.target.getElementsByTagName('img')[0])
  
      //this.imgHold = Object.assign({}, this.imgHold, { widtha: width, heighta: height })
      event.target.style.width = width
      event.target.style.height = height
      //event.target.style.top = top
      event.target.style.left = left
       
      //event.target.style.opacity=0
      // event.target.style.position = 'absolute'
      // var replacementCol = event.target.getAttribute('data-colHide')
      // document.getElementById(replacementCol).classList.remove('hide')
      event.target.style.height = height + 'px'
      event.target.parentElement.parentElement.parentElement.id = 'activeProj'
      var holder = document.getElementById('my-holder')
      var holderImg = document.getElementById('holder-img')
      holderImg.classList.add(animal.imgalign)
      holder.style.transition = ''
      //console.log('greet', holder, width,height, left, top)
      holder.style.top = top + 'px'
      holder.style.left = left +  scrollCon.scrollLeft + 'px'
      holder.style.width = width + 0 + 'px'
      holder.style.height = height + 0 + 'px'
      holder.style.pointerEvents = "initial"
      this.$set(this.someObject, 'class',animal.imgalign)
      this.$set(this.someObject, 'width',width)
      this.$set(this.someObject, 'height',height)
      this.$set(this.someObject, 'top',top)
      this.$set(this.someObject, 'left',left)
      this.$set(this.someObject, 'thediv',event.target)
      this.$set(this.someObject, 'animal',animal)
      this.$set(this.someObject, 'addclass',event.target.getElementsByTagName('img')[0].getAttribute('data-imagealign') || 's')
      //document.getElementById('holder-img').src = ''
      holderImg.src = event.target.getElementsByTagName('img')[0].src
      //console.log(event.target.getElementsByTagName('img')[0].src,'align')
      holderImg.classList.add(event.target.getElementsByTagName('img')[0].getAttribute('data-imagealign'));

      //document.getElementById('holder-img').style.backgroundImage="url('"+ event.target.getElementsByTagName('img')[0].src+"')";
      // event.target.parentElement.parentElement.style.padding = '0px'
      // event.target.parentElement.parentElement.style.position = 'fixed'
      // event.target.parentElement.parentElement.style.top = top + -10 + 'px'
      // event.target.parentElement.parentElement.style.width = width + 0 + 'px'
      // event.target.parentElement.parentElement.style.left = left - 10 + 'px'
      var winwidth = window.innerWidth;
        var winheight = document.body.clientHeight;
         var scale;

				//holder.style.opacity = '1'
         var scaleWidth = winwidth/width
        var scaleHeight = winheight/height
        var scale = Math.max(winwidth/width, winheight/height);
        var xScale = width * scale;
        var diff = (winwidth/1.1) - xScale;
         //console.log('scale',winwidth,width,scale)
         //$('#outer').css({'-webkit-transform': 'scale(' + scale + ')'});
      var router=this.$router;
      var selectedAnimalDiv=event.target
      this.$set(this.someObject, 'selectedAnimal',selectedAnimalDiv)
      var routeThis=this
      setTimeout(function () {
        // event.target.style.height = '100%'
        //event.target.style.opacity = '0'
         router.push({ path: '/animals/'+category+'/'+animal._path.toString()})
        document.getElementById('holder-img').style.transition = 'opacity .6s , transform .4s .2s '
        
        
        //holder.style.transition = ' transform .6s, height .6s, width .6s'
        //document.getElementById('holder-img').style.opacity = '0'
        //holder.style.transitionTimingFunction = 'cubic-bezier(0.645, 0.045, 0.355, 1.000)'
        //holder.style.left = '50%'
       // holder.style.top = '50%'
       //holder.style.width = '100%'
        //holder.style.height = '100%'
        //holder.style.transform = 'translate(' + (-left  ) + 'px, ' + -top + 'px)  rotate(.0001deg)'
        var newleft=left +'px'
        var newtop=-top + 'px'
        //console.log(newleft, newtop,'top')
        var div = holder;

         Velocity(selectedAnimalDiv.querySelector('.animal-name'),{
          opacity:0,
        
        }, {
          duration: 400, 
          easing: [.65,.05,.51,.99],
          complete: function(elements) { document.getElementById("my-holder").style.opacity=1;
         // document.getElementById(animal.id).style.translateY='20px';
           event.target.classList.remove('animate')
          event.target.style.opacity = '0'
          //document.getElementById("nav-current").innerText= "Animals"
          }
        });
        Velocity(document.getElementsByClassName("overlay-w")[0],{
          opacity:1
        }, {
          duration: 400, 
          delay:400,
          easing: [.65,.05,.51,.99]
        });
        var holderHeight=winheight-document.getElementsByClassName("top-nav")[0].clientHeight+20+'px'
       function enableTouch(){
            routeThis.$set(routeThis, 'disabled',false)
             //this.$set(this, 'disabled',true)
           console.log('reanble',routeThis)
         }
        //console.log(holderHeight,'heighter',document.getElementsByClassName("top-nav")[0].clientHeight)
  	  Velocity(document.getElementById("my-holder"),{
  	    
    	    width: '55%',
    	    height: holderHeight,
       
    	    translateX: -left,
    	    translateY: -navTop
    	  }, {
    	    duration: 400, 
          delay:400,
          easing: [.65,.05,.51,.99],
          complete: enableTouch
    	  });
      /*
      Velocity(document.getElementById("my-holder"),{

        translateX: -left -400,

      }, {
        duration: 600, 
        easing: [.65,.05,.51,.99],
        delay:200
      });*/

        //holder.style.transform = 'translate(' + (-left  ) + 'px, ' + -top + 'px) scale(' + 1 + ','+1+') rotate(.0001deg)'
        //document.getElementById('holder-img').style.left = '25%';
       //document.getElementById('holder-img').style.transform = 'translate(' + (-diff/2.75) + 'px, ' + 0 + 'px)'
        //document.getElementById('holder-img').style.transform = 'scale(' + 1.1+')'

        }, 0)
      if (event) {
        //console.log(top, left)
      }
    }
  }
}
</script>

<style scoped >
@import '~/assets/css/globals.css';
#my-holder{
  transform-origin: top left;background-size:cover;background-position: center;left:0%;top:0%;
  width:500px;height:400px;background:transparent;position:absolute;z-index:5;opacity:0;overflow:hidden;
  pointer-events:none;
}
.namePage-enter-active, .namePage-leave-active {
  transition-duration: .75s;
  transition-timing-function: cubic-bezier(.65,.05,.51,.99)

}
 .namePage-leave-to .animals-con {
  opacity: 0;
  transform:translateY(-75px);
    transition: opacity .6s cubic-bezier(.65,.05,.51,.99) , transform .6s cubic-bezier(.65,.05,.51,.99);
 
}

.namePage-enter{
  opacity:1;
}

.namePage-leave-to  {
opacity:1
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
  
  height:780px;
  margin-top:140px;
  z-index:2;
  padding-right:120px;
  position:relative;
  max-height:100vh;
  flex-direction:row;

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
 
  z-index:3;
  height:100%;
  position:relative;
  max-height:100vh;
    overflow:hidden;
  -webkit-overflow-scrolling: touch;


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
  font-size:8rem;
  color:white;
  text-transform:uppercase;
  z-index:1;
  line-height:1;
  position:fixed;
  margin:0 auto;
  margin-top:20px;
  mix-blend-mode:overlay;
  text-align:center;
  display:inline;
  
}
.animal-tile-con{
  display:flex;
  flex-direction:row;
  flex:1;
  flex-grow:1;
  height:50%;
  padding:60px 0px 0px 0px;
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
	top:calc(100% - 70px);
  pointer-events:none;
  font-family:Sofia;
  font-weight:400;
  color:white;
  font-size:1.75rem;
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
  width:440px;
  height:100%;
  position: relative;
  margin:0px 40px;
  display:flex;
  flex-direction: column;

}

.animal-tile:nth-child(odd){

}
.close{
  position:absolute;
  top:100px;
  right:20px;
  width:40px;
  height:40px;
  color:white;
  z-index:3;
    opacity:0;
  pointer-events:none;
  transition:opacity .4s ease-out;
  text-shadow:2px 2px  black;

  
}
.close i{
font-size:2rem;
}
.close.show{
  opacity:.75;
  pointer-events:all;
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
.animal-type-heading{
 

   
}
.animal-type-heading.animate{
   transition: transform 0.4s ease-in-out, opacity .4s ease-in-out;
  opacity:1;
  transform:translate(0px);
  
}
.animals-con.animate{
  transition:transform .4s cubic-bezier(0.215, 0.61, 0.355, 1), opacity .4s cubic-bezier(0.215, 0.61, 0.355, 1);
  transform:translateY(-30px);
  opacity:0;

}

.overflow-hide{
  overflow:hidden;
}
/* Transistions*/

.page-enter-active, .page-leave-active {
  transition-duration: .25s;
  transition-timing-function: linear;

}
/* Enter Start */
.page-enter  {
	opacity:1
}
.page-enter .particles{
	z-index:0
}
.page-enter .animal-type-heading{
  opacity:0;
  transform:translateY(20px)
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
.page-leave-to .animal-type-heading{
  opacity:0;
  transform:translateY(-30px);
  transition: opacity .25s linear , transform .25s linear;
}
 .page-leave-to .animal-tile-con {
  opacity: 0;
  transform:translateY(-40px);
    transition: opacity .25s linear , transform .25s linear;
 
}

.page-leave-to  {
opacity:1
 }


</style>