<template>
  <div class="container" :data-current="current">

    <div class="top-nav">
      <ul>
        <li class="home-btn" ><nuxt-link to="/" exact ><i class="material-icons">home</i></nuxt-link></li>
        
      </ul>
      <ul class="right-nav " >
        <li class="skinBtn hide" @click="skinSwitch" ><a ></a></li>
        <li class="boneMarkers" @click="boneMarkers" ><a ></a></li>
        <li class="reset" @click="resetBonesPermit" ><a ><i class="material-icons">refresh</i></a></li>
        <li class="help" @click="tutorialActive ? {} : restartTutorial()"><a >?</a></li>
      </ul>
    </div>
   
    <div v-for="(tutorial,value,index) in tutorials" :class="'tutorial-popup '+ tutorial.class" :id="value">
      <div class="skully-con">
      <div class="skully-avatar"></div>
      </div>
      <div class="tutorial-popup-inner">
        <div class="tutorial-content">
          <span class="subhead">{{tutorial.subhead}}</span>
          <p v-html="tutorial.text"></p>
        </div>
        
        <div v-if="value != 'stepend'" class="btn btn-left" @click="endTutorial" :data-step="tutorial.step || index">{{tutorial.lbtntext || "Let me start" }}</div>
        <div v-if="value != 'stepend' && value != 'step6'" class="btn btn-right" @click="value == 'stepresetBones' ? resetBones($event) :tutorialNext($event) " :data-step="tutorial.step || index" :data-next="tutorial.nextlink || index+1">{{tutorial.rbtntext || "Next" }}</div>
        
      </div>
    </div>

    <div class="tutorial-popup " id="popper">
      <div class="skully-con">
      <div class="skully-avatar"></div>
      </div>
      <div class="tutorial-popup-inner">
        <div class="tutorial-content">
          <span class="subhead"></span>
          <p >Congragulations! <br> You've assembled the bones and Kruzof swims again.</p>
        </div>
        
        <div  class="btn btn-left" >Stay here</div>
        <div class="btn btn-right" >Back to Skeleton</div>
        
      </div>
    </div>


    <div class="loader">
       <div class="load-bones-back" >
         <img src="/images/kruzof/loading-bones.png" style="opacity:0"class="img-fluid obj-fit-cover obj-pos-c">
       
      </div>
      <div class="load-bones" id="loadAnimation">
         <img src="/images/kruzof/loading-bones.png" class="img-fluid obj-fit-cover obj-pos-c">
         
      </div>
 
    </div>
    <div id="canvas">
      <div id="glFullscreen">
        <canvas id="example"></canvas>
      </div>
      <div id="boneActiveAlert">This bone has been added above.</div>
      <div v-for="(bone,value,key) in bones" class="boneDrag" :id="value+'boneDrag'">
          <img  :id="value+'boneDragImg'"  :src="'/images/kruzof/bones/'+value.toLowerCase()+'.png'"/>
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
          <div class="bone-parts"  v-for="(bone,value,key) in bones" v-on:mousedown="activeBones.includes(value) ? boneActiveAlert($event,value) : boneMouseDown($event,value) " v-on:touchstart="activeBones.includes(value) ? boneActiveAlert($event,value) : boneMouseDown($event,value)"  :data-bone="value.replace(' ', '_')">
            <img :class="bone.sizeClass" id="map_skull"  :src="'/images/kruzof/bones/'+value.toLowerCase()+'.png'"/>
            <div :class="'bone-mask '+ bone.sizeClass" :style="'-webkit-mask-image:url(/images/kruzof/bones/'+value.toLowerCase()+'.png)'"></div>
          </div>
        </div>
      </div>
    <script type="text/javascript" src="../js/kruzof.js"></script>
  </div>
</template>

<script>
let current;
//const tippy = require("tippy.js");
if (process.browser) {
 // app.popper = this.popper
  var currentPage = this.current;
  console.log(this.current, "current");
  Velocity.RegisterEffect("trans.slideUpIn", {
    defaultDuration: 800,
    easing: "easeOutBack",
    calls: [[{ opacity: [1, 0], translateY: [0, 50] }]]
  });
  var DEBUG = true;
  this.environment == 'production' ? DEBUG = false : null
  this.buildEnv == 'electron' ? DEBUG = false : null
  if (!DEBUG) {
    if (!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for (var i = 0; i < methods.length; i++) {
      console[methods[i]] = function() {};
    }
  }

  //require ('js/kruzof.js')
}

export default {
  components: {},
  asyncData(context) {
    var bones = {
      Scapula: {},
      Basihyoid: {},
      Sternal_Ribs: {},
      Ulna: {},
      Skull: {},
      Humerus: {},

      Ribs: {},
      Pelvis: {},
      Caudal_Vertebrae: { sizeClass: "half" },
      Cervical_Vertebrae: {},
      Chevrons: { sizeClass: "half" },
      Stylohyoid: {},
      Thoracic_Vertebrae: { sizeClass: "full" },

      Sternum: {},
      Digits: {},
      Metacarpal: {},
      Lumbar_Vertebrae: { sizeClass: "full" },
      Radius: {}
    };
    return {
      environment:context.env.environment,
      buildEnv:context.env.buildEnv,
      animals: context.env.animals,
      catImages: {
        Fish: "/images/fish2-back.jpg",
        Salmon: "/images/salmon-back.jpg",
        Invertebrates: "/images/crab-back.jpg",
        Mammals: "/images/mammal-back.jpg"
      },
      tutorialActive: true,
      bones: bones,
      activeBones: [],
      helpToggle:false,
      bonesLeft: Object.keys(bones),
      current: context.route.name,
      category: context.params.category,
      someObject: {
        width: 2,
        height: 3,
        top: 1,
        left: 0,
        img: 1,
        categoryColor: "d"
      },

      tutorials: {
        step0: {
          text: "Welcome to the Kruzof Whale Puzzle! Let me show you around.",
          lbtntext: "No Thanks",
          rbtntext: "Let's do it",
          rbtnEvent:"tutorialNext"
        },
        step1: {
          text:
            "You can drag bones from here into the 3D space above.<br>Give it a shot!",
          subhead: "This is your bone shelf",
          rbtnEvent:"tutorialNext"
        },
        step2: {
          text:
            "You can rotate the 3D camera by dragging your finger to get better a perspective.",
            rbtnEvent:"tutorialNext"
        },
        step3: {
          text: "And of course you can pinch to zoom for a closer look.",
          rbtnEvent:"tutorialNext"
        },
        step4: {
          text: "Tapping here will reset all the bones to your shelf.",
          class: "right-tip",
          rbtnEvent:"tutorialNext"
        },
        step5: {
          text: "If you need me to explain things again just tap here.",
          class: "right-tip",
          rbtnEvent:"tutorialNext"
        },

        step6: {
          text:
            "Well, good luck.<br>Assemble all the bones and Kruzof will swim again!",
          lbtntext: "Get started",
          rbtnEvent:"tutorialNext"
        },
        steprestart: {
          text: "Hi! Nice to see you again.<br>Should I show you around?",
          nextlink: "1",
          step: "restart",
          lbtntext: "No Thanks",
          rbtntext: "Let's do it",
          class: "right-tip",
          rbtnEvent:"tutorialNext"
        },
        stepend: {
          text: "I'm right here if you need me.",
          nextlink: "1",
          step: "restart",
          lbtntext: "No Thanks",
          rbtntext: "Let's do it",
          class: "right-tip",
          rbtnEvent:"tutorialNext"
        },
        stepresetBones: {
          text: "Are you sure you want to <br>remove the assembled bones and start over?",
          nextlink: "1",
          step: "resetBones",
          lbtntext: "No Thanks",
          rbtntext: "Yes, please",
          class: "right-tip",
          rbtnEvent:"resetBones"
        },
        stepFinish: {
          text: "Congratulations! <br> You've assembled the bones and Kruzof swims again!",
          nextlink: "1",
          step: "resetBones",
          lbtntext: "Restart",
          rbtntext: "Back to Skeleton",
          position:{right:40,bottom:40},
          rbtnEvent:"showSkeleton"
     
        }
      },
      boneColors: { white: "#fff", blue: "#39B4FF",blueEmissive: "#003760" }
    };
  },
  plugins: [{ src: "../js/kruzof.js", ssr: false }],
  head() {
    return {
      title: this.name,
      script: [
      
      ]
    };
  },
  mounted() {
    
    // const step1=document.getElementById('step1')
    /*
    tippy('selector', {
      html: '#step1',
    })*/
    //tippy(step1, { html: '#step1pop',theme:'kruzof', animateFill: false,hideOnClick: false,trigger:'manual' })
    //console.log(step1, "tippy show",app);
  

    //tippy(parent, { target: '.child' })
    // Will not destroy any child target instances (if they had been created)
    //parent._tippy.show()
    //step1._tippy.show()
   console.log( document.getElementsByTagName('DIV')[0], 'child')
  },
  transition: {
      mode:'out-in',
      css:true,
      beforeLeave: function(el){
        console.log('kruzofbefreleave')
      },
      leave: function(el){
        console.log('kruzofleave')
        
      },
      beforeEnter:function(){
         console.log('beforekruzoender')
        
      },
      enter:function(el){
        console.log('kruzoender')
        
      }
    },
  methods: {
    boneMarkers(){
     app.activeBones=this.activeBones
    app.bonesLeft=this.bonesLeft
      var markers= app.orca.getObjectByName('Bone Markers')
       console.log('showmarkers',markers)
        // Animate markers
        function tweenMarkers(x, y, z,opacity, marker, domElement) {
          var markerSizes=[]
           var info = document.getElementById('boneName')
           //info.innerHTML='Kruzof'
           var initialInfoOpacity=info.style.opacity
          for (var i = 0; i < markers.children.length; i++) {
            var marker = markers.children[i]
            markerSizes[i]={}
            markerSizes[i].x = marker.scale.x;
            markerSizes[i].y = marker.scale.y;
            markerSizes[i].z = marker.scale.z;
            markerSizes[i].dX = x - marker.scale.x;
            markerSizes[i].dY = y - marker.scale.y;
            markerSizes[i].dZ = z - marker.scale.z;
          }
           var startingO=markers.children[1].material.opacity
          var deltaO = opacity - startingO
          var canvas = document.getElementById('example')
         
          console.log(canvas, 'canvas')
            Velocity(canvas, {
              tween: [1, 0]
            }, {
              easing: app.state.boneMarkers == false ? "spring" : [0.6, -0.58, 0.735, 0.045], 
              duration: 500,
              progress: function (elements, complete, remaining, current, tweenValue) {
                //console.log('tweenma')
                info.style.opacity= 1 + deltaO *tweenValue
                for (var i = 0; i < markers.children.length; i++) {
                  var marker = markers.children[i]
                  marker.material.opacity=startingO + (deltaO * tweenValue)
                  marker.scale.x = markerSizes[i].x + (markerSizes[i].dX * tweenValue);
                  marker.scale.y = markerSizes[i].y + (markerSizes[i].dY * tweenValue);
                  marker.scale.z = markerSizes[i].z + (markerSizes[i].dZ * tweenValue);
                }
              }
            });
        }
        if(app.state.boneMarkers == true){
          tweenMarkers(0,0,1,0,markers.children[0]);app.state.boneMarkers = false
           app.orca.getObjectByName(app.activeMarker.name.split(' ').join('_')).material = app.activeBoneHighlight
        }else{
          tweenMarkers(.6,.6,1,1,markers.children[0]);app.state.boneMarkers = true
          var info = document.getElementById('boneName')
           info.innerHTML='Kruzof'
        }

        
    },
    toggleBoneMarkerBtn(state){
      var boneMarkBtn=document.getElementsByClassName('boneMarkers')[0]
      var opacity
      state == 'off' ? boneMarkBtn.style.pointerEvents="none" : boneMarkBtn.style.pointerEvents="initial"
      state == 'off' ? opacity=.25 : opacity=1
        Velocity(
          boneMarkBtn,
          { opacity: opacity, },
          {
            easing: "easeInOutQuad",
            duration: 350,
            complete: function(elements) {
            }
          }
        );
    },
    skinSwitch(){
      var boneMarkBtn=document.getElementsByClassName('boneMarkers')[0]
      if (app.state.view == 'bones'){
        app.resetGame(true,'skin',app.state.moveKruzof)
        app.state.view = 'skin'
        this.toggleBoneMarkerBtn('off')
       
      }else{
        app.resetGame(true,'bones',app.state.moveKruzof)
        app.state.view = 'bones'

        this.toggleBoneMarkerBtn('on')
      }
      if(app.state.boneMarkers == true){
        this.boneMarkers()
      }
      if(app.state.moveKruzof==true){
        var popper=document.getElementById("popper")
        Velocity(
            popper,
            { opacity: 0, scale: 0.9 },
            {
              easing: [0.6, -0.58, 0.735, 0.045],
              duration: 350,
              complete: function(elements) {
                popper.style.visibility='hidden'
              }
            }
          );
      }
      app.state.moveKruzof=false
    },
    resetBones() {
      var scope=this
      Velocity(
        document.getElementsByClassName('skinBtn')[0],
        { opacity: 0, scale: 1 },
        {
          easing: [0.6, -0.58, 0.735, 0.045],
          duration: 350,
          complete: function(elements) {
            document.getElementsByClassName('skinBtn')[0].style.visibility='hidden'
          }
        }
      );
      Velocity(
        document.getElementById("stepresetBones"),
        { opacity: 0, scale: 0.9 },
        {
          easing: [0.6, -0.58, 0.735, 0.045],
          duration: 350,
          complete: function(elements) {
            document.getElementById("stepresetBones").style.visibility =
              "hidden";
            scope.tutorialActive = false;
          }
        }
      );
      console.log(app.state.endGame,'appstete')
      if(app.state.view == 'skin'){
        
         app.resetGame(false,'bones', app.state.moveKruzof);
         app.state.view='bones'
        
      }
      this.toggleBoneMarkerBtn('on')

      if(app.state.endGame == true){
        
        Velocity(document.getElementById('bonemap'), { translateY: '0px' }, {
          duration: 1200, easing: [100,20], complete: function (elements) { }

        
        })
        app.tweenPosition(app.orca,{x:0,y:.75 ,z:0},document.body)
        app.state.endGame = false
      }
      this.bonesLeft = Object.keys(this.bones);
      app.bonesLeft=this.bonesLeft
     
      for (var i = 0; i < this.activeBones.length; i++) {
        var assembledBone=app.orca.getObjectByName(this.activeBones[i])
        var unassembledBone=app.scene.getObjectByName('puzzle'+this.activeBones[i])
        var activeBoneMask=document.querySelector('[data-bone='+this.activeBones[i]+']')
        console.log(activeBoneMask,'mask',this.activeBones[i],assembledBone,unassembledBone,'assem')
         assembledBone? this.resetTweenOpacity(assembledBone,.2,activeBoneMask,true): null
         unassembledBone ? this.resetTweenOpacity(unassembledBone,0,activeBoneMask,false):null
        Velocity(
          activeBoneMask.querySelectorAll(".bone-mask"),
          { backgroundColor: "#11619e", opacity: 0 },
          { duration: 400 }
        );

        Velocity(
          activeBoneMask.querySelectorAll("img"),
          { opacity: 1 },
          { duration: 400 }
        );
      }
      this.activeBones=[]
    },
    resetTweenOpacity(object, opacity, domElement,assembled) {
      var scope=this
      console.log('active',scope.activeBones)
      var initO=object.material.opacity || 1
      var targetO=opacity
      var deltaO= targetO - initO
      //object.material.opacity=1
      //object.material.transparent=true
      //object.material.depthWrite=true
     // object.material.emissive=0x3c3c3c
     assembled? object.material.blending=THREE.AdditiveBlending: null
      console.log(initO,targetO,deltaO,object,app.scene)
      Velocity(
        domElement,
        {
          tween: [1, 0]
        },
        {
          duration: 400,
          progress: function (
            elements,
            complete,
            remaining,
            current,
            tweenValue
          ) {
           // console.log('tween',object.material.opacity,initO+deltaO*tweenValue,tweenValue)
            object.material.depthWrite=false
            object.material.transparent=true
            object.material.opacity=initO + deltaO * tweenValue
          },
          complete: function (elements) {
          var name
          assembled ? name= object.name : name=object.arrayName
          
          scope.activeBones.splice(scope.activeBones.indexOf(name), 1);
          //console.log(name,'name',scope.activeBones)
          if (assembled){
            app.scene.remove(object)
          }else{
            app[object.name].dragControls.removeEventListener("dragstart");
            app[object.name].dragControls.removeEventListener("dragend");
            app[object.name].dragControls.enabled = false;
            app[object.name].dragControls.deactivate();
            app.scene.remove(object)
          } 
          console.log(name,'name',scope.activeBones,app.scene)
          }
        }
      )
    },
    resetBonesPermit(){
       var tutorialStep = document.getElementById("stepresetBones");
      var step1 = document.getElementById("step1");
      this.tutorialActive = true;
      console.log("restart");
      tutorialStep.style.visibility = "visible";
      Velocity(
        document.getElementById("stepresetBones"),
        { opacity: 1, scale: [1, 0.9] },
        { easing: [0.175, 0.885, 0.32, 1.575], duration: 350 }
      );
     
      //step1.style.visibility='visible'
    },
    restartTutorial() {
      var tutorialStep = document.getElementById("steprestart");
      var step1 = document.getElementById("step1");

      if(this.helpToggle ==false){
        this.helpToggle=true
        //document.getElementById("restart).style.visibility='hidden'
        //this.tutorialActive = true;
        console.log("restart");
        tutorialStep.style.visibility = "visible";
        Velocity(
          document.getElementById("steprestart"),
          { opacity: 1, scale: [1, 0.9] },
          { easing: [0.175, 0.885, 0.32, 1.575], duration: 350 }
        );
        step1.querySelector(".tutorial-content").innerHTML =
          "<span class='subhead'>This is your bone shelf</span><p>You can drag bones from here into the 3D space above.<br>Give it a shot!</p>";
      }else{
        this.helpToggle=false
        tutorialStep.style.visibility = "visible";
        Velocity(
          document.getElementById("steprestart"),
          { opacity: 0, scale: [ 0.9] },
          { easing: [0.6, -0.58, 0.735, 0.045], duration: 350 }
        );

      }

      //step1.style.visibility='visible'
    },
    endTutorial(event) {
      var currentStep = event.target.getAttribute("data-step");
      var nextStep = document.getElementById("stepend");
      var scope = this;
      nextStep.style.visibility = "visible";
      Velocity(
        document.getElementById("step" + currentStep),
        { opacity: 0, scale: 0.9 },
        {
          easing: [0.6, -0.58, 0.735, 0.045],
          duration: 350,
          complete: function(elements) {
            document.getElementById("step" + currentStep).style.visibility =
              "hidden";
            Velocity(
              nextStep,
              { opacity: 1, scale: [1, 0.9] },
              { easing: [0.175, 0.885, 0.32, 1.575], duration: 350 }
            );
            setTimeout(() => {
              Velocity(
                document.getElementById("stepend"),
                { opacity: 0, scale: 0.9 },
                {
                  easing: [0.6, -0.58, 0.735, 0.045],
                  duration: 350,
                  complete: function(elements) {
                    document.getElementById("stepend").style.visibility =
                      "hidden";
                    scope.tutorialActive = false;
                  }
                }
              );
            }, 1600);
          }
        }
      );
    },
    tutorialNext(event) {
      console.log("nexet", event);
      this.tutorialActive = true;
      var currentStep = event.target.getAttribute("data-step");
      var nextStep = event.target.getAttribute("data-next");

      if ( nextStep == 1 && app.state.endGame == true){
        nextStep=2
      }

      console.log(nextStep, currentStep);
      Velocity(
        document.getElementById("step" + currentStep),
        { opacity: 0, scale: 0.9 },
        {
          easing: [0.6, -0.58, 0.735, 0.045],
          duration: 350,
          complete: function(elements) {
            document.getElementById("step" + currentStep).style.visibility =
              "hidden";
            document.getElementById("step" + nextStep).style.visibility =
              "visible";
            Velocity(
              document.getElementById("step" + nextStep),
              { opacity: 1, scale: [1, 0.9] },
              { easing: [0.175, 0.885, 0.32, 1.575], duration: 350 }
            );
          }
        }
      );
    },
    popper(content,pos,lBtnFunc,rBtnFunc){
     
      var popper=document.getElementById("popper")
      var rightBtn=popper.querySelector(".btn-right")
      var leftBtn=popper.querySelector(".btn-left")
      console.log('pop',pos,rBtnFunc,rightBtn,)
      var scope=this
      rightBtn.onclick=function(){
        app.resetGame(true,'bones',true)
        app.state.view = 'bones'
        app.state.moveKruzof= false
        scope.toggleBoneMarkerBtn('on')
       // app.tweenOpacity(app.skinGroup,0,document.body)
        //app.tweenOpacity(app.orca,1,document.body)
        //app.tweenPosition(app.skinGroup,{x:app.skinGroup.position.x,y:app.skinGroup.position.y,z:-1.5 - app.end.transform.zSkin},document.getElementsByTagName('DIV')[0])
        //app.tweenPosition(app.orca,{x:app.orca.position.x,y:app.orca.position.y,z:-app.end.transform.zBones},document.getElementsByTagName('DIV')[1])
        Velocity(
          popper,
          { opacity: 0, scale: 0.9 },
          {
            easing: [0.6, -0.58, 0.735, 0.045],
            duration: 350,
            complete: function(elements) {
              popper.style.visibility='hidden'
            }
          }
        );
      }
      leftBtn.onclick=function(){
        
        Velocity(
          popper,
          { opacity: 0, scale: 0.9 },
          {
            easing: [0.6, -0.58, 0.735, 0.045],
            duration: 350,
            complete: function(elements) {
              popper.style.visibility='hidden'
            }
          }
        );
      }
       
      popper.style.visibility = "visible";

      // Set Popper Position
      pos.right ? popper.style.right= pos.right + 'px' : popper.style.right='initial'
      pos.bottom ? popper.style.bottom= pos.bottom + 'px' : popper.style.bottom='initial'
      pos.left ? popper.style.left= pos.left + 'px' : popper.style.left='initial'
      pos.top ? popper.top.bottom= pos.top + 'px' : popper.style.top='initial'
      
       Velocity(
          popper,
          { opacity: 1, scale: [1, 0.9] },
          { easing: [0.175, 0.885, 0.32, 1.575], duration: 350 }
        );
    },
    endGame(){
      var scope = this;
      app.endGame()
      app.state.endGame = true
      app.state.moveKruzof = true
      app.state.view = 'skin'
       if(app.state.boneMarkers == true){
          this.boneMarkers()
        }
      // Remove Bone Drag Listeners
      document.getElementById('canvas').removeEventListener("mousemove", app.dragListener);
      document.getElementById('canvas').removeEventListener("touchmove", app.dragListener);
      app.boneMapDragListen =false
      app.dragControls.removeEventListener("dragstart");
      app.dragControls.removeEventListener("dragend");
      app.dragControls.enabled = false;
      app.dragControls.deactivate();
      app.dragControls=null

      this.toggleBoneMarkerBtn('off')

      setTimeout(() => {
        scope.popper(
          null,
          scope.tutorials.stepFinish.position,
          null
        )
        var skinBtn=document.getElementsByClassName('skinBtn')[0]
        skinBtn.style.visibility='visible'
        //skinBtn.style.transform="scale(.8)"
        Velocity(
          skinBtn,
          { opacity: 1, scale: [1, 0.8] },
          {
            easing: [0.175, 0.885, 0.32, 1.875],
            duration: 650,
            complete: function(elements) {
              
            }
          }
        );
      }, 6000);
    },
    // Tween Opacity
    tweenOpacity(object, opacity, domElement) {
      var boneOrigin = object.originBone;
      var scope = this;
     
      console.log(scope.bonesLeft, "bonesleft", domElement);
      console.log('BONEOPACITY',object,opacity)

      var target = boneOrigin;
      //boneOrigin.material=target.material.clone()
      var newC = new THREE.MeshLambertMaterial({
        color: scope.boneColors.white,
        emissive: 0x000000
      });
      newC= new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .56, metalness: .2, })
      newC.normalMap=app.boneMatBump
      object.material.clippingPlanes = [app.boneClip];
      var initial = new THREE.Color(newC.color.getHex());

      var blue = new THREE.MeshLambertMaterial({
        color: scope.boneColors.blue,
        emissive: scope.boneColors.blueEmissive
      });
      var value = new THREE.Color(blue.color.getHex());
      //object.material.transparent=true
      //object.material.depthWrite=false
      //boneOrigin.material.emissive = null;
      //boneOrigin.material=new THREE.MeshStandardMaterial({ transparency=color: 0xffffff, roughness: 0, metalness: 0, })
      
      var startingOpacity = object.material.opacity;
      //var deltaOpacity = opacity - startingOpacity
      var deltaR, deltaG, deltaB, deltaER, deltaEG, deltaEB,deltaRough,deltaMetal
      deltaR = initial.r - value.r;
      deltaG = initial.g - value.g;
      deltaB = initial.b - value.b;
      deltaER = blue.emissive.r;
      deltaEG = blue.emissive.g;
      deltaEB = blue.emissive.b;
      deltaRough= .56
      deltaMetal= .2
      console.log(
        deltaR,
        deltaG,
        deltaB,
        initial.r,
        value.r,
        "r",
        initial.g,
        value.g,
        "g",
        initial.b,
        value.b,
        "b",
        "deltas"
      );
      var canvas = document.getElementById("example");
      object.material.transparent = true;

      //object.scale.set(.5,.5,.5)
      //console.log(startingOpacity,deltaOpacity,'startingopacity')
      var changeBoneMaterial = true;
      Velocity(
        domElement,
        {
          tween: [1, 0]
        },
        {
          duration: 400,
          progress: function(
            elements,
            complete,
            remaining,
            current,
            tweenValue
          ) {
            //changeBoneMaterial=false
            //changeBoneMaterial == true ? object.material.opacity=0 : null
            changeBoneMaterial = false;
            //var newColor = new THREE.Color(boneOrigin.material.color.getHex());
            object.material.depthWrite = false;
            //boneOrigin.material.emissive=null
            //newCo={}
            boneOrigin.material.color.r = value.r + deltaR * tweenValue;
            boneOrigin.material.color.g = value.g + deltaG * tweenValue;
            boneOrigin.material.color.b = value.b + deltaB * tweenValue;
            //boneOrigin.material.roughness= 0 + deltaRough * tweenValue
            //boneOrigin.material.metalness= 0 + deltaMetal * tweenValue

            boneOrigin.material.emissive.r =
              blue.emissive.r - blue.emissive.r * tweenValue;
            boneOrigin.material.emissive.g =
              blue.emissive.g - blue.emissive.g * tweenValue;
            boneOrigin.material.emissive.b =
              blue.emissive.b - blue.emissive.b * tweenValue;
            // console.log(startingOpacity,deltaOpacity,object.material.opacity,'position')
            //object.material.opacity = startingOpacity + (deltaOpacity * tweenValue);
            //boneOrigin.material.color= newCo
          },
          complete: function(elements) {
             //boneOrigin.material=new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .56, metalness: .2, })
           // boneOrigin.material.normalMap=app.boneMatBump
           boneOrigin.material.blending= THREE.NormalBlending 
            var boneRemove = app.scene.getObjectByName(object.name);
            console.log(boneRemove, object.name,boneOrigin.material, "name");
            app.scene.remove(boneRemove);
            console.log(scope.bonesLeft,app.state,'STATUS')
            scope.bonesLeft.splice(scope.bonesLeft.indexOf(object.arrayName), 1);
            scope.bonesLeft.length == 0 && app.state.endGame != true ? scope.endGame() : null;
            //scope.endGame()
            
            var tutorialStep = document.getElementById("step1");
            boneOrigin.material.clippingPlanes = [app.boneClip];
            if (scope.tutorialActive) {
              Velocity(
                tutorialStep,
                { opacity: 0, scale: 0.9 },
                {
                  easing: [0.6, -0.58, 0.735, 0.045],
                  duration: 350,
                  complete: function(elements) {
                    tutorialStep.querySelector(".tutorial-content").innerHTML =
                      "<p>Great! You're a natural. Let me show you a few more things.</p>";
                    Velocity(
                      tutorialStep,
                      { opacity: 1, scale: [1, 0.9] },
                      { easing: [0.175, 0.885, 0.32, 1.575], duration: 350 }
                    );
                  }
                }
              );
            }
            //console.log('result',boneOrigin.material)
            //boneOrigin.material=new THREE.MeshLambertMaterial({ color: '#6f6f6f' })
            //console.log('result2',boneOrigin.material)
          }
        }
      );
    },
    boneActiveAlert(event){
      event.preventDefault();
      var target=event.target
      var boneName = event.target
        .getAttribute("data-bone")
        .replace(" ", "_");
      var puzzleBoneName = "puzzle" + boneName
      var bone = app[puzzleBoneName]
      var boneAlert = document.getElementById("boneActiveAlert")
      Velocity(boneAlert,"finish")
      Velocity(
        boneAlert,
        { opacity: 1, scale: [1, 0.9] },
        { easing: [0.175, 0.885, 0.32, 1.575], duration: 350 }
      );
      Velocity(
        boneAlert,
        { opacity: 0, scale: 0.9 },
        {easing: [0.6, -0.58, 0.735, 0.045],delay:1000, duration: 350 }
      );

      var startingX = bone.scale.x;
        var startingY = bone.scale.y;
        var startingZ = bone.scale.z;
        var deltaX = 1.3 - startingX;
        var deltaY = 1.3 - startingY;
        var deltaZ = 1.3 - startingZ;
        var canvas = document.getElementById("example");
        // console.log(canvas, boneVector,vector,deltaZ,boneVector.z,'canvas')
        Velocity(
          target,
          {
            tween: [1, 0]
          },
          {
            duration: 300,
            easing: [150, 17],
            progress: function(
              elements,
              complete,
              remaining,
              current,
              tweenValue
            ) {
              // console.log(bone.scale, "scale");
              bone.scale.x = startingX + deltaX * tweenValue;
              bone.scale.y = startingY + deltaY * tweenValue;
              bone.scale.z = startingZ + deltaZ * tweenValue;
            },complete: function(){
              Velocity(
               target,
                {
                  tween: [1, 0]
                },
                {
                  duration: 300,
                  easing: [150, 17],
                  progress: function(
                    elements,
                    complete,
                    remaining,
                    current,
                    tweenValue
                  ) {
                    // console.log(bone.scale, "scale");
                    bone.scale.x = 1.3 - .3 * tweenValue;
                    bone.scale.y = 1.3 - .3 * tweenValue;
                    bone.scale.z = 1.3 - .3 * tweenValue;
                  }
                }
              );
            }
          }
        );
        
    },
    boneMouseDown(el) {
      el.preventDefault();
      app.addBoneEvent = this.addBoneEvent;
      console.log("bonedown",el);
      
      app.boneGrabbed = true;
      app.selectedBone = el.target;
      var boneDrag = document.getElementById("boneDrag");
      var boneName = app.selectedBone
        .getAttribute("data-bone")
        .replace(" ", "_");
        event.boneName=boneName
      var boneDrag = document.getElementById(boneName+"boneDrag");
      var boneDragImg = document.getElementById(boneName+"boneDragImg");
      var touchIndex = app.currentTouches.findIndex(p => p.object == boneDrag)
      console.log(touchIndex,boneDrag.id,app.currentTouches,"YOOOOOOOOO")
      // Check if already attached to touch
      if (touchIndex == -1){
    
        var boneImageEl = app.selectedBone.getElementsByTagName("img")[0];
        boneDragImg.src = boneImageEl.src;
        console.log(
          app.selectedBone.getElementsByTagName("img")[0].classList,
          "width"
        );
        boneImageEl.classList.contains("half")
          ? (boneDrag.style.width =
              app.selectedBone.getBoundingClientRect().width + "px")
          : (boneDrag.style.width = boneImageEl.width + "px");
        boneImageEl.classList.contains("half")
          ? (boneDrag.style.height = app.selectedBone.getBoundingClientRect().height)
          : (boneDrag.style.height = boneImageEl.height + "px");
        //boneDrag.style.width=app.selectedBone.getElementsByTagName('img')[0].getBoundingClientRect().width+'px'
        //boneDrag.style.height=app.selectedBone.getElementsByTagName('img')[0].getBoundingClientRect().height+'px'
  
        //Velocity( app.selectedBone.querySelectorAll("img"), { opacity:0 }, { duration: 100 })
        //Velocity( app.selectedBone.querySelectorAll(".bone-mask"), { opacity:1 }, { duration: 100 }) ;
        var touches = event.changedTouches;
        if (!touches){
          var x,y
          x = e.pageX;
          y = e.pageY
          boneDrag.style.left = x + 20 - boneDrag.clientWidth / 2 + "px";
          boneDrag.style.top = y - boneDrag.clientHeight / 2 + "px";
        }
        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];


            app.currentTouches.push({
                id: touch.identifier,
                pageX: touch.pageX,
                pageY: touch.pageY,
                object: boneDrag,
                boneDiv: touch.target,
                isBoneMap:true
            });
            boneDrag.style.left = touch.pageX + 20 - boneDrag.clientWidth / 2 + "px";
            boneDrag.style.top = touch.pageY - boneDrag.clientHeight / 2 + "px";


        }
        
        Velocity(
          boneDrag,
          { opacity: 1, scale: 1.35 },
          { easing: [200, 15], duration: 400 }
        );
        if (app.boneMapDragListen != true){
          console.log("ADDDBONE DRAG")
          document.getElementById('canvas').addEventListener("mousemove", app.dragListener);
          document.getElementById('canvas').addEventListener("touchmove", app.dragListener);
          app.boneMapDragListen=true
        }
      }
     
    },
    addBoneEvent(boneDiv, x, y) {
      var scope = this;
      var tutorialStep = document.getElementById("step1");
      if (this.tutorialActive) {
        Velocity(
          tutorialStep,
          { opacity: 0, scale: 0.9 },
          {
            easing: [0.6, -0.58, 0.735, 0.045],
            duration: 350,
            complete: function(elements) {
              tutorialStep.querySelector(".tutorial-content").innerHTML =
                "<p>Nice!<br> Now drag the bone to it's correct position.</p>";
              Velocity(
                tutorialStep,
                { opacity: 1, scale: [1, 0.9] },
                { easing: [0.175, 0.885, 0.32, 1.575], duration: 350 }
              );
            }
          }
        );
      }
      console.log(this, "thisss", window, boneDiv);

      var tweenBone, tweenBoneSize;
      var place = true;
      var info = document.getElementById("boneName");
      var bone = boneDiv.getAttribute("data-bone").replace(" ", "_");
      this.activeBones.push(boneDiv.getAttribute("data-bone"));

      var activeBoneMask = boneDiv;
      var removeDragControls = false;

      var boneOrigin = app.orca.getObjectByName(bone);
      console.log("addbone", boneDiv, app, app.orca.getObjectByName(bone));
      var puzzleBone = new THREE.Mesh(
        app.orca.getObjectByName(bone).geometry.clone(),
        app.orca.getObjectByName(bone).material
      );
      puzzleBone.name = "puzzle" + app.orca.getObjectByName(bone).name;
      puzzleBone.arrayName = boneDiv.getAttribute("data-bone");
      app[puzzleBone.name] = puzzleBone
      puzzleBone.originBone = boneOrigin;
      puzzleBone.boneMask=activeBoneMask
      //mesh.position.set( i * 100, 0, 0 );
      //scene.add( mesh );
      //var puzzleBone=app.orca.getObjectByName(bone).clone()
      
      var lambert = new THREE.MeshLambertMaterial({
        color: this.boneColors.blue,
        emissive: scope.boneColors.blueEmissive
      });
      var lambert = new THREE.MeshStandardMaterial({ emissive: scope.boneColors.blueEmissive,color: this.boneColors.blue, roughness: .56, metalness: .2, })
      lambert.normalMap=app.boneMatBump
     //materials.push(lambertBack)
      //puzzleBone.material=materials
      puzzleBone.material = lambert;
      puzzleBone.geometry.computeBoundingBox();
      var bbox = puzzleBone.geometry.boundingBox;
      app.scene.add(puzzleBone);
      puzzleBone.layers.set(0);
      puzzleBone.position.copy(boneOrigin.matrixWorld.getPosition());

      //Calculate Bone Drop Postions

      var _plane = new THREE.Plane();
      var _raycaster = new THREE.Raycaster();

      var _mouse = new THREE.Vector2();
      var _offset = new THREE.Vector3();
      var _intersection = new THREE.Vector3();

      var _selected = null,
        _hovered = null;

      _selected = puzzleBone;

      //_selected.position.applyMatrix4(app.orca.getObjectByName(bone).matrixWorld);
      //app.scene.updateMatrixWorld()
      boneOrigin.updateMatrixWorld();
      app.orca.updateMatrixWorld();
      boneOrigin.updateMatrixWorld();
      //var pivot = new THREE.Object3D();
      // pivot.add(puzzleBone);
      puzzleBone.geometry.center();
      //app.scene.add(pivot);
      var start = new THREE.Vector3();
      app.scene.updateMatrixWorld();
      app.orca.getObjectByName(bone).getWorldPosition(start);
      start.setFromMatrixPosition(app.orca.getObjectByName(bone).matrixWorld);
      console.log(
        "placeboneafter",
        boneOrigin.matrixWorld.getPosition(),
        app.orca.matrixWorld.getPosition(),
        vector
        //pivot.matrixWorld.getPosition()
      );
      //world.copy(boneOrigin.matrixWorld.getPosition());
      console.log("matrix", boneOrigin.matrixWorld.getPosition());
      _plane.setFromNormalAndCoplanarPoint(app.camera.getWorldDirection(_plane.normal), _selected.position);
      _mouse.x = x;
      _mouse.y = y;

      _raycaster.setFromCamera(_mouse, app.camera);

      if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
        var start = new THREE.Vector3();
        start.applyMatrix4(boneOrigin.matrixWorld);
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        var sphere = new THREE.Mesh(geometry, material);
        //app.scene.add(sphere)
        console.log(puzzleBone.position, "po");
        //puzzleBone.position.applyMatrix4(new THREE.Matrix4().makeTranslation( 0, -3, -4 ) );
        //puzzleBone.matrix.setPosition()
        console.log(puzzleBone.position, "po2");
        sphere.material = material;
        //_intersection.x=0
        sphere.position.copy(_intersection);
        var world = new THREE.Vector3();
        app.scene.updateMatrixWorld();
        boneOrigin.updateMatrixWorld();
        world.copy(boneOrigin.matrixWorld.getPosition());

        var deltaX = sphere.position.x - world.x;
        var deltaY = sphere.position.y - world.y;
        var deltaZ = sphere.position.z - world.z;
        var start = new THREE.Vector3();
        start.copy(_intersection);
        console.log(
          "placebone",
          _selected.position,
          start,
          boneOrigin.position,
          _intersection,
          deltaX,
          deltaY,
          deltaZ
        );
         //_intersection.x=0
         _intersection.x < -7 ? _intersection.x =-10 :null
        _intersection.x > 7  ? _intersection.x =7 :null
        _intersection.z < -10 ? _intersection.z =-10 :null
        _intersection.z > 7  ? _intersection.z =7 :null
        _intersection.y < -7 ? _intersection.y =-7 :null
        _intersection.y > 7  ? _intersection.y =7 :null
        _offset.copy(_intersection).sub(world);
        puzzleBone.position.copy(_intersection);
        console.log('boneplace')
        puzzleBone.scale.set(0.8, 0.8, 0.8);
        tweenBoneSize(puzzleBone, 1, app[puzzleBone.name].boneMask);

        boneOrigin.geometry.computeBoundingBox();
        var boundingBox = boneOrigin.geometry.boundingBox;
        console.log(boneOrigin, boundingBox);
        var start = new THREE.Vector3();
        start.subVectors(boundingBox.max, boundingBox.min);
        start.multiplyScalar(0.5);
        start.add(boundingBox.min);

        start.applyMatrix4(boneOrigin.matrixWorld);

        var boundingBox = puzzleBone.geometry.boundingBox;

        var position = new THREE.Vector3();
        position = puzzleBone.position;

        var distance = start.distanceTo(position);
        console.log(position, start, "evennnn", distance, place);
        if (distance < 0.8 && place == true) {
          place = false;
          app[puzzleBone.name].boneAssembledOnDrop=true
          //app.dragControls ? app.dragControls.removeObject(app[puzzleBone.name]) : {}
          // console.log("NICCCCCCCCC",position)
          //app.dragControls ? app.dragControls.enabled=false : null

          tweenBone(start, puzzleBone, position, app[puzzleBone.name].boneMask);
          scope.tweenOpacity(puzzleBone, 0, app[puzzleBone.name].boneMask);
          //activeBoneMask.classList.add("disabled");

          removeDragControls = true;
        }
        //_selected.position.y=_selected.position.y-_offset.y
        //_selected.position.z=_selected.position.z-_offset.z
        //_selected.position.copy(start.sub(world))

        app.orca.updateMatrixWorld();

        var vector = new THREE.Vector3();
        //vector.setFromMatrixPosition( boneOrigin.matrixWorld );
        //_selected.position.x=0
        app.scene.updateMatrixWorld();
        boneOrigin.updateMatrixWorld();
        console.log(
          "placeboneafter",
          boneOrigin.matrixWorld.getPosition(),
          vector,
          sphere.matrixWorld.getPosition(),
          _selected.matrixWorld.getPosition(),
          _intersection,
          puzzleBone.position,
          "sphere"
        );
      }

      //_domElement.style.cursor = 'move';

      Velocity(
        boneDiv.querySelectorAll(".bone-mask"),
        { opacity: 1 },
        { duration: 100 }
      );
      /*
      Velocity(
        info,
        { translateY: [-10, 0], opacity: 0 },
        {
          duration: 300,
          easing: "easeOutBack",
          complete: function(elements) {
            console.log(info, elements, "toooo");
            info.innerHTML = bone.replace("_", " ");
          }
        }
      );
      Velocity(info, { translateY: [10, 0] }, { duration: 0 });
      Velocity(
        info,
        { translateY: [0, 10], opacity: 1 },
        {
          duration: 300,
          easing: "easeOutBack"
        }
      );*/

      // Animate Bone

      var scope = this;
      function tweenBone(vector, marker, boneVector, domElement) {
        //app[marker.name].dragControls.enabled=false
        var boneOrigin=marker.originBone
        var startingX = boneVector.x;
        var startingY = boneVector.y;
        var startingZ = boneVector.z;
        var deltaX = vector.x - startingX;
        var deltaY = vector.y - startingY;
        var deltaZ = vector.z - startingZ;
        var canvas = document.getElementById("example");

        // console.log(canvas, boneVector,vector,deltaZ,boneVector.z,'canvas')
        Velocity(
          domElement,
          {
            tween: [1, 0]
          },
          {
            duration: 600,
            progress: function(
              elements,
              complete,
              remaining,
              current,
              tweenValue
            ) {
              // console.log(tweenValue,marker.position.z,'position')
              marker.position.x = startingX + deltaX * tweenValue;
              marker.position.y = startingY + deltaY * tweenValue;
              marker.position.z = startingZ + deltaZ * tweenValue;
            },
            complete: function(elements) {
              var activeBoneMask=marker.boneMask
              Velocity(
                activeBoneMask.querySelectorAll(".bone-mask"),
                { backgroundColor: "#000000", opacity: 0.3 },
                { duration: 400 }
              );
              /*
              boneOrigin.material = new THREE.MeshLambertMaterial({
                color: scope.boneColors.blue,
                emissive: 0x00578c
              });*/
              boneOrigin.material=new THREE.MeshStandardMaterial({  color: scope.boneColors.blue, blending: THREE.AdditiveBlending,roughness:.56,metalness:.2,emissive: scope.boneColors.blueEmissive })
              boneOrigin.material.transparent = false;
              boneOrigin.material.normalMap=app.boneMatBump
              boneOrigin.material.opacity = 1;
              console.log(boneOrigin.material);
              marker.material.opacity = 0;

              Velocity(
                activeBoneMask.querySelectorAll("img"),
                { opacity: 0 },
                { duration: 400 }
              );
            }
          }
        );
      }

      // Animate Bone
      function tweenBoneSize(bone, size, domElement) {
        var scope = this;
        console.log(bone.scale, "scale");
        var startingX = bone.scale.x;
        var startingY = bone.scale.y;
        var startingZ = bone.scale.z;
        var deltaX = size - startingX;
        var deltaY = size - startingY;
        var deltaZ = size - startingZ;
        var canvas = document.getElementById("example");
        // console.log(canvas, boneVector,vector,deltaZ,boneVector.z,'canvas')
        Velocity(
          domElement,
          {
            tween: [1, 0]
          },
          {
            duration: 400,
            easing: [350, 17],
            progress: function(
              elements,
              complete,
              remaining,
              current,
              tweenValue
            ) {
              // console.log(bone.scale, "scale");
              bone.scale.x = startingX + deltaX * tweenValue;
              bone.scale.y = startingY + deltaY * tweenValue;
              bone.scale.z = startingZ + deltaZ * tweenValue;
            }
          }
        );
      }

      //puzzleBone.doubleSided=false
      console.log(puzzleBone, "puxxlebone");
      //puzzleBone.position.set(0,6,0);

      var activeDragObj, reportPos;
      app.orca.getObjectByName(bone).geometry.boundingBox;
      //var start =  app.orca.getObjectByName(bone).geometry.boundingSphere.center;
      var start = new THREE.Vector3();

      var boundingBox = boneOrigin.geometry.boundingBox;
      // start.subVectors(boundingBox.max, boundingBox.min);
      // start.multiplyScalar(0.5);
      // start.add(boundingBox.min);

      boneOrigin.geometry.computeBoundingBox();

      var boundingBox = boneOrigin.geometry.boundingBox;

      app[puzzleBone.name].start = new THREE.Vector3();
      app[puzzleBone.name].start.subVectors(boundingBox.max, boundingBox.min);
      app[puzzleBone.name].start.multiplyScalar(0.5);
      app[puzzleBone.name].start.add(boundingBox.min);

      app[puzzleBone.name].start.applyMatrix4(boneOrigin.matrixWorld);
    
      var objects = [];
      // var puzzleGroup= new THREE.Group()
      // app.scene.add(puzzleGroup)
      // puzzleGroup.add(puzzleBone)
      objects.push(puzzleBone);
      activeDragObj = puzzleBone;
      // dragFunction(event)
      if (!app.dragControls) {
        console.log("createControls");
        app[puzzleBone.name].reportPos=''
        app.dragControls = new THREE.DragControls(
          objects,
          app.camera,
          app.renderer.domElement
        );
        app.dragControls.addEventListener(
          "drag",
         // app[puzzleBone.name].dragFunction(event)
          
          function(event) {
            
            //console.log('puzzleDrag',event.object)
             var activeDragObj=event.object
             var bone = bone
             var puzzleBone=event.object
              console.log('Dragging',event.object)
              var boundingBox = activeDragObj.geometry.boundingBox;

              var position = new THREE.Vector3();
              //position.subVectors(boundingBox.max, boundingBox.min);
              // position.multiplyScalar(0.5);
              //position.add(boundingBox.min);

              //position.applyMatrix4(activeDragObj.matrixWorld);
              position = activeDragObj.position;
              //var start = new THREE.Vector3()
              //app.scene.updateMatrixWorld();
              //app.orca.getObjectByName(bone).getWorldPosition(start)
              //start.setFromMatrixPosition( app.orca.getObjectByName(bone).matrixWorld );
              // console.log(start,'start',position,)
              var distance = app[event.object.name].start.distanceTo(position);
              // console.log(position,start, 'evennnn',distance)
              if (distance < 0.8 && app[event.object.name].boneAssembledOnDrop!=true) {
                place = false;
                // console.log("NICCCCCCCCC",position)
                //app.dragControls.enabled = false;
                 app.dragControls.removeObject(event.object)
                //app.dragControls.dispose()
                //app.dragControls.removeEventListener('dragstart');
                //app.dragControls=null
                //app.dragControls
                //console.log(app[puzzleBone.name],puzzleBone.name,'ourcontrols')
                console.log(app[event.object.name].start,'START',event.object)
                app[puzzleBone.name].boneMask
                tweenBone(app[event.object.name].start, app[event.object.name], position, app[event.object.name].boneMask);
                scope.tweenOpacity(app[event.object.name], 0, app[event.object.name].boneMask);
                //activeBoneMask.classList.add("disabled");

                removeDragControls = true;
              }else{
                //app[event.object.name].reportPos = requestAnimationFrame(dragFunction.bind(null,activeDragObj));
              app.controls.enabled = false;
              }
              if(app[event.object.name].boneAssembledOnDrop==true){
                app.dragControls.removeObject(event.object)
                //app[event.object.name].reportPos = requestAnimationFrame(dragFunction.bind(null,activeDragObj));
              }
              
          
    
          }
        );
        app.dragControls.addEventListener("dragend", function(
          event
        ) {
          console.log('CANCELANIMATIONREWUIES',event.object)
          cancelAnimationFrame(app[event.object.name].reportPos);
          //app.controls.enabled = true;
          if (removeDragControls == true) {
            //app.dragControls.removeObject(event.object)
            place=true
            removeDragControls = false
            /*
            console.log(this, "thecontrols");
            this.removeEventListener("dragstart");
            this.removeEventListener("dragend");
            this.enabled = false;
            this.deactivate();
            removeDragControls = false;*/
          }
        });
       // console.log(app[puzzleBone.name].dragControls);
      }else{
        
         app[puzzleBone.name].boneAssembledOnDrop !=true ? app.dragControls.addObject(objects[0]) : {}

      }
    },
    addBone(el) {
      var info = document.getElementById("boneName");
      var bone = el.target.getAttribute("data-bone").replace(" ", "_");
      var activeBoneMask = el.target;
      this.addBoneEvent(el.target);
      console.log(bone, "bone", el.target, this);
      //el.target.style.opacity=.25
    }
    
  }
};
</script>
<style>
.tutorial-popup {
  width: 460px;
  bottom: 260px;
  left: 50px;
  position: absolute;
  background: white;
  border-radius: 10px;
  z-index: 6;
  display: flex;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform:translateZ(0)
}
.tutorial-content {
  display: flex;
  flex-direction: column;
}

