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
     <div id="bonemap">
        <div class="bone-parts"  v-for="(bone,value,key) in bones" v-on:mousedown="boneMouseDown" v-on:touchstart="boneMouseDown"  :data-bone="value.replace(' ', '_')">
          <img :class="bone.sizeClass" id="map_skull"  :src="'/images/kruzof/bones/'+value.toLowerCase()+'.png'"/>
          <div class="bone-mask" :style="'-webkit-mask-image:url(/images/kruzof/bones/'+value.toLowerCase()+'.png)'"></div>
        </div>
  </div>
    <script type="text/javascript" src="../js/kruzof.js"></script>
  </div>
</template>

<script>
let current
//import kruzof from '~plugins/kruzof.js'
//import OrbitControls from './node-modules/three/examples/js/controls/OrbitControls.js'
if (process.browser) {
  var currentPage=this.current
   console.log(this.current,'current')
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
  var DEBUG = false;
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
      bones:{
        'Scapula':{},
        'Basihyoid':{},
        'Sternal_Ribs':{},
        'Ulna':{},
        'Skull':{},
        'Humerus':{},
        
        
        'Ribs':{},
        'Pelvis':{},
        'Caudal_Vertebrae':{sizeClass:'half'},
        'Cervical_Vertebrae':{},
        'Chevrons':{sizeClass:'half'},
        'Stylohyoid':{},
        'Thoracic_Vertebrae':{sizeClass:'full'},
        
        'Sternum':{},
        'Digits':{},
        'Metacarpal':{},
        'Lumbar_Vertebrae':{sizeClass:'full'},
        'Radius':{},
        
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
        {src:'../js/three/build/three.min.js'},
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
    boneMouseDown(el){
      app.addBoneEvent=this.addBoneEvent
      console.log('bonedown')
      app.boneGrabbed=true
      app.selectedBone= el.target
    },
    addBoneEvent(boneDiv,x,y){
      console.log(this,'thisss',window)
      var info = document.getElementById('boneName')
      var bone= boneDiv.getAttribute('data-bone').replace(' ', "_")
      var activeBoneMask= boneDiv

      var boneOrigin= app.orca.getObjectByName(bone)
      console.log('addbone',boneDiv,app,app.orca.getObjectByName(bone))
      var puzzleBone = new THREE.Mesh( app.orca.getObjectByName(bone).geometry.clone(), app.orca.getObjectByName(bone).material );
    //mesh.position.set( i * 100, 0, 0 );
    //scene.add( mesh );
      //var puzzleBone=app.orca.getObjectByName(bone).clone()
       var lambert = new THREE.MeshLambertMaterial({ color: '#11619e'})
      
      //materials.push(lambertBack)
      //puzzleBone.material=materials
      puzzleBone.material=lambert
      puzzleBone.geometry.computeBoundingBox();
      var bbox = puzzleBone.geometry.boundingBox
      app.scene.add(puzzleBone);
      puzzleBone.position.copy(boneOrigin.matrixWorld.getPosition())

      //Calculate Bone Drop Postions 

      	var _plane = new THREE.Plane();
        var _raycaster = new THREE.Raycaster();

        var _mouse = new THREE.Vector2();
        var _offset = new THREE.Vector3();
        var _intersection = new THREE.Vector3();

        var _selected = null, _hovered = null;

        _selected = puzzleBone
        
        //_selected.position.applyMatrix4(app.orca.getObjectByName(bone).matrixWorld);
         //app.scene.updateMatrixWorld()
           boneOrigin.updateMatrixWorld()
           app.orca.updateMatrixWorld()
           boneOrigin.updateMatrixWorld()
           var pivot = new THREE.Object3D();
            pivot.add( puzzleBone );
          puzzleBone.geometry.center();
          app.scene.add( pivot );
            var start = new THREE.Vector3()
      app.scene.updateMatrixWorld();
      app.orca.getObjectByName(bone).getWorldPosition(start)
      start.setFromMatrixPosition( app.orca.getObjectByName(bone).matrixWorld );
          console.log('placeboneafter',boneOrigin.matrixWorld.getPosition(),app.orca.matrixWorld.getPosition(),vector,pivot.matrixWorld.getPosition())
            //world.copy(boneOrigin.matrixWorld.getPosition());
        console.log('matrix',boneOrigin.matrixWorld.getPosition())
				//_plane.setFromNormalAndCoplanarPoint(app.camera.getWorldDirection(_plane.normal), _selected.position);
        _mouse.x = x
		    _mouse.y =  y

        _raycaster.setFromCamera(_mouse, app.camera);
      
				if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
          //_offset.copy(_intersection).sub(_selected.position);
          //_offset.copy(_intersection).sub(_selected.position);
          //_offset.x=0
          //_selected.position.x=0
          //_intersection.x=0
          //start.applyMatrix4(boneOrigin.matrixWorld);
          var start = new THREE.Vector3();
 
          start.applyMatrix4(boneOrigin.matrixWorld);
          
          //_selected.position.applyMatrix4(app.orca.getObjectByName(bone).matrixWorld);
          
           //_offset=_selected.position.applyMatrix4(app.orca.getObjectByName(bone).matrixWorld);
           //_intersection.applyMatrix4(boneOrigin.matrixWorld);
          //_selected.position.copy(_intersection.sub(start));

            var geometry = new THREE.SphereGeometry( 1, 32, 32 );
          var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
          var sphere = new THREE.Mesh( geometry, material );
          //app.scene.add(sphere)
          console.log(puzzleBone.position,'po')
          //puzzleBone.position.applyMatrix4(new THREE.Matrix4().makeTranslation( 0, -3, -4 ) );
          //puzzleBone.matrix.setPosition()
          console.log(puzzleBone.position,'po2')
          sphere.material=material
          //_intersection.x=0
          sphere.position.copy(_intersection)
          var world = new THREE.Vector3();
             app.scene.updateMatrixWorld()
           boneOrigin.updateMatrixWorld()
            world.copy(boneOrigin.matrixWorld.getPosition());

          var deltaX =  sphere.position.x - world.x;
          var deltaY = sphere.position.y - world.y;
          var deltaZ = sphere.position.z - world.z;
           var start = new THREE.Vector3();
          start.copy(_intersection)
           console.log('placebone',_selected.position,start,boneOrigin.position,_intersection,deltaX,deltaY,deltaZ)

          //_selected.position.x=world.x+deltaX
          //_selected.position.y=world.y+deltaY
          //_selected.position.z=world.z+deltaZ

         
            _offset.copy(_intersection).sub(world);
            puzzleBone.position.copy(_intersection);
            //_selected.position.y=_selected.position.y-_offset.y
            //_selected.position.z=_selected.position.z-_offset.z
        //_selected.position.copy(start.sub(world))
        
          app.orca.updateMatrixWorld();


        var vector = new THREE.Vector3();
        //vector.setFromMatrixPosition( boneOrigin.matrixWorld );
          //_selected.position.x=0
           app.scene.updateMatrixWorld()
           boneOrigin.updateMatrixWorld()
          console.log('placeboneafter',boneOrigin.matrixWorld.getPosition(),vector,sphere.matrixWorld.getPosition(),_selected.matrixWorld.getPosition(),_intersection,puzzleBone.position,'sphere')

				}

				//_domElement.style.cursor = 'move';


         Velocity( boneDiv.querySelectorAll(".bone-mask"), { opacity:1 }, { duration: 100 })
      Velocity(info, { translateY: [-10, 0], opacity: 0 }, {
      duration: 300, easing: 'easeOutBack',
        complete: function (elements) {
          console.log(info, elements, 'toooo'); info.innerHTML = bone.replace('_', ' ');

        }
      })
      Velocity(info, { translateY: [10, 0] }, { duration: 0 })
      Velocity(info, { translateY: [0, 10], opacity: 1 }, {
        duration: 300, easing: 'easeOutBack',
      })
      // Tween Opacity
      function tweenOpacity(object,opacity,domElement) {
        object.material.transparent=true
        //object.material.depthWrite=false
       
        var startingOpacity = object.material.opacity;
        var deltaOpacity = opacity - startingOpacity
        var canvas = document.getElementById('example')
        //console.log(startingOpacity,deltaOpacity,'startingopacity')
        var changeBoneMaterial=true
        Velocity(domElement, {
          tween: [1, 0]
        }, {
            duration: 400,
            progress: function (elements, complete, remaining, current, tweenValue) {
              changeBoneMaterial == true ? boneOrigin.material= new THREE.MeshLambertMaterial({ color: '#6f6f6f' }) : null
              object.material.depthWrite=false
             // console.log(startingOpacity,deltaOpacity,object.material.opacity,'position')
              object.material.opacity = startingOpacity + (deltaOpacity * tweenValue);
            }
          });
      }

      // Animate Bone
      function tweenBone(vector, marker, boneVector,domElement) {
        var startingX = boneVector.x;
        var startingY = boneVector.y;
        var startingZ = boneVector.z;
        var deltaX = vector.x - startingX;
        var deltaY = vector.y - startingY;
        var deltaZ = vector.z - startingZ;
        var canvas = document.getElementById('example')
       // console.log(canvas, boneVector,vector,deltaZ,boneVector.z,'canvas')
        Velocity(domElement, {
          tween: [1, 0]
        }, {
            duration: 600,
            progress: function (elements, complete, remaining, current, tweenValue) {
             // console.log(tweenValue,marker.position.z,'position')
              marker.position.x = startingX + (deltaX * tweenValue);
              marker.position.y = startingY + (deltaY * tweenValue);
              marker.position.z = startingZ + (deltaZ * tweenValue);
            },
            complete: function(elements) {  Velocity( activeBoneMask.querySelectorAll(".bone-mask"), { backgroundColor:"#000000",opacity:.3 }, { duration: 400 }) ;
             Velocity( activeBoneMask.querySelectorAll("img"), { opacity:0 }, { duration: 400 })}
          });
      }
      
      
      
      //puzzleBone.doubleSided=false
      console.log(puzzleBone,'puxxlebone')
      //puzzleBone.position.set(0,6,0);
     
      var activeDragObj, reportPos
      app.orca.getObjectByName(bone).geometry.boundingBox;
      //var start =  app.orca.getObjectByName(bone).geometry.boundingSphere.center;
      var start = new THREE.Vector3();
      var place= true
      var removeDragControls = false;
      var boundingBox = boneOrigin.geometry.boundingBox;
     // start.subVectors(boundingBox.max, boundingBox.min);
     // start.multiplyScalar(0.5);
     // start.add(boundingBox.min);

      boneOrigin.geometry.computeBoundingBox();

      var boundingBox = boneOrigin.geometry.boundingBox;

      var start = new THREE.Vector3();
      start.subVectors( boundingBox.max, boundingBox.min );
      start.multiplyScalar( 0.5 );
      start.add( boundingBox.min );

      start.applyMatrix4( boneOrigin.matrixWorld );
      function dragFunction(event) {
      
      var boundingBox = activeDragObj.geometry.boundingBox;

      var position = new THREE.Vector3();
      //position.subVectors(boundingBox.max, boundingBox.min);
     // position.multiplyScalar(0.5);
      //position.add(boundingBox.min);

      //position.applyMatrix4(activeDragObj.matrixWorld);
      position=activeDragObj.position
      //var start = new THREE.Vector3()
      //app.scene.updateMatrixWorld();
      //app.orca.getObjectByName(bone).getWorldPosition(start)
      //start.setFromMatrixPosition( app.orca.getObjectByName(bone).matrixWorld );
     // console.log(start,'start',position,)
      var distance = start.distanceTo(position);
     // console.log(position,start, 'evennnn',distance)
      if (distance < .8 && place == true) {
        place=false
       // console.log("NICCCCCCCCC",position)
        app.dragControls.enabled=false
        //app.dragControls.removeEventListener('dragstart');
        //app.dragControls=null
        //app.dragControls
       
        tweenBone(start, puzzleBone, position,document.body)
        tweenOpacity(puzzleBone,0,document.body)
        activeBoneMask.classList.add('disabled')
        
        removeDragControls=true
      }
      reportPos = requestAnimationFrame(dragFunction)
    }
    var objects=[]
    objects.push(puzzleBone)
    activeDragObj=puzzleBone
   // dragFunction(event)
    
      app.dragControls = new THREE.DragControls(objects, app.camera, app.renderer.domElement);
      app.dragControls.addEventListener('dragstart', function (event) {  dragFunction(event); app.controls.enabled = false; });
      app.dragControls.addEventListener('dragend', function (event) { cancelAnimationFrame(reportPos);; app.controls.enabled = true;
      if (removeDragControls == true){
        app.dragControls.dispose()
        removeDragControls=false
      }});
      console.log(app.dragControls)
     
    },
    addBone(el){
      
      var info = document.getElementById('boneName')
      var bone= el.target.getAttribute('data-bone').replace(' ', "_")
      var activeBoneMask= el.target
      this.addBoneEvent(el.target)
      console.log(bone,'bone',el.target,this)
      //el.target.style.opacity=.25
   
      
    },
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
.bone-parts{
  padding:5px;
  position:relative;
  display:flex;
  justify-content: center;

}
.bone-parts img{
  display:flex;
  pointer-events: none;
}
.half{
  zoom:50%;
}
.bone-mask{
  blend-mode:darken;
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:#11619e;
  display:relative;
  mask-position:center;
  mask-size:initial;
  opacity:0;
  -webkit-mask-repeat: no-repeat;
  pointer-events:none;
  mix-blend-mode: hard-light;
}
#boneName {
  color: #fff;
  font-family: Sofia;
  position: absolute;
  line-height:1;
  top: 120px;
  width: 25%;
  text-align: center;
  z-index: 100;
  right:20px;
  display:block;
  font-size:80px;
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
#bonemap{
  position:absolute;
  bottom:0px;
  left:0px;
  width:calc(100% - 0px);
  height:225px;
  background-color:rgba(0,0,0,.3);
  display:block;
  z-index:2;
  padding:20px;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;

	font-size: 0; 


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
.disabled{
  pointer-events: none;
}



</style>
