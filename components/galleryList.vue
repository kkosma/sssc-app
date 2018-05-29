<template>
<div class="" style="height:100%;width:100%">
  
  <div class="animals-con">
  <div class="animal-type-heading">{{title}}</div>
    <div class="row" id="impetus">

      <div class="animal-tile-con">
        <div  v-for="(project,value,key) in projects" v-if="value < Math.round(projects.length/2)" class="animal-tile" :class="{ 'animate': value<4 }" @click="disabled ? {} : greet(project, $event)">
          <img :src="project.image" :class="'img-fluid obj-fit-cover obj-pos-c '+project.imgalign">
          <div class="animal-name" :id ="value">
          <span class="animal-name-back"><span class="animal-name-text"> {{project.title}}</span>{{project.title}}</span>
          
          </div>
        </div>
      </div>
       <div class="animal-tile-con">
        <div  v-for="(project,value,key) in projects" v-if="value > Math.round(projects.length/2)-1" class="animal-tile" :class="{ 'animate': value<projects.length/2+5 }" @click="disabled ? {} : greet(project, $event)">
          <img :src="project.image" :class="'img-fluid obj-fit-cover obj-pos-c '+project.imgalign">
          <div class="animal-name" :id ="value">
          <span class="animal-name-back"><span class="animal-name-text"> {{project.title}}</span>{{project.title}}</span>
          
          </div>
        </div>
      </div>
    </div>
      <div id="my-holder" @click="disabled ? {} : shrink()">
      <img class="img-fluid obj-fit-cover obj-pos-c" id="holder-img">
    </div>
    <div class="overlay-w"></div>
  </div>
  
	<transition name="page" mode="out-in" >
    <div class="" :key="$route.params.name" >
      <nuxt-child :projects="projects"/>
    </div>
  </transition>  

 
</div>
</template>

<script>