.tutorial-popup:after {
  content: "";
  position: absolute;
  top: calc(100% - 1px);
  left: 50%;
  margin-left: -15px;
  border-width: 15px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}
.right-tip:after {
  content: "";
  position: absolute;
  top: -29px;
  left: 90%;
  margin-left: -15px;
  border-width: 15px;
  border-style: solid;
  transform: rotate(180deg);
  border-color: white transparent transparent transparent;
}
.skully-con {
  display: flex;
  top: -42px;
  position: absolute;
  background: white;
  border-radius: 50%;
  border: 6px solid white;
  z-index: 1;
  width: 84px;
  height: 84px;
}
.skully-avatar {
  background-image: url(/images/kruzof/tip-skull.png);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;

  background-color: var(--tutblue);
  border-radius: 50%;
}
.skully-avatar:after {
  content: "";
  position: absolute;
  z-index: -1;
  bottom: -13px;
  right: -97%;
  width: 60px;
  height: 34px;
  background: #fff;
  border-bottom-left-radius: 40px 50px;
  transform: translate(-30px, -2px);
}
.skully-avatar:before {
  content: "";
  position: absolute;
  z-index: -1;
  bottom: -10px;
  right: -25%;
  height: 30px;
  border-left: 60px solid var(--tutblue);
  background: var(--tutblue);
  border-bottom-left-radius: 80px 50px;
  transform: translate(0, -2px);
}
.tutorial-popup-inner p {
  font-size: 1.7rem;
  font-family: Sofia;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
  padding-bottom: 14px;
  margin-bottom: 0px;
}
.tutorial-popup-inner .subhead {
  font-size: 1.1rem;
  font-family: Sofia;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
  text-transform: uppercase;
  color: #575757;
  padding-bottom: 10px;
}
.tutorial-popup-inner {
  padding: 20px;
  padding-top: 50px;
  padding-bottom: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}
.tutorial-popup-inner .btn {
  padding: 12px 20px;
  background: var(--tutblue);
  border-radius: 6px;
  display: inline-block;
  align-self: center;
  margin: 0 20px;
  font-size: 1.3rem;
  font-family: Sofia;
  margin-top: 1rem;
  color:white;
  user-select: none;
}
</style>
<style scoped>
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  --tutblue:#1b9dff
}
#parent {
  z-index: 10;
  width: 50%;
  top: 30%;
  position: absolute;
}
#boneActiveAlert{
  font-family: Sofia;
  font-weight:500;
  color:white;
  z-index:7;
  pointer-events:none;
  font-size:1rem;
  position:absolute;
  padding:8px 12px;
  background:#1b9dff;
  border-radius:10px;
  line-height:1.2;
  opacity:0;
  bottom:210px
  
}
#canvas{

}
.skinBtn{

}
.skinBtn{
 opacity:0;
 visibility:hidden;
 background:url('/static/images/kruzof/skinBtn.svg');
 background-size:85%;
 background-repeat:no-repeat;
 background-position:center;
}
.tippy-tooltip.kruzof-theme {
  /* Your styling here. Example: */
  background-color: white;
  border-radius: 10px;
  width: 420px;
  overflow: visible;
}

.tutorial-step-anchor {
  width: 20px;
  height: 20px;
  position: absolute;

  z-index: 8;
  //background:navy
}
#step0 {
  left: initial;
  right: 40px;
  bottom: 270px;
  opacity: 0;
}
#step1,
#step2,
#step3,
#step6,
#stepFinish {
  right: 40px;
  left: initial;
  bottom: 270px;
}
#step4,#stepresetBones{
  right: 160px;
  left: initial;
  top: 140px;
  bottom: initial;
}
#step5,
#stepend,
#steprestart {
  right: 50px;
  left: initial;
  top: 150px;
  bottom: initial;
}
.blueback{
  background-color:#15467a;
  width:100%;
  height:100%;
  position:absolute;
  z-index:-1
}
body {
  font-family: Sofia;
  background-color: linear-gradient(to bottom, #1e5799 0%, #7db9e8 100%);
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

.top-nav {
  background: none;
  display: block;

  height:0px;
  align-content: center;
}
.top-nav ul {
  
  padding-left: 10px;
  display:inline-block;
  padding-right: 40px;
}
.top-nav li {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #026bbd;
  align-self: center;
  display: flex;
  justify-content: center;
  margin: 0px 20px;

}

.top-nav li a {
  text-align: center;
  font-size: 1.7rem;
  vertical-align: middle;
  padding: 0;
  align-self: center;
}

.top-nav li.help a {
  font-size: 2.5rem;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 400;
  vertical-align: middle;
  line-height: 1;
}
ul.right-nav {
  display:flex;
  position:absolute;
  top:35px;
  right:0px;

}
.top-nav li.reset a {
  font-size: 2.2rem;
}
.back-button {
  background: #026bbd;
}
.loader {
  height: 100%;
  width: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 7;
  display: flex;
  justify-content: center;
  align-content: center;
  opacity: 1;
  transition: opacity 0.6s ease-in-out;
}
.top-nav li.home-btn{
  width: 100px;
  height: 100px;
  margin-top:30px
}
.home-btn i{
  font-size: 3.2rem;
}

.boneMarkers a{
  background:url('/static/images/kruzof/boneID.svg');
  height:100%;
  width:100%;
  background-size:85%;
  background-position:50% 45%;
  background-repeat:no-repeat
}
.loader h3 {
  font-family: Sofia;
  font-size: 2rem;
  font-weight: 400;
  text-transform: uppercase;
  position: absolute;
  top: 65%;
  letter-spacing: 0.1rem;
}
.load-bones {
  align-self: center;
  position: absolute;
  width: 40%;
  z-index: 5;
  transition: all 1s ease-in-out;
  clip-path: inset(0% 100% 0 0%);
}
.load-bones-back {
  align-self: center;
  position: absolute;
  width: 40%;
  transition: all 0.6s ease-in-out;
  -webkit-mask-image: url(/images/kruzof/loading-bones.png);
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: 100%;
  mask-size: initial;
  z-index: 4;
  -webkit-mask-repeat: no-repeat;
  background: rgba(0, 0, 0, 0.3);
}
.loader.fade {
  opacity: 0;
}
.bone-parts {
  padding: 5px;
  position: relative;
  display: flex;
  justify-content: center;
  margin: auto;
}
.bone-parts img {
  display: flex;
  pointer-events: none;
}
.half {
  zoom: 50%;
}
.bone-mask {
  blend-mode: darken;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #11619e;
  display: relative;
  mask-position: center;
  mask-size: initial;
  opacity: 0;
  -webkit-mask-repeat: no-repeat;
  pointer-events: none;
  mix-blend-mode: hard-light;
}
#canvas {
  display: flex;
  justify-content: center;;;
  height:100%;
  width:100%;
}
#boneName {
  color: #fff;
  font-family: Sofia;
  position: absolute;
  line-height: 1;
  top: 40px;
  width: 100%;
  text-align: center;
  z-index: 4;

  display: block;
  font-size: 50px;
  font-weight: 500;
  pointer-events: none;
  opacity: 0;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                            supported by Chrome and Opera */
}
#bonemap {
  position: absolute;
  bottom: -50px;
  left: 0px;
  width: calc(100% - 0px);
  height: 275px;
  background-color: rgba(0, 0, 0, 0.3);
  display: block;
  z-index: 2;
  padding: 20px;
  padding-bottom:70px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  transform: translateY(400px);
  will-change:transform;

  font-size: 0;
}
#boneName a {
  color: #f00;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}
#glFullscreen {
  width: 100%;
  height: 100%;
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
  font-size: 12px;
}
#dat {
  user-select: none;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 200;
}
#boneDrag,.boneDrag {
  position: absolute;
  top: 0;
  left: 40px;
  width: 260px;
  height: 260px;
  z-index: 300;
  justify-content: center;
  display: flex;
  pointer-events: none;
  opacity: 0;
}
#boneDrag img, .boneDrag img {
  width: 100%;
  height: auto;
  display: inline;
  vertical-align: middle;
  display: flex;
  display: 1;
  align-self: center;
}
.disabled {
  pointer-events: none;
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
 .page-leave .particles{
   z-index:0
}
</style>
