<template>
  <div class="container" :data-current="current">
    
    <div class="top-nav">
      <ul>
  
        <li ><nuxt-link to="/" exact><i class="material-icons">home</i></nuxt-link></li>
      </ul>
    </div>
    <nuxt-link to="/history" ><div class="back-button nav-button"><i class="material-icons">keyboard_arrow_left</i></div></nuxt-link>
    <div id="glFullscreen">
      <canvas id="example"></canvas>
    </div>
    <div id="dat">

    </div>
    <div id="boneName">
      Kruzof
      <div id="feedback"></div>
    </div>  
    <div id="boneInfo">
    </div>
    <script type="text/javascript" src="../js/kruzof.js"></script>
  </div>
</template>

<script>
let current
//import kruzof from '~plugins/kruzof.js'
//import OrbitControls from './node-modules/three/examples/js/controls/OrbitControls.js'
if (process.browser) {
  // THREE = require('three')
   // console.log(THREE,'threes')
   // var OBJLoader= require('three-obj-loader')(THREE)
    //require('three/examples/js/loaders/loaderSupport.js');
   //var OBJLoader = require('three/examples/js/loaders/OBJLoader2.js');
   //var OBJLoader = require('three/src/loaders/ObjectLoader.js');
   //var OBJLoader = require('three/src/loaders/ObjectLoader.js');
   //var OBJLoader = require('three/src/loaders/ObjectLoader.js');
   //require ('../node-modules/three/examples/js/controls/OrbitControls.js')
    Velocity.RegisterEffect("trans.slideUpIn", {
        defaultDuration: 800,
        easing: 'easeOutBack' ,
        calls: [[ { opacity: [1,0], translateY: [0,50] } ]]
    })
  var DEBUG = true;
  if(!DEBUG){
        if(!window.console) window.console = {};
        var methods = ['log', 'debug', 'warn', 'info'];
        for(var i=0;i<methods.length;i++){
          console[methods[i]] = function(){};
        };
    };
  
  //require ('js/kruzof.js')

  }


export default {
	components: {

	},
  asyncData (context) {
   return { 
      animals: context.env.animals,
      catImages:{
      Fish:'/images/fish2-back.jpg',
      Salmon:'/images/salmon-back.jpg',
      Invertebrates:'/images/crab-back.jpg',
      Mammals:'/images/mammal-back.jpg',

      },
      current: context.route.name,
      category: context.params.category,
      someObject:{'width':2, 'height':3,'top':1, 'left':0, 'img':1,'categoryColor':'d'},
     
    }
  },
  plugins:[
    {src:'../js/kruzof.js',ssr:false}
  ],
  head() {
    return {
      title: this.name,
      script:[
        {src:'../js/three/build/three2.min.js'},
        {src:'../js/three/loaders/JDLoader.min.js'},
        {src:'../js/three/controls/OrbitControlsSmooth.js'},
        {src:'../js/three/controls/DragControls.js'},
        {src:'../js/three/loaders/LoaderSupport.js'},
        {src:'../js/three/loaders/OBJLoader2.js'},
     


	    ]
      
    }
  },
  mounted(){
    
  },
  methods: {
    beforeEnter(el){
      console.log('beforeenter',el)
      var title=document.getElementsByClassName("animal-type-heading")[0]
      var row=document.getElementsByClassName("animal-type-heading")[0]
      console.log('beforeenter',el,title)
      //title.style.opacity=0
      Velocity(title, { translateX: '-50px', opacity:0}, { duration:0  })
    },
     enter(el,done){
      console.log('enter',el)
      var title=document.getElementsByClassName("animal-type-heading")[0]
      var animalBack=document.getElementsByClassName("animals-back-img")[0]
      var overlay=document.getElementsByClassName("overlay-w")[0]
      var row=document.getElementsByClassName("row")[0]
      var animalTiles=document.querySelectorAll(".animal-tile")
      var nameBackground=document.querySelectorAll(".animal-name-back")
      overlay.style.background=this.someObject['overlayColor']
      console.log(nameBackground,overlay,'background')
      var textHue=this.someObject['categoryColor']
      title.style.opacity=0
     row.style.opacity=0
     // animalBack.style.opacity=0
      //var row=document.getElementsByClassName("row")[0]
      //console.log('catenaiml enter',title)
      Velocity(title, { translateY: '10px'}, { duration:0  })
     Velocity(row, { opacity:1}, { duration:0  })
      //Velocity(animalBack, {  opacity:0}, { duration:0  })
     Velocity(animalTiles, {  translateY: '50px', opacity:0}, { duration:0  })

     // Velocity(animalBack, {  opacity:.3}, { duration:400,easing:'easeInOutSine'  })
     // Velocity(animalTiles, { scale:1, opacity:1}, { duration:400,easing:'easeInOutSine'  })
      Velocity(title, {opacity:1,translateY:'0px'}, { duration:400,easing:'easeInOutSine'   })
      Velocity(nameBackground, { backgroundColor: textHue,color:textHue}, { duration:0  })
      Velocity(animalTiles,  "trans.slideUpIn", {duration:800,stagger: 75, drag: true ,easing: 'easeOutBack' ,complete: function(elements) { done() } })

    },
     beforeLeave(el){
      console.log('beforeleave',el)
    },
     leave(el,done){
        console.log('leave',el)
       var title=document.getElementsByClassName("animal-type-heading")[0]
       var row=document.getElementsByClassName("row")[0]
       var animalTiles=document.querySelectorAll(".animal-tile")
       var animalBack=document.getElementsByClassName("animals-back-img")[0]
       //Velocity(animalBack, {  opacity:0}, { duration:400,easing:'easeInOutSine'  })
       Velocity(title, {  opacity:0,translateY:'-10px'}, { duration:400,easing:'easeInOutSine' , })
       //Velocity(animalTiles, { scale:1.1, opacity:0}, { duration:400,easing:'easeInOutSine'  })
       Velocity(row, { translateY: '-50px', opacity:0}, { duration:400,easing: 'easeOutBack', complete: function(elements) { done() }  })
     

    },
    animalClass: function (event,item){
      function shadeColor2(color, percent) {   
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
      }
     
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
     // Velocity(animalBack, { opacity: startHue}, { duration:500,easing:"easeInOutSine"  })
      Velocity(start, { stopColor: startHue}, { duration:500,easing:"easeInOutSine"  })
      Velocity(end, { stopColor: stopHue}, { duration:500,easing:"easeInOutSine"  })
      nav.style.backgroundColor=navHue
      Velocity(back, { backgroundColor: stopHue}, { duration:500,easing:"easeInOutSine"  })
      //nameBackground.style.background=shadeColor2(hex,.7)
       this.$set(this.someObject, 'categoryColor',textHue)
       this.$set(this.someObject, 'overlayColor',overlayHue)
      //Velocity(nameBackground, { backgroundColor: textHue,color:textHue}, { duration:500,easing:"easeInOutSine"  })
      //Velocity(nameBackground, { color: startHue}, { duration:500,easing:"easeInOutSine"  })
    },
  }
}
</script>

<style >
*{
   -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  font-family: Sofia;
  background-color: linear-gradient(to bottom, #1e5799 0%,#7db9e8 100%);
  color: #fff;
  margin: 0 0 0 0;
  padding: 0 0 0 0;
  border: none;
  cursor: default;
   -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
                            supported by Chrome and Opera */
}

#boneName {
  color: #fff;
  font-family: Sofia;
  position: absolute;
  line-height:1;
  top: 120px;
  width: 25%;
  text-align: left;
  z-index: 100;
  right:80px;
  display:block;
  font-size:90px;
  font-weight:700;
  pointer-events:none;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
                            supported by Chrome and Opera */
}
#boneName a {
  color: #f00;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer
  
}
#glFullscreen {
  width: 100%;
  height: 100vh;
  min-width: 640px;
  min-height: 360px;
  position: relative;
  overflow: hidden;
  z-index: 0;
}
#example {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  /*background-color:#1e5799;*/
  /* background:url('obj/woolly_mammoth/studio-back.jpg')*/
}
#feedback {
  color: darkorange;
  font-size:12px;
}
#dat {
  user-select: none;
  position: absolute;
  left: 0;
  top: 0;
  z-Index: 200;
}



</style>