if (process.browser) {

	Velocity.RegisterEffect("trans.slideUpIn", {
		defaultDuration: 800,
		easing: 'easeOutBack' ,
		calls: [[ { opacity: [1,0], translateY: [0,50] } ]]
	})

}
let animal
let category
export default {
  props: ['projects','title','path','msgChild','hue'],

    watch: {
      'msgChild': function(arMsg) {
         //console.log(arMsg[0],this);
         this.shrink()
      }
   },
    
  data() {

   

    return{
      animal,
      catImages:{Fish:'/images/fish-back.jpg',
      Salmon:'/images/salmon-back.jpg',
      Invertebrates:'/images/crab-back.jpg',
      Salmon:'/images/fish-back.jpg',
      

			},
      //category:params.category,
      disabled:false,

      someObject:{'width':2, 'height':3,'top':1, 'left':0, 'img':1,'disabled':false},
    }
  },
   

  	transition: {
      appear:true,
      mode:'out-in',
		  css:false,
		
		beforeEnter:function(){
			console.log('beforeenterprojects')
       document.getElementsByClassName("animal-type-heading")[0].classList.add('animate')

    	//Velocity(title, { translateY: '10px', opacity:0}, { duration:0  })
     // Velocity(nav, { translateX: '500px'}, { duration:0  })
			//Velocity(container, { opacity: 0}, { duration: 0 })
			
		},
		enter:function(el){

     // Velocity(animalTiles,  "trans.slideUpIn", {duration:800,stagger: 75, drag: true ,easing: 'easeOutBack' ,complete: function(elements) { done() } })
    },
    beforeLeave: function(el){
      console.log('projectsbeforeleave')
    },
		leave: function(el){
      console.log('projectsleave')


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
    console.log(impetus,'imp')
  
    		console.log('projects enter')
      var title=document.getElementsByClassName("animal-type-heading")[0]
      var row=document.getElementsByClassName("row")[0]
      var container= document.getElementsByClassName("research-child")[0];
      var nav= document.getElementsByClassName("map-nav")[0];
			var animalTiles=document.querySelectorAll(".animal-tile")
      var newTiles=document.querySelectorAll(".animal-tile.animate")
 
      setTimeout(() => {
       title.classList.add('animate')
      }, 50);
  
      console.log(newTiles,'new')
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
    methods: {
  	withVelocity: function() {
  		var $div = $("#with-velocity");
  	  $div.velocity({
  	    borderRadius: "25px",
  	    width: winwidth,
  	    height: winheight,
  	    paddingLeft: "0",
  	    paddingRight: "0",
  	    backgroundColor: "#8CC152",
  	    color: "#fff",
  	    borderColor: "#8CC152",
  	    boxShadowX: "0",
  	    boxShadowY: "0"
  	  }, {
  	    duration: 350, 
  	    easing: "easeInQuad"
  	  });
  	},
  	yo: function (event){
  		console.log('yo')
    },
    shadeColor: function(color,percent){
      var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
      return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    },
    animalClass: function (event,item){
      function shadeColor2(color, percent) {   
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
      }

      var start=document.getElementById("start")
      var stop=document.getElementById("end")
      var nav=document.getElementsByClassName("top-nav")[0]
      var back=document.getElementsByClassName("back-button")[0]
      var hue=event.target.getAttribute('data-hue')
      var hex=event.target.getAttribute('data-hex')
      var nameBackground=document.querySelectorAll(".animal-name-back")
      var navHue="hsl("+hue+",73%,22%)"
      var textHue=shadeColor2(hex,.4)
      var startHue=shadeColor2(hex,.3)
      var stopHue=shadeColor2(hex,-.5)
       console.log('hue', event.target,navHue,startHue,stopHue,nameBackground)
      Velocity(start, { stopColor: startHue}, { duration:500,easing:"easeInOutSine"  })
      Velocity(end, { stopColor: stopHue}, { duration:500,easing:"easeInOutSine"  })
      nav.style.backgroundColor=navHue
      Velocity(back, { backgroundColor: stopHue}, { duration:500,easing:"easeInOutSine"  })
      //nameBackground.style.background=shadeColor2(hex,.7)
      Velocity(nameBackground, { backgroundColor: textHue,color:textHue}, { duration:500,easing:"easeInOutSine"  })
      //Velocity(nameBackground, { color: startHue}, { duration:500,easing:"easeInOutSine"  })
    },
    shrink: function (event,item){
      this.$router.push({ path: this.path})
      var myStore= this.someObject
      console.log( this.someObject,'object',myStore)
      var scrollCon= document.getElementsByClassName("animals-con")[0]
      scrollCon.classList.remove('overflow-hide')
      var selectedAnimalDiv=myStore.selectedAnimal
      var path =this.path
      var routeThis= this
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
      Velocity(document.getElementById("my-holder"),{
        
        width: this.someObject.width,
        height: this.someObject.height,
        left: this.someObject.left +  document.getElementsByClassName("animals-con")[0].scrollLeft,
        top: this.someObject.top,
        translateY: 0,
        translateX: 0

      }, {
        duration: 400, 
        delay:400,
        easing: "easeInOutQuad",
         complete: shrinkFinished
         
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
       console.log(this.disabled,'isdisabled?',this)
        this.$set(this, 'disabled',true)
       console.log(this.disabled,'isdisabled?',this)
       category=this.category
        //console.log(animal, 'item',this.$router)
     
      // `this` inside methods points to the Vue instance
      var viewportOffset = event.target.getBoundingClientRect()
      // these are relative to the viewport
     // console.log("do")
      if (!this.imghold){
       // console.log('cfreate')
     // this.imghold = {}
    }
      var width = event.target.clientWidth
      var height = event.target.clientHeight
      var top = viewportOffset.top
      var navTop=viewportOffset.top-document.getElementsByClassName("top-nav")[0].clientHeight+20
      var left = viewportOffset.left
      var scrollCon= document.getElementsByClassName("animals-con")[0]
      scrollCon.classList.add('overflow-hide')
     // console.log(this,'wdithe',scrollCon,scrollCon.scrollLeft,document.documentElement.scrollLeft,event.target.clientWidth,event.target.getElementsByTagName('img')[0])
  
      //this.imgHold = Object.assign({}, this.imgHold, { widtha: width, heighta: height })
     event.target.style.width = width
      event.target.style.height = height
      event.target.style.top = top
      event.target.style.left = left
       

      // event.target.style.position = 'absolute'
      // var replacementCol = event.target.getAttribute('data-colHide')
      // document.getElementById(replacementCol).classList.remove('hide')
      event.target.style.height = height + 'px'
      event.target.parentElement.parentElement.parentElement.id = 'activeProj'
      var holder = document.getElementById('my-holder')
      var holderImg = document.getElementById('holder-img')
      holderImg.classList.add(animal.imgalign)
      holder.style.transition = ''
      //console.log('greet', this.$parent,this,holder, 'width',width,height, left, top)
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
      holderImg.src = event.target.getElementsByTagName('img')[0].src
     // console.log(event.target.getElementsByTagName('img')[0].src,'align')
      holderImg.classList.add(event.target.getElementsByTagName('img')[0].getAttribute('data-imagealign'));

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
     // console.log(selectedAnimalDiv,'selected',this)
      var path =this.path
      this.$set(this.someObject, 'selectedAnimal',selectedAnimalDiv)
      var routeThis = this
      setTimeout(function () {
        document.getElementById('holder-img').style.transition = 'opacity .6s , transform .4s .2s '
       // console.log('/research/projects/'+animal._path.toString(),'pathhhh',path)
				router.push({ path: path+'/'+animal._path.toString() })
				
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
          //document.getElementById(animal.id).style.translateY='20px';
           event.target.classList.remove('animate')
          event.target.style.opacity = '0'
           document.getElementsByClassName("animal-type-heading")[0].classList.add('animate')
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
          }, 
          {
    	    duration: 400, 
          delay:400,
          easing: [.65,.05,.51,.99],
          complete: enableTouch
    	  });
      }, 0)
      if (event) {
        console.log(top, left)
      }
    }
  }
}
</script>

<style scoped >
#my-holder{
  transform-origin: top left;background-size:cover;background-position: center;left:0%;top:0%;
  width:500px;height:400px;background:transparent;position:absolute;z-index:5;opacity:0;overflow:hidden;
  pointer-events:none;
}
.page-enter-active, .page-leave-active {
  transition-duration: .71s;

}
 .page-leave-to .animals-con {
  opacity: 0;
  transform:translateY(-75px);
    transition: opacity .6s cubic-bezier(.65,.05,.51,.99) , transform .6s cubic-bezier(.65,.05,.51,.99);
 
}

.history-nav{
	position:fixed;
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
  transform:translateZ(0);
  z-index:3;
  height:100%;
  position:relative;
  max-height:100vh;
    overflow:hidden;


  flex-wrap: nowrap;

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
  margin-top:40px;
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
	bottom:30px;
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
  left:20px;
  color:white
  
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
  transition: transform 0.4s ease-in-out, opacity .4s ease-in-out;
  opacity:0;
  transform: translateY(10px);
   
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
.animal-tile.animate{
  transition: transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1), opacity .8s cubic-bezier(0.215, 0.61, 0.355, 1);
  opacity:0;transform: translateY(50px);
  
}
.animal-tile.is-moved {
  transform: translateY(0px);
  opacity:1;
}

.animal-type-heading.animate{
  opacity:1;
  transform:translate(0px);
  
}
.overflow-hide{
  overflow:hidden;

}
</style>