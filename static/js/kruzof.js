
'use strict';

var vertexShader = `varying vec3 vWorldPosition;
					void main() {
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;


var fragmentShader = ` uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
					void main() {
      float h = normalize( vWorldPosition + offset ).y;
    gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
  }`;


var vertexShaders = `    varying vec2 vUv;
				  void main() {
      vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

var fragmentShaders = `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
				  void main() {
      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
    }
`;

var skyVertex = `
      varying vec2 vUV;
				void main() {
        vUV = uv;
      vec4 pos = vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * pos;
    }
`;
var skyFragment = `
      uniform sampler2D texture;
      varying vec2 vUV;
				void main() {
        vec4 sample = texture2D(texture, vUV);
      gl_FragColor = vec4(sample.xyz, sample.w);
    }
`;

var vs = `


	attribute vec4 tangent;

	uniform float time;
	uniform vec2 repeat;
	uniform float useNormal;
	uniform float useRim;

	varying vec2 vUv;
	varying vec3 vTangent;
	varying vec3 vBinormal;
	varying vec3 vNormal;
	varying vec3 vEye;
	varying vec3 vU;
	varying vec2 vN;

	void main() {

		vU = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );

		if( useNormal == 0. ) {
			vec3 n = normalize( normalMatrix * normal );
			vec3 r = reflect( vU, n );
			float m = 2.0 * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z+1.0 ) );
			vN = vec2( r.x / m + 0.5,  r.y / m + 0.5 );
		} else {
			vN = vec2( 0. );
		}

		vUv = repeat * uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		vNormal = normalize( normalMatrix * normal );
		if( useNormal == 1. ) {
			vTangent = normalize( normalMatrix * tangent.xyz );
			vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );
		} else {
			vTangent = vec3( 0. );
			vBinormal = vec3( 0. );
		}

		if( useRim > 0. ) {
			vEye = ( modelViewMatrix * vec4( position, 1.0 ) ).xyz;
		} else {
			vEye = vec3( 0. );
		}

	}

	
`;

var fs = `

	
	uniform float time;
	uniform float bump;
	uniform sampler2D tNormal;
	uniform sampler2D tMatCap;
	uniform float noise;
	uniform float useNormal;
	uniform float useRim;
	uniform float rimPower;
	uniform float useScreen;
	uniform float normalScale;
	uniform float normalRepeat;

	varying vec2 vUv;
	varying vec3 vTangent;
	varying vec3 vBinormal;
	varying vec3 vNormal;
	varying vec3 vEye;
	varying vec3 vU;
	varying vec2 vN;

	float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

	void main() {
		
		vec3 finalNormal = vNormal;
		vec2 calculatedNormal = vN;

		if( useNormal == 1. ) {
			vec3 normalTex = texture2D( tNormal, vUv * normalRepeat ).xyz * 2.0 - 1.0;
			normalTex.xy *= normalScale;
			normalTex.y *= -1.;
			normalTex = normalize( normalTex );
			mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );
			finalNormal = tsb * normalTex;

			vec3 r = reflect( vU, normalize( finalNormal ) );
			float m = 2.0 * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z+1.0 ) );
			calculatedNormal = vec2( r.x / m + 0.5,  r.y / m + 0.5 );
		}

		vec3 base = texture2D( tMatCap, calculatedNormal ).rgb;
		
		// rim lighting

		if( useRim > 0. ) {
			float f = rimPower * abs( dot( vNormal, normalize( vEye ) ) );
			f = useRim * ( 1. - smoothstep( 0.0, 1., f ) );
	        base += vec3( f );
	    }

	    // screen blending

        if( useScreen == 1. ) {
			base = vec3( 1. ) - ( vec3( 1. ) - base ) * ( vec3( 1. ) - base );
		}

        // noise 

        base += noise * ( .5 - random( vec3( 1. ), length( gl_FragCoord ) ) );

		gl_FragColor = vec4( base, 1. );

	}`;


var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, sprite, size;
var currentPage = document.getElementsByClassName("container")[0].getAttribute('data-current')
//console.log(document.getElementsByClassName("container")[0].getAttribute('data-current'),'this')

// Tween Opacity
function tweenOpacity(object, opacity,domElement) {
 // var target = boneOrigin;
  //boneOrigin.material=target.material.clone()
  console.log(object)
  var newC = new THREE.MeshLambertMaterial({ color: "#6f6f6f" });
  var initial = object.children[0].material.opacity

  var blue = new THREE.MeshLambertMaterial({ color: "#11619e" });
  var value = .15
  //object.material.transparent=true
  //object.material.depthWrite=false

  //var startingOpacity = object.material.opacity;
  //var deltaOpacity = opacity - startingOpacity
  var deltaR, deltaG, deltaB,deltaO;
  deltaO = value - initial  
 // deltaR = initial.r - value.r;
 // deltaG = initial.g - value.g;
 // deltaB = initial.b - value.b;

  var canvas = document.getElementById("example");

  //object.scale.set(.5,.5,.5)
  //console.log(startingOpacity,deltaOpacity,'startingopacity')
  var changeBoneMaterial = true;
  Velocity(
    domElement,
    {
      tween: [1, 0]
    },
    {
      duration: 1200,
      easing: "easeInOutQuad",
      progress: function (
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
        for (var i = 0; i < object.children.length; i++) {
          //object.children[i].material.depthWrite = false;
        //newCo={}
        object.children[i].material ? object.children[i].material.opacity = initial + deltaO * tweenValue:{}
        }
        //boneOrigin.material.color.g = value.g + deltaG * tweenValue;
       // boneOrigin.material.color.b = value.b + deltaB * tweenValue;
        // console.log(startingOpacity,deltaOpacity,object.material.opacity,'position')
        //object.material.opacity = startingOpacity + (deltaOpacity * tweenValue);
        //boneOrigin.material.color= newCo
      },
      complete: function (elements) {
        for (var i = 0; i < object.children.length; i++) {
         // console.log(object.children[i].material)
          //newCo={} object.children[i].material.opacity = value + deltaO * tweenValue;
        }
        //console.log('result',boneOrigin.material)
        //boneOrigin.material=new THREE.MeshLambertMaterial({ color: '#6f6f6f' })
        //console.log('result2',boneOrigin.material)
      }
    }
  );
}

function tweenCamera(targetPosition, duration,end) {
  var end = end
  //controls.enabled = false;
  var camera= app.camera
  var initial = new THREE.Vector3().copy(app.camera.position);

  var deltaX, deltaY, deltaZ
 console.log(initial, app.camera.position,targetPosition,'inits')
  deltaX = targetPosition.x - initial.x
  deltaY = targetPosition.y - initial.y
  deltaZ = targetPosition.z - initial.z

  Velocity(
    document.documentElement,
    {
      tween: [1, 0]
    },
    {
      duration: duration,
      easing: "easeInOutQuad",
      progress: function (
        elements,
        complete,
        remaining,
        current,
        tweenValue
      ) {
        var newPosition = new THREE.Vector3(0,0,0)
        newPosition.x = initial.x + deltaX * tweenValue
        newPosition.y = initial.y + deltaY * tweenValue
        newPosition.z = initial.z + deltaZ * tweenValue
        app.camera.position.copy(newPosition);
       // console.log(app.camera.position,'positiong')
        app.camera.lookAt(new THREE.Vector3(0, 0, 0));
    
      },
      complete: function (elements) {
        if (end){
          app.growSkin()
        }
      }
    }
  );
}
console.log(window,'WINDOW')

function tweenLoad(target, initial,duration) {

 

  var deltaLoad
 
  deltaLoad = target - initial
  var loaderAnimation = document.getElementById('loadAnimation')
  console.log('tweenLoad',target,initial)
  Velocity(
    document.getElementById('loadAnimation'),
    {
      tween: [1, 0]
    },
    {
      duration: 600,

      easing: "easeInOutQuad",
      progress: function (
        elements,
        complete,
        remaining,
        current,
        tweenValue
      ) {
        
        var newPosition
        newPosition = Math.floor(initial + deltaLoad * tweenValue)
        console.log('aniamteeeee', newPosition,deltaLoad,tweenValue)
        loaderAnimation.style.clipPath = "inset(0% " + newPosition + "% 0% 0%)"

      },
      complete: function (elements) {

      }
    }
  );
}

THREE.SectionHelper = function (object, hexOrMaterial) {

  var material;
  if (hexOrMaterial instanceof THREE.MeshBasicMaterial) {

    material = hexOrMaterial;

  } else {

    var color = (hexOrMaterial !== undefined) ? hexOrMaterial : 0xffffff;
    material = new THREE.MeshBasicMaterial({ color: color, side: THREE.BackSide });

  }
  object.updateMatrixWorld();
  object.updateMatrix();
  THREE.Mesh.call(this, object.geometry, material);
  console.log(object,'object')
 
  this.matrix = object.matrixWorld;
  
  this.matrixAutoUpdate = false;

};

THREE.SectionHelper.prototype = Object.create(THREE.Mesh.prototype);
THREE.SectionHelper.prototype.constructor = THREE.SectionHelper;

var OBJLoader2Example = (function () {
  var objects = [];
  console.log(THREE, 'three')
  //THREE.loaderSupport={}
  var Validator = THREE.LoaderSupport.Validator;
  console.log('kruzof')
  function OBJLoader2Example(elementToBindTo) {
    this.renderer = null;
    this.canvas = elementToBindTo;
    this.aspectRatio = 1;
    this.recalcAspectRatio();

    this.scene = null;
    this.cameraDefaults = {
      posCamera: new THREE.Vector3(40, 10, 20),
      posCameraTarget: new THREE.Vector3(0, 0, 0),
      near: 0.1,
      far: 20000,
      fov: 45,

    };
    this.camera = null;
    this.cameraTarget = this.cameraDefaults.posCameraTarget;

    this.controls = null;
  }

  OBJLoader2Example.prototype.initGL = function () {
    this.state={}
    // Tween Opacity
    this.tweenOpacity = function (object, opacity, domElement) {
      // var target = boneOrigin;
      //boneOrigin.material=target.material.clone()
      console.log(object, 'tweenOpacity')
      var initial
      object.children[0].material.length > 1 ? initial= object.children[0].material[0].opacity : initial=object.children[0].material.opacity
      //var initial = object.children[0].material.opacity
      var value = opacity
      var deltaR, deltaG, deltaB, deltaO;
      deltaO = value - initial
      var canvas = document.getElementById("example");
      console.log(deltaO, 'tweenOpacity',object,value,initial)
      Velocity(
        domElement,
        {
          tween: [1, 0]
        },
        {
          duration: 1200,
          easing: "easeInOutQuad",
          progress: function (
            elements,
            complete,
            remaining,
            current,
            tweenValue
          ) {
            
            for (var i = 0; i < object.children.length; i++) {
              if (!object.children[i].material){
                // Skip boneMarker Sprites
                continue
              }
              if (object.children[i].material && object.children[i].material.length>1){
                for (var e = 0; e < object.children[i].material.length; ++e) {
                  object.children[i].material[e].depthWrite = true
                  object.children[i].material[e].alphaTest = true
                  object.children[i].material[e].opacity = initial + deltaO * tweenValue
                }
              }else{
                object.children[i].material.depthWrite = true
                object.children[i].material.transparent=true
                object.children[i].material.opacity = initial + deltaO * tweenValue;
              }

            }

          },
          complete: function (elements) {
            for (var i = 0; i < object.children.length; i++) {
              if (!object.children[i].material) {
                // Skip boneMarker Sprites
                continue
              }
              if (object.children[i].material && object.children[i].material.length > 1) {
                for (var e = 0; e < object.children[i].material.length; ++e) {
                  opacity == 0 ? object.children[i].material[e].depthWrite = false : object.children[i].material[e].depthWrite = true
                }
              } else {
                opacity == 0 ? object.children[i].material.depthWrite = false : object.children[i].material.depthWrite = true
            
              }

            }
          }
        }
      );
    }
    this.end={}
    this.end.transform={}
    this.end.transform.y=.75
    this.end.transform.zSkin = 1
    this.end.transform.zBones = .65
    this.timers={}

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      autoClear: true,
      sortObjects: true,
      alpha: true
    });
    if (!window.kruzof){
      
    }
    window.kruzof ? {} : window.kruzof={}
    window.kruzof.renderer=this.renderer
    //window.$nuxt.$store.webGlRenderer = this.renderer
    console.log(window.kruzof, "WINDOW")
    //this.renderer.setClearColor( 0xb7b7b7);

    this.scene = new THREE.Scene();
    this.projector = new THREE.Projector();
    //this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    this.scene.background = new THREE.Color('#dddddd');
    this.scene.fog = new THREE.Fog("#103b69", 1, 500);
    //this.scene.fog = new THREE.Fog(this.scene.background, 1, 1000);
    //this.scene = new THREE.FaceColors()

    var cameraLight = new THREE.DirectionalLight(0xffffff, .5)
    var helper = new THREE.DirectionalLightHelper(cameraLight, 5);
    //this.scene.add(helper)
    this.flashlight = new THREE.DirectionalLight(0x340FD1, 1);
    
    
    //flashlight.target = this.camera;
    var helper = new THREE.DirectionalLightHelper(this.flashlight, 1);
    //this.scene.add(helper)
    this.camera = new THREE.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
    this.scene.add(this.camera)
    
    
    //this.camera.lookAt(skinGroup)
   
    //this.scene.add(cameraLight)
    this.flashlight.rotation.x = -Math.PI / 2
    this.flashlight.rotation.z = Math.PI / 2
    this.flashlight.position.set(0, 0, 0);

    
    this.resetCamera();
   this.flashlight.target = this.camera;
    //this.camera.add(this.flashlight);
    this.flashlight.position.set(0, 2.6, -6);
    //this.scene.add(this.flashlight)
    this.camera.add(cameraLight);
    
    //this.flashlight.castShadow = true;
    currentPage === 'kruzof' ? this.camera.position.set(-10, 5, 10) : this.camera.position.position = new THREE.Vector3(18, 3, -300) //this.camera.rotation.x = 90 * Math.PI / 180
    this.camera.fov = 45
    //this.camera.layers.enable(2);
    this.controls=null;
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    
    currentPage === 'kruzof' ? this.controls.enablePan = true : this.controls.enablePan=false
    currentPage === 'kruzof' ? this.controls.enableZoom = true : this.controls.enableZoom = true
    this.controls.enableDamping = true
    this.controls.dampingFactor = .1
    this.controls.rotateSpeed = .2
    //this.controls.zoomDampingFactor = 0.2;
    this.controls.panDampingFactor = 0.2;
    this.controls.panSpeed = .3
    this.controls.zoomSpeed = .225
    this.controls.maxDistance = 50

    //this.controls.zoomDampingFactor = 0.075;
    this.controls.enabled=false
    this.materialCameraPosition = this.camera.position.clone();
    this.materialCameraPosition.z += 10;
    var uniforms = {
      topColor: { value: new THREE.Color('#6ba6e4') },
      bottomColor: { value: new THREE.Color('#15467b') },
      offset: { value: 100 },
      exponent: { value: 4 }
    };
    //uniforms.topColor.value.copy(hemiLight.color);
    //this.scene.fog.color.copy(uniforms.topColor.value);

    // Lighting ///////////////////////////////////////

    var skyGeo = new THREE.SphereGeometry(1000, 32, 32);
    var skyMat = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide });
    var sky = new THREE.Mesh(skyGeo, skyMat);
    //sky.position.y=-1600
    this.scene.add(sky);
    //renderer = new THREE.WebGLRenderer();
    //renderer.setPixelRatio(window.devicePixelRatio);
    //renderer.setSize(window.innerWidth, window.innerHeight);
    //container.appendChild(renderer.domElement);
    //var ambientLight = new THREE.AmbientLight( 0xFFB475 );
    var ambientLight = new THREE.AmbientLight(0xFFffff);
    //var directionalLight1 = new THREE.DirectionalLight( 0xC4BFA9 );
    //var directionalLight2 = new THREE.DirectionalLight( 0xB8EEFF );
    var directionalLight1 = new THREE.DirectionalLight(0xC4BFA9);
    var directionalLight2 = new THREE.DirectionalLight(0xB8EEFF);
    directionalLight1.castShadow = true;
    ambientLight.castShadow = true;
    directionalLight1.position.set(200, -200, 200);
    directionalLight2.position.set(-200, 200, -200);
    var light = new THREE.HemisphereLight(0x5d8193, 0x080820, .3);
    //scene.add(light);

    //this.scene.add(directionalLight1);
    //this.scene.add(directionalLight2);
    //this.scene.add(ambientLight);

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.color.setHSL(0.57, .6, 0.7);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    hemiLight.castShadow = true;
    //this.scene.add(hemiLight);
    //this.scene.add(hemiLightHelper);

    // morph Light
    // lights
    function createLight(color) {
      var intensity = 1.5;
      var pointLight = new THREE.PointLight(color, intensity, 20);
      pointLight.castShadow = true;
      pointLight.shadow.camera.near = 1;
      pointLight.shadow.camera.far = 60;
      pointLight.shadow.bias = - 0.005; // reduces self-shadowing on double-sided objects
      var geometry = new THREE.SphereBufferGeometry(0.3, 12, 6);
      var material = new THREE.MeshBasicMaterial({ color: color });
      material.color.multiplyScalar(intensity);
      var sphere = new THREE.Mesh(geometry, material);
      pointLight.add(sphere);
      var texture = new THREE.CanvasTexture(generateTexture());
      texture.magFilter = THREE.NearestFilter;
      texture.wrapT = THREE.RepeatWrapping;
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.set(1, 3.5,1);
      var geometry = new THREE.SphereBufferGeometry(2, 32, 8);
      var material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        alphaMap: texture,
        alphaTest: 0.5
      });
      var sphere = new THREE.Mesh(geometry, material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      pointLight.add(sphere);
      // custom distance material
      var distanceMaterial = new THREE.MeshDistanceMaterial({
        alphaMap: material.alphaMap,
        alphaTest: material.alphaTest
      });
      sphere.customDistanceMaterial = distanceMaterial;
      return pointLight;
    }
   // var pointLight = createLight(0x0088ff);
   // pointLight.position.x=5;
   // pointLight.rotation.y= -Math.PI 
   // this.scene.add(pointLight);

    var spriteMap = new THREE.TextureLoader().load('/images/kruzof/magic.png');

    var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff ,depthWrite:true,blending:THREE.AdditiveBlending});

    this.glowBar = new THREE.Sprite(spriteMaterial);
    this.glowBar.material.opacity=0
    this.glowBar.scale.set(1, 1.4, 1)
    this.glowBar.position.x=6
    this.glowBar.position.y = -.25
    this.glowBar.position.z = 9.5
    this.scene.add(this.glowBar);
    this.glowBar.renderOrder = 4
    console.log(this.glowBar,'sprite')
    // Skin lights
    var skinAmbientLight = new THREE.AmbientLight(0xffffff, .2);
    this.skinLightBottom = new THREE.DirectionalLight(0xEAD6B7, .6);
    this.skinLightBack = new THREE.DirectionalLight(0x66A0F2,.2);
    this.skinLightTop = new THREE.DirectionalLight(0x66A0F2, .6);
    this.skinLightBottom.castShadow = true;
    skinAmbientLight.castShadow = true;
    skinAmbientLight.position.set(-300, -400, 400);
    this.skinLightBottom.position.set(20, -200, 0);
    this.skinLightBack.position.set(20, 200, -400);
    this.skinLightTop.position.set(0, 400, 0);

    //scene.add(light);
    this.scene.add(skinAmbientLight);
    //this.scene.add(skinLightTop);
    this.camera.add(this.skinLightTop)
    this.scene.add(this.skinLightBack);
    //this.scene.add(this.skinLightBottom);
    this.camera.add(this.skinLightBottom)
    var helper1 = new THREE.DirectionalLightHelper(this.skinLightBack, 5);
    //this.scene.add(helper1);
    var vector=new THREE.Vector3(0, -2.3, 0)
    var vector2 = new THREE.Vector3(0, -2.3, 0)
    var a = new THREE.Euler(-Math.PI / 2, 0,0, 'XYZ');
    var b = new THREE.Euler(Math.PI / 2, 0, 0, 'XYZ');
    var axis = new THREE.Vector3(1, 0, 0);
    var angle = -Math.PI / 2;
    vector.applyEuler(a)
    vector2.applyEuler(b )
    //vector.applyEuler(a)
    //vector2.applyEuler(a)
    this.skinClip = new THREE.Plane(vector, 1);
    this.boneClip = new THREE.Plane(vector2, 1);
    this.boneClip.translate(new THREE.Vector3(0, 0, -.87))
    this.boneClip.translate(new THREE.Vector3(0, 0, 2.3))
    this.skinClip.translate(new THREE.Vector3(0, 0, 2.3))
    var helper2 = new THREE.PlaneHelper(this.skinClip, 5, "#934");
    var helper = new THREE.PlaneHelper(this.boneClip, 5, 0xffff00);
    //this.scene.add(helper)
    //this.scene.add(helper2)
    this.renderer.localClippingEnabled = true;
    //skinLightBack.layers.set(2);
    //skinLightfront.layers.set(2);
   // skinLightBottom.layers.set(2);
   // skinAmbientLight.layers.set(2);
    //directionalLight2.rotation.x= directionalLight2.rotation.x+90
    //var helper = new THREE.AmbientLightHelper(ambientLight, 5);
    //scene.add(helper)
   // var helper = new THREE.DirectionalLightHelper(directionalLight1, 5);
    //scene.add(helper)
    
    
    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry(900, 10000);
    var groundMat = new THREE.MeshPhongMaterial({ color: 0x5d8193, specular: 0x050505 });
    groundMat.color.setHSL(0.095, 1, 0.75);
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -33;
    //this.scene.add(ground);

    // SKYDOME
    //var vertexShader = document.getElementById('vertexShader').textContent;
    //var fragmentShader = document.getElementById('fragmentShader').textContent;
    var uniforms = {
      topColor: { value: new THREE.Color('#15467b') },
      bottomColor: { value: new THREE.Color('#15467b') },
      offset: { value: 100 },
      exponent: { value: 4 }
    };
    //uniforms.topColor.value.copy(hemiLight.color);
    //this.scene.fog.color.copy(uniforms.topColor.value);
    var skyGeo = new THREE.SphereGeometry(2000, 32, 32);
    var skyMat = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide });
    var sky = new THREE.Mesh(skyGeo, skyMat);
    //sky.position.y=-1600
    this.scene.add(sky);

    var uniforms = {
      texture: { type: 't', value: THREE.ImageUtils.loadTexture('/images/kruzof/skybox3.jpg') }
    };
    var skyMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader, fragmentShader: fragmentShader
    });
    // create Mesh with sphere geometry and add to the scene
    var skyBox = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 32), skyMaterial);
    skyBox.scale.set(-1, 1, 1);
    //skyBox.eulerOrder = 'XZY';
    skyBox.renderDepth = 100.0;
    sky.rotation.x = -60
    //this.scene.add(skyBox);


    //this.scene.add(plane);

    //Particles
    var geometry = new THREE.Geometry();

    var textureLoader = new THREE.TextureLoader();

    var sprite1 = textureLoader.load("/images/kruzof/dust2.png");
  
    function getVertices(num,amount) {
      var geometry = new THREE.Geometry();

      for (var i = 0; i < amount; i++) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * num[0] - num[1];
        vertex.y = Math.random() * num[0] - num[1];
        vertex.z = Math.random() * num[0] - num[1];

        geometry.vertices.push(vertex);

      }
      return geometry
    }

    var parameters = [
      [[1.0, 0.2, 0.5], sprite1, .3, getVertices([50, 25],600)],
      [[0.95, 0.1, 0.5], sprite1, 1, getVertices([800, 400], 3000)],
      [[0.90, 0.05, 0.5], sprite1, 1, getVertices([800, 400], 3000)],
      [[0.85, 0, 0.5], sprite1, 1, getVertices([800, 400], 3000)],
      [[0.80, 0, 0.5], sprite1, 1, getVertices([300, 150], 3000)]
    ];

    for (i = 0; i < parameters.length; i++) {

      var color = parameters[i][0];
      var sprite = parameters[i][1];
      var size = parameters[i][2];

      materials[i] = new THREE.PointsMaterial({ size: size, map: sprite,  transparent: true, opacity: .8, depthWrite:false, fog:false});
      //materials[i].color.setHSL(color[0], color[1], color[2]);

      particles = new THREE.Points(parameters[i][3], materials[i]);

      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;
      //particles.geometry.renderOrder = 0
      particles.renderOrder = 0
      this.scene.add(particles);
      console.log(particles, 'particles')


    }

    //Sprites
    function generateTexture() {

      var canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;

      var ctx = canvas.getContext('2d');

      ctx.beginPath();
      ctx.arc(300, 300, 200, 0, 2 * Math.PI);
      ctx.lineWidth = 40;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.fillStyle = 'rgba(27,157,255,.25)';
      ctx.fill();

      return canvas;

    }
    var texture = new THREE.Texture(generateTexture());
    var map = new THREE.TextureLoader().load("/images/kruzof/hotspot.svg");
    texture.anisotropy = 0;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true; // important!

    this.boneMarkers = new THREE.Group();
    this.boneMarkers.name="Bone Markers"
    var materialC = new THREE.SpriteMaterial({ map: texture, color: 0xffffff, fog: true });
    var materialB = new THREE.SpriteMaterial({ map: texture, color: 0xffffff, fog: true, depthTest: true, transparent: true });
    var coordinate = {
      'Skull': { x: 3, y: .91, z: 2.6 },
      'Stylohyoid': { x: 0, y: -3.25, z: 4 },
      'Basihyoid': { x: 0, y: -4.5, z: 4 },
      'Cervical Vertebrae': { x: 0, y: 2, z: -.5 },
      'Thoracic Vertebrae': { x: 0, y: 2, z: -4 },
      'Sternum': { x: 0, y: -7, z: -1.5 },
      'Sternal Ribs': { x: 0, y: -7.5, z: -5 },
      'Ribs': { x: 0, y: -4.5, z: -9 },
      'Lumbar Vertebrae': { x: 0, y: .3, z: -14 },
      'Caudal Vertebrae': { x: 0, y: -6, z: -24 },
      'Pelvis': { x: 0, y: -6, z: -18 },
      'Chevrons': { x: 0, y: -10, z: -24 },
      'Scapula': { x: 4.6, y: -4, z: -3 },
      'Humerus': { x: 4.5, y: -6, z: -2.5 },
      'Radius': { x: 4.8, y: -8.5, z: -2 },
      'Ulna': { x: 5.4, y: -7.6, z: -3.5 },
      'Metacarpal': { x: 6.3, y: -9, z: -3.5 },
      'Digits': { x: 6.7, y: -10, z: -5.25 }
    }
    for (var key in coordinate) {
      var coordinates = coordinate[key]
      var x = Math.random() - 0.5;
      var y = Math.random() - 0.5;
      var z = Math.random() - 0.5;
      var material;
      if (z < 0) {
        material = materialB.clone();
      } else {
        material = materialB.clone();
        //material.color.setHSL(0.5 * Math.random(), 0.75, 0.5);
        //material.map.offset.set(-0.5, -0.5);
        //material.map.repeat.set(2, 2);
      }
      //material.blending = THREE.CustomBlending
      //material.blendSrc = THREE.OneFactor
      //material.blendDst = THREE.OneMinusSrcAlphaFactor

      var sprite = new THREE.Sprite(material);
      sprite.position.set(coordinates.x, coordinates.y, coordinates.z);
      //sprite.position.normalize();
      sprite.position.multiplyScalar(.5);
      sprite.name = key
      sprite.renderOrder = 2
      sprite.scale.set(.4, .4, 1);
      sprite.material.opacity=0
      this.boneMarkers.add(sprite);
    }
    
    this.boneMarkers.renderOrder = 3
    this.boneMarkers.position.z = this.boneMarkers.position.z + .25
    this.boneMarkers.rotation.x = 10.5 * (Math.PI /180)
    //this.boneMarkers.opacity=0
    this.state.boneMarkers=false
    document.getElementById('canvas').addEventListener('mousedown', onDocumentMouseDown, false);
    document.getElementById('canvas').addEventListener('touchstart', onDocumentMouseDown, false);
    document.getElementById('canvas').addEventListener('mouseup', onDocumentMouseUp, false);
    document.getElementById('canvas').addEventListener('touchend', onDocumentTouchEnd, false);
    //this.scene.add( helper );
  };

  OBJLoader2Example.prototype.initContent = function () {
    var modelName = 'Kruzof Skeleton';
    //this._reportProgress({ detail: { text: 'Loading ' + modelName } });

    var lambert = new THREE.MeshLambertMaterial({ depthWrite: false, color: 0x757575, transparent: true, opacity: .2, emissive: 0x3c3c3c, blending: THREE.AdditiveBlending })
    currentPage === 'kruzof' ? lambert = new THREE.MeshPhongMaterial({ color: '#6f6f6f' }) : lambert = new THREE.MeshPhongMaterial({ depthWrite: false, color: '#ffffff', transparent: true, opacity: 0, emissive: 0x3c3c3c, blending: THREE.AdditiveBlending  })
    lambert = new THREE.MeshStandardMaterial({ depthWrite: false, color: '#ffffff', transparent: true, opacity: 0,  blending: THREE.AdditiveBlending,roughness:.6,metalness:.2 })
    this.boneMatBump = new THREE.TextureLoader().load("images/kruzof/normal-best8k.jpg");
   //lambert = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .56, metalness: .2, })
    ///lamberto.normalMap=bump
    lambert.normalMap = this.boneMatBump
    //mesh.material = material
    /*var lamberto = new THREE.MeshLambertMaterial({ depthWrite: false, color: 0x757575, transparent: true, opacity: .2, emissive: 0x3c3c3c, blending: THREE.AdditiveBlending })*/
     //lamberto.clippingPlanes=[this.boneClip]
    //lambert.blending= THREE.AdditiveBlending
    var scope = this;
    var loaderAnimation = document.getElementById('loadAnimation')
    var lastLoadValue=100
    var buildProgress = function (event) {
      console.log('meee', event.detail.numericalValue, 100 - Math.floor(100 * event.detail.numericalValue))
     //tweenLoad((50 - Math.floor(100 * event.detail.numericalValue)), lastLoadValue)
      lastLoadValue = (50 - Math.floor(100 * event.detail.numericalValue))
      loaderAnimation.style.clipPath = "inset(0% " + (50 - Math.floor(100 * event.detail.numericalValue))+"% 0% 0%)" 
      //loaderAnimation.style.left = loaderAnimation.offsetLeft+(100 * event.detail.numericalValue)+'px'
      
    }
    var objLoader = new THREE.OBJLoader2();
    console.log(objLoader,'fucker')
    
    objLoader.meshBuilder.callbacks.onProgress = buildProgress
    var loadProgress = function (xhr) {
      console.log(100-(xhr.loaded / xhr.total * 50))
      //tweenLoad(Math.floor(100 - (xhr.loaded / xhr.total * 50)),lastLoadValue)
      lastLoadValue = Math.floor(100 - (xhr.loaded / xhr.total * 50))
      loaderAnimation.style.clipPath = "inset(0% " + (100 - (100 * Math.floor(xhr.loaded / xhr.total)) / 2 ) + "% 0% 0%)" 
      //loaderAnimation.style.left = loaderAnimation.offsetLeft+100 * (xhr.loaded / xhr.total) + 'px'
      console.log((xhr.loaded / xhr.total * 100) + '% loaded',xhr);
    }

    var puzzleEnter=function(){
      var timeOut=1300
      //var timeOut=20
      console.log(app.timers, 'TIMERS')
      if (Object.keys(app.timers).length =! 0 && app.timers.constructor== Object){
        app.timers.puzzleEnter=setTimeout(() => {
          
          var loader=document.getElementsByClassName('loader')[0]
          Velocity(
            loader,
            { opacity: 0 },
            {
              easing: [0.6, -0.58, 0.735, 0.045],
              duration: 350,
              complete: function (elements) {
                tweenOpacity(scope.orca, .15, document.body)
                loader.style.visibility = 'hidden'


              }
            }
          );
          //moveCamera(new THREE.Euler(18, 3, 1, 'XYZ'), 120)
          var targetPosition = new THREE.Vector3(18, 3, 1);
          //var targetPosition = new THREE.Vector3(26, 0, 8);
          var duration = 40;
          //var bonemapDelay=3000
          var bonemapDelay = 3200

          tweenCamera(targetPosition, 4000);
          Velocity(document.getElementById('bonemap'), { translateY: '400px' }, {
            duration: 0, easing: [.31, 0, .55, 1.16], complete: function (elements) { }
          })
          Velocity(document.getElementById('bonemap'), { translateY: '0px' }, {
            delay: bonemapDelay, duration: 600, easing: "easeOutQuad", complete: function (elements) {
              var step1 = document.getElementById("step1")
              app.timers.puzzleTutorial=setTimeout(() => {
              //step1._tippy.show()
              document.getElementById("step0").style.visibility = 'visible'
              app.controls.enabled = true;
              Velocity(document.getElementById("step0"), { opacity: 1, scale: [1, .9] }, { easing: [0.175, 0.885, 0.32, 1.575], duration: 350 });
              },300)
            }
          })
          
        }, timeOut);
      }
     

    }
    app.callbackOnLoad = function (event) {
      var callbackProgress =function(){
        console.log('parseprograss')
      }
      var object = event.detail.loaderRootNode
      console.log(object, 'object')
      object.traverse(function (child) {
        console.log(child.name, 'thechild')
        if (child instanceof THREE.Mesh) {
          //lamberto.depthWrite=true
          child.material = lambert;
         // child.material.normalMap=bump
          //child.material.normalScale = new THREE.Vector2( .9, .9);
          //child.material.depthWrite=true
          //console.log(child.material.depthWrite,'child')
        }
      });
      scope.orca = event.detail.loaderRootNode
      //scope.flashlight.target = scope.orca
      scope.scene.add(scope.orca);
      scope.orca.add(scope.boneMarkers);
      scope.boneMarkers.renderOrder = 3
      console.log(scope.orca,'orca')
     // scope.orca.layers.set(1);
     // document.getElementsByClassName('loader')[0].classList.add('fade')
     // Velocity(document.getElementById('bonemap'), { translateY: '500px' }, { duration: 0 })
     
     puzzleEnter()
      
     
      currentPage === 'kruzofpuzzle' ? scope.orca.position.set(0, 3, 4) : null
      //scope.orca.children[0].renderOrder = 2
      scope.orca.renderOrder = 2
      var renderer = scope.renderer
      console.log(scope.orca, 'orca', event.detail)
      //scope.orca.children[0].onBeforeRender = function (renderer) {console.log('cleardepthssssss') ; renderer.clearDepth(); };
      console.log('Loading complete: ' + event.detail.modelName);
      scope._reportProgress({ detail: { text: '' } });
      console.log(event)
    };
    //this.renderer.clearDepth();


    objLoader.setUseIndices(true);
    objLoader.setDisregardNormals(false);
    //objLoader.getLogger().setDebug(true);
    objLoader.load('images/kruzof/kruzof-best-1-unwrapb.obj', app.callbackOnLoad, loadProgress, null, null, true);

    //objLoader.load('obj/woolly_mammoth/orca_skull.obj', callbackOnLoadBones, null, null, null, false);
    //objLoader.load('obj/woolly_mammoth/orca_spine.obj', callbackOnLoadBones, null, null, null, false);

    var onLoadMtl = function (materials) {
      objLoader.setModelName(modelName);
      //objLoader.setMaterials( materials );
      objLoader.setUseIndices(true);
      objLoader.setDisregardNormals(false);
      //objLoader.getLogger().setDebug(true);
      //	objLoader.load( 'obj/woolly_mammoth/orca_origin2.obj', callbackOnLoad, null, null, null, false );
    };

    // Load orca skin
    function loadSkin(){
      var meshes = [], mixers = []
      scope.skinGroup = new THREE.Group();
      scope.skinGroup.renderOrder = 1
      scope.mixers=[],scope.actions=[]
      var clock = new THREE.Clock;
      var loader = new THREE.JDLoader();
      console.log(loader,'jdloader')
      loader.load("js/orcaswim3.JD",
        function (data) {
          for (var i = 0; i < data.objects.length; ++i) {
            if (data.objects[i].type == "Mesh" || data.objects[i].type == "SkinnedMesh") {
              var mesh = null;
              var matArray = createMaterials(data);
              if (data.objects[i].type == "SkinnedMesh") {
                mesh = new THREE.SkinnedMesh(data.objects[i].geometry, matArray);
                mesh.receiveShadow = true;
                console.log(mesh.material, 'mesherer')
               
                
                
              }
              else // Mesh
              {
                mesh = new THREE.Mesh(data.objects[i].geometry, matArray);
              }
              if (data.objects[i].geometry.name != 'Arrows_CNT01') {
                scope.skinGroup.add(mesh)
                //mesh.scale.set(.1,.1,.1)
                meshes.push(mesh);
              }
             
             // scope.scene.add(mesh);


              if (mesh && mesh.geometry.animations) {
                var mixer = new THREE.AnimationMixer(mesh);
                scope.mixers.push(mixer);
                scope.actions.push(mixer.clipAction(mesh.geometry.animations[0]))
                //action.play();
              }
            }
            else if (data.objects[i].type == "Line") {
              var jd_color = data.objects[i].jd_object.color;
              var color1 = new THREE.Color(jd_color[0] / 255, jd_color[1] / 255, jd_color[2] / 255);
              var material = new THREE.LineBasicMaterial({ color: color1 }); //{ color: new THREE.Color( 0xff0000 ) }
              var line = new THREE.Line(data.objects[i].geometry, material);
              scope.scene.add(line);

              if (line.geometry.animations) {
                var mixer = new THREE.AnimationMixer(line);
                scope.mixers.push(mixer);
                var action = scope.mixer.clipAction(line.geometry.animations[0]);
                action.play();
              }
            }
            
          }
          console.log(scope.skinGroup,'skin')
          for (var i = 0; i < scope.skinGroup.children.length; ++i) {
            for (var e = 0; e < scope.skinGroup.children[i].material.length; ++e) {
              scope.skinGroup.children[i].renderOrder = 1
             //console.log(mesh, 'mesherer')
              //scope.skinGroup.children[i].material[e].clippingPlanes = [scope.skinClip]
              scope.skinGroup.children[i].material[e].transparent = true
              scope.skinGroup.children[i].material[e].opacity=0
              scope.skinGroup.children[i].material[e].depthWrite = false
              //scope.skinGroup.children[i].material[e].side = THREE.BackSide
            }
          }
          var scaleValue=.048
          scope.skinGroup.scale.set(scaleValue, scaleValue, scaleValue)
          scope.skinGroup.rotation.y = Math.PI
          scope.skinGroup.position.set(-3.25,3.2,-8.25)
        
            for (var i = 0; i < scope.actions.length; ++i) {
              scope.actions[i].play()
              scope.actions[i].paused = true
            }
       
          setTimeout(() => {
            for (var i = 0; i < scope.actions.length; ++i) {
             // scope.actions[i].paused = false
              //scope.actions[i].play()
              //scope.actions[i].paused = true
            }
          }, 70000);
       
          var near = 1, far = 10000;
          //camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, near, far);
          //scope.camera.position.z = data.boundingSphere.center.z + 2.5 * data.boundingSphere.radius;
          //scope.camera.lookAt(data.boundingSphere.center);
         // scope.camera.add(new THREE.DirectionalLight(0xFFFFFF, 1));
          //scene.add(camera);

          
           // controls = new THREE.OrbitControls(camera, renderer.domElement);
          //scope.controls.target.copy(data.boundingSphere.center);
          scope.scene.add(scope.skinGroup);
          console.log('skin added', scope.skinGroup)
          
          setTimeout(() => {
            //var sectionHelper = new THREE.SectionHelper(scope.skinGroup.children[0], "#000");
          //sectionHelper.material.clippingPlanes = [scope.skinClip]
          //sectionHelper.position.set(3.25, 3.2, -8.25)
         // scope.scene.add(sectionHelper);
          },2000)
          
        });
      scope.limit = false
   

    function createMaterials(data) {
      var matArray = [];
      for (var j = 0; j < data.materials.length; ++j) {
        var mat = new THREE.MeshPhongMaterial({});
        mat.specular.color = "0x484848"
        mat.shininess = 75
        mat.copy(data.materials[j]);
        //mat.transparent = true;
        matArray.push(mat);
      }
      return matArray;
    }
  }

  // Load Skin
    currentPage === 'kruzof' ? null : loadSkin()
    //currentPage === 'kruzof' ? null : {}
    // Endgame Function

    this.tweenPosition= function(object,targetPos,domElement){
      //app.skinGroup.position.set(-3.25, .75, -8.25)
    
      console.log('tweenPosition', object.position, app.skinGroup.position,targetPos)
      var initialX, initialY, initialZ, initialBones, initialBonesZ, initialRot
      
      initialX = object.position.x
      initialY = object.position.y
      initialZ = object.position.z
  
      var deltaX, deltaY, deltaZ,
        deltaX = (object.position.x + targetPos.x)  - initialX
      deltaY = (object.position.y + targetPos.y)  - initialY
      deltaZ = (object.position.z + targetPos.z)  - initialZ
     console.log(initialZ,deltaZ)

      Velocity(
        domElement,
        {
          tween: [1, 0]
        },
        {
          duration: 800,
          easing: "easeInOutQuad",
          progress: function (
            elements,
            complete,
            remaining,
            current,
            tweenValue
          ) {
            //console.log('settingux')
           // console.log(initialZ, deltaZ, object.position.z)
            object.position.setX(initialX + deltaX * tweenValue);
            object.position.setY(initialY + deltaY * tweenValue);
            object.position.setZ(initialZ + deltaZ * tweenValue);
            
          
          },
          complete: function (elements) {

          }
        });
      
    }
    this.resetGame =function(resetBones,state,moveKruzof){
      //app.state.endGame = false
      var targetPosition = new THREE.Vector3(18, 3, 1);
      var duration = 3000
      
      moveKruzof == true ? tweenCamera(targetPosition, duration, false): {}
      Velocity(document.getElementById('bonemap'), { translateY: '400px' }, {
        duration: 1200, easing: [0.6, -0.18, 0.735, 0.045], complete: function (elements) { }
      })
      var boneOpacity,skinOpacity
      if (state == 'bones'){
        skinOpacity = 0
        boneOpacity = 1
      }else{
        skinOpacity = 1
        boneOpacity = 0
      }

      // Opacity animation order by state
      if(state == 'bones'){
        app.tweenOpacity(app.skinGroup, skinOpacity, document.getElementsByTagName('DIV')[0])
        resetBones == true ? app.tweenOpacity(app.orca, boneOpacity, document.getElementsByTagName('DIV')[0]) : {}
      }else{
        resetBones == true ? app.tweenOpacity(app.orca, boneOpacity, document.getElementsByTagName('DIV')[0]) : {}
        app.tweenOpacity(app.skinGroup, skinOpacity, document.getElementsByTagName('DIV')[0])
      }

      // Reset Lights
    
      var initialBottomIntensity = app.skinLightBottom.intensity
      var tweenSkinPos = function () {
        //app.skinGroup.position.set(-3.25, .75, -8.25)
        var initialX, initialY, initialZ, initialBones, initialBonesZ, initialRot
        initialX = app.skinGroup.position.x
        initialY = app.skinGroup.position.y
        initialZ = app.skinGroup.position.z
        initialBones = app.orca.position.y
        initialBonesZ = app.orca.position.z
        initialRot = app.orca.rotation.x
        var deltaX, deltaY, deltaZ, deltaBones, deltaBonesZ
        deltaX = 0 - initialX

        deltaY = (app.skinGroup.position.y+app.end.transform.y) - initialY
        deltaZ = (app.skinGroup.position.z - app.end.transform.zSkin + -1.5)   - initialZ
        deltaBones = (app.orca.position.y + app.end.transform.y*2 ) - initialBones
        deltaBonesZ = (app.orca.position.z - app.end.transform.zBones) - initialBonesZ

        Velocity(
          // Just some dom element to emulate tween
          document.getElementsByClassName('loader')[0],
          {
            tween: [1, 0]
          },
          {
            duration: 1400,
            easing: "easeInOutQuad",
            progress: function (
              elements,
              complete,
              remaining,
              current,
              tweenValue
            ) {
              if(moveKruzof == true){
              //console.log('settingux')
                app.skinGroup.position.setY(initialY + deltaY * tweenValue);
                app.skinGroup.position.setZ(initialZ + deltaZ * tweenValue);
                app.orca.position.setY(initialBones + deltaBones * tweenValue);
                app.orca.position.setZ(initialBonesZ + deltaBonesZ * tweenValue);
              }
              if (state == 'skin') {
                app.skinLightBottom.intensity = initialBottomIntensity - .6 * tweenValue;
                app.skinLightBack.intensity = .2 + 1 * tweenValue;
              }else{
                app.skinLightBottom.intensity = initialBottomIntensity + .6 * tweenValue;
                app.skinLightBack.intensity = 1 - .8 * tweenValue;
              }

            },
            complete: function (elements) {
              if (state == 'bones') {
                scope.camera.add(app.skinLightBottom)
                scope.camera.add(app.skinLightTop)
                scope.scene.remove(app.skinLightBottom)
                scope.scene.remove(app.skinLightTop)
                for (var i = 0; i < app.actions.length; ++i) {
                  //app.actions[i].play()
                  app.actions[i].stop()
                  app.actions[i].play()
                  app.actions[i].paused = true

                }
              }else{
                scope.camera.remove(app.skinLightBottom)
                scope.camera.remove(app.skinLightTop)
                scope.scene.add(app.skinLightBottom)
                scope.scene.add(app.skinLightTop)
                for (var i = 0; i < app.actions.length; ++i) {
                  //app.actions[i].play()
                  app.actions[i].stop()
                  app.actions[i].play()
                  app.actions[i].paused = false

                }
              }

            }
          });
        }
        
      tweenSkinPos()

    }
    this.endGame = function () {
      //app.state.endGame=true
      var targetPosition = new THREE.Vector3(19, 0, 19);
      var duration = 3000
      tweenCamera(targetPosition, duration, true);
      Velocity(document.getElementById('bonemap'), { translateY: '400px' }, {
        duration: 1200, easing: [0.6, -0.18, 0.735, 0.045], complete: function (elements) { }
      })
      var tweenSkinPos = function () {
        //app.skinGroup.position.set(-3.25, .75, -8.25)
        var initialX, initialY, initialZ, initialBones,initialBonesZ,initialRot
        initialX = app.skinGroup.position.x
        initialY = app.skinGroup.position.y
        initialZ = app.skinGroup.position.z
        initialBones = app.orca.position.y
        initialBonesZ = app.orca.position.z
        initialRot= app.orca.rotation.x
        var deltaX, deltaY, deltaZ,deltaBones,deltaBonesZ
        deltaX = 0 - initialX
        deltaY = app.end.transform.y - initialY
        deltaZ = (app.skinGroup.position.z + app.end.transform.zSkin) - initialZ
        deltaBones = app.end.transform.y - initialBones
        deltaBonesZ = (app.orca.position.z + app.end.transform.zBones) - initialBonesZ

        Velocity(
          // Just some dom element to emulate tween
          document.body,
          {
            tween: [1, 0]
          },
          {
            duration: 1400,
            easing: "easeInOutQuad",
            progress: function (
              elements,
              complete,
              remaining,
              current,
              tweenValue
            ) {
              //console.log('settingux')
              app.skinGroup.position.setY(initialY + deltaY * tweenValue);
              app.skinGroup.position.setZ(initialZ + deltaZ * tweenValue);
              app.orca.position.setY(initialBones + deltaBones * tweenValue);
              app.orca.position.setZ(initialBonesZ + deltaBonesZ * tweenValue);
              //app.orca.rotation.x = initialRot + .05 * tweenValue;
              // app.skinGroup.position.set(initialX + deltaX * tweenValue, initialY + deltaY * tweenValue, initialZ + deltaZ * tweenValue)


            },
            complete: function (elements) {
              console.log(app.skinGroup.position,'skinpos')
            }
          });
      }
      tweenSkinPos()

    }
    this.growSkin = function () {

      var tweenSkinPos = function(){
        //app.skinGroup.position.set(-3.25, .75, -8.25)
        var initialZ
        initialZ = app.skinGroup.position.z
        var deltaZ
        deltaZ = (app.skinGroup.position.z + 1.5) - initialZ

        Velocity(
          document.body,
          {
            tween: [1, 0]
          },
          {
            duration: 2000,
            easing: "easeInOutQuad",
            progress: function (
              elements,
              complete,
              remaining,
              current,
              tweenValue
            ) {
              app.skinGroup.position.setZ(initialZ + deltaZ * tweenValue);
            }
           
          });
      }
     // app.glowBar.material.opacity=1
      var initialGlowPos=app.glowBar.position.z
      var initialGlowPosY = app.glowBar.position.y
      var newGlowScale;
      var initialGlowScale=app.glowBar.scale.y
      var initialBone = this.boneClip.constant
      var initialSkin = this.skinClip.constant
      var initialBottomIntensity=app.skinLightBottom.intensity
      var initialOpacity= 0
      var initialOpacityBone=1
      var deltaSkin, deltaBone,deltaO,deltaBoneO, deltaGlow
      deltaSkin = 7- initialSkin
      deltaBone = 7 + initialBone
      deltaO= 1 - 0
      deltaBoneO=0-1
      deltaGlow = -11 - initialGlowPos
      for (var i = 0; i < scope.orca.children.length; ++i) {
        //scope.orca.children[i].material=lamberto
      }
      for (var i = 0; i < app.actions.length; ++i) {
        //app.actions[i].play()
        //app.actions[i].paused = false

      }
      scope.scene.add(app.skinLightBottom)
      scope.scene.add(app.skinLightTop)
      scope.camera.remove(app.skinLightBottom)
      scope.camera.remove(app.skinLightTop)
      Velocity(
        document.body,
        {
          tween: [1, 0]
        },
        {
          duration: 1400,
          easing: "easeInQuad",
          progress: function (
            elements,
            complete,
            remaining,
            current,
            tweenValue
          ) {
            //console.log(scope.orca.children,'chi')
            for (var i = 0; i < scope.orca.children.length; ++i) {
              if (scope.orca.children[i].material){

              }
              if (!scope.orca.children[i].material) {
                // Skip boneMarker Sprites
                continue
              }
              
              
              //console.log(mesh, 'mesherer')
              if(scope.orca.children[i].material){
              scope.orca.children[i].material.transparent = true
            //scope.orca.children[i].material.depthWrite= false
              scope.orca.children[i].material.opacity = initialOpacityBone - deltaO * tweenValue
              } else if(scope.orca.children[i].children.length>1){
                for (var e = 0; e < scope.orca.children[i].children.length; ++e) {
                  scope.orca.children[i].children[e].material.opacity = initialOpacityBone - deltaO * tweenValue
                }
              }

              
            }
            for (var i = 0; i < scope.skinGroup.children.length; ++i) {
              
              for (var e = 0; e < scope.skinGroup.children[i].material.length; ++e) {
                //console.log(mesh, 'mesherer')
                scope.skinGroup.children[i].material[e].depthWrite=true
              
                scope.skinGroup.children[i].material[e].alphaTest = true
                scope.skinGroup.children[i].material[e].opacity=initialOpacity + deltaO * tweenValue
              }
            }
           
       
            app.skinLightBottom.intensity = initialBottomIntensity -.6* tweenValue;
            app.skinLightBack.intensity= .2 + 1*tweenValue;
            if(tweenValue>.75){
              for (var i = 0; i < scope.orca.children.length; ++i) {
                if (!scope.orca.children.material) {
                  //continue
                }
                scope.orca.children[i].material?scope.orca.children[i].material.depthWrite = false:null
              }
            }
            /*
            app.skinClip.constant = initialSkin + deltaSkin *tweenValue
            app.boneClip.constant = initialBone - deltaBone * tweenValue
            app.glowBar.position.z = initialGlowPos + deltaGlow * tweenValue
            app.glowBar.position.y = initialGlowPosY + -1.4 * tweenValue
            if (tweenValue<.4) {
              newGlowScale = app.glowBar.scale.y
              app.glowBar.scale.y = initialGlowScale + 20 * tweenValue
            } else if (tweenValue > .4){
              app.glowBar.scale.y = newGlowScale - 15 * (tweenValue-.4)
            }*/
          },
          complete: function (elements) {
            app.glowBar.material.opacity =0
            for (var i = 0; i < scope.orca.children.length; ++i) {
              //scope.orca.children[i].material.depthWrite = false
            }
            for (var i = 0; i < app.actions.length; ++i) {
              //app.actions[i].play()
              app.actions[i].paused = false
              
            }
            tweenSkinPos()
          }
        });
    }

    //objLoader.loadMtl( 'obj/female02/female02.mtl', 'female02.mtl', null, onLoadMtl );
  };

  OBJLoader2Example.prototype._reportProgress = function (event) {
    var output = Validator.verifyInput(event.detail.text, '');
    console.log('Progress: ' + output);
    document.getElementById('feedback').innerHTML = output;
  };

  OBJLoader2Example.prototype.resizeDisplayGL = function () {
    //this.controls.handleResize();

    this.recalcAspectRatio();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);

    this.updateCamera();
  };

  OBJLoader2Example.prototype.recalcAspectRatio = function () {
    this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
  };

  OBJLoader2Example.prototype.resetCamera = function () {
    this.camera.position.copy(this.cameraDefaults.posCamera);
    this.cameraTarget.copy(this.cameraDefaults.posCameraTarget);

    this.updateCamera();
  };

  OBJLoader2Example.prototype.updateCamera = function () {
    this.camera.aspect = this.aspectRatio;
    this.camera.lookAt(this.cameraTarget);
    this.camera.updateProjectionMatrix();
  };
  
  OBJLoader2Example.prototype.render = function () {
    if (!this.renderer.autoClear) this.renderer.clear();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    //console.log(this.group)
    var camera = this.camera
    var time = Date.now() * 0.000002;
    for (i = 0; i < this.scene.children.length; i++) {

      var object = this.scene.children[i];

      if (object instanceof THREE.Points) {

        object.rotation.y = time * (i < 4 ? i + 1 : - (i + 1));

      }

    }
   /*
    if (this.boneClip.constant > -8 && this.limit == false){
      this.boneClip.constant = this.boneClip.constant-.05
      this.skinClip.constant = this.skinClip.constant + .05
    } else {
    this.limit =true
    }
    if (this.boneClip.constant < 5 && this.limit == true) {
      this.boneClip.constant = this.boneClip.constant + .05
      this.skinClip.constant = this.skinClip.constant - .05
    } else {
      this.limit = false
    }*/

    this.boneMarkers.children.forEach(function (sprite) {
      var scaleVector = new THREE.Vector3();
      var scaleFactor = 24;
      // var sprite = planet.children[0];
      var scale = scaleVector.subVectors(sprite.position, camera.position).length() / scaleFactor;
      // sprite.scale.set(scale, scale, 1); 
    })
  };




  return OBJLoader2Example;

})();

var app = new OBJLoader2Example(document.getElementById('example'));

// Touch Tracking //////////////////////////////////////////////////////////////
/////////
// Finds the array index of a touch in the app.currentTouches array.
app.currentTouches = new Array
app.findCurrentTouchIndex
app.findCurrentTouchIndex = function (id) {
  for (var i = 0; i < app.currentTouches.length; i++) {
    if (app.currentTouches[i].id === id) {
      return i;
    }
  }
  // Touch not found! Return -1.
  return -1;
};

// Bone Map Image Drag Function
app.dragListener = function (e) {
  console.log('APP DRAGGIND')
  // console.log(app.selectedBone.clientWidth,boneDrag.style.width,'drag',event.changedTouches)
  var touches = event.changedTouches;
  /*
  if (!touches) {
    var x, y
    x = e.pageX;
    y = e.pageY
    boneDrag.style.left = x + 20 - boneDrag.clientWidth / 2 + "px";
    boneDrag.style.top = y - boneDrag.clientHeight / 2 + "px";
  }/*/

  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    console.log('DRAGBONEMAP', touch)
    var currentTouchIndex = app.findCurrentTouchIndex(touch.identifier);

    if (currentTouchIndex >= 0 && app.currentTouches[currentTouchIndex].isBoneMap) {
      console.log(e.pageX, e.pageY, event.changedTouches)
      var currentTouch = app.currentTouches[currentTouchIndex];
      var boneDrag = currentTouch.object
      boneDrag.style.left = touch.pageX + 20 - boneDrag.clientWidth / 2 + "px";
      boneDrag.style.top = touch.pageY - boneDrag.clientHeight / 2 + "px";

      currentTouch.pageX = touch.pageX;
      currentTouch.pageY = touch.pageY;

      // Store the record.
      app.currentTouches.splice(currentTouchIndex, 1, currentTouch);
    }

  }

};


var resizeWindow = function () {
  app.resizeDisplayGL();
};
var clock = new THREE.Clock;
var render = function () {
  var delta = clock.getDelta();
  if (app.mixers){
  for (var i = 0; i < app.mixers.length; ++i)
    app.mixers[i].update(delta);
  }
  app.renderRequest=requestAnimationFrame(render);
  app.render();
};
var activeMarker,activeBoneHighlight

function onDocumentTouchEnd(event) {

  event.preventDefault();
  console.log(event.changedTouches, 'UPEVENT')
  //document.removeEventListener('touchmove', app.dragListener)
  var touches = event.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var currentTouchIndex = app.findCurrentTouchIndex(touch.identifier);

    if (currentTouchIndex >= 0) {
      var currentTouch = app.currentTouches[currentTouchIndex];
      if (currentTouch.isBoneMap == true){
      Velocity(document.getElementById(event.target.dataset.bone +'boneDrag'), { opacity: 0, scale:1}, { duration: 300 })
      }
      event = event.changedTouches[0]

      var _domElement = app.renderer.domElement
      var rect = _domElement.getBoundingClientRect();
      var _mouse = {}
      _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
      console.log(app, 'moueup', _mouse.x, _mouse.y)
      var y
      event.changedTouches ? y = event.changedTouches[0].screenY : y = event.pageY
      if (currentTouch.isBoneMap ==true && y < (window.innerHeight - 300)) {
        console.log('FUUUUUUUUUUUUUUUCKKKKKKK', currentTouch)
        //app.boneGrabbed = false
        app.addBoneEvent(currentTouch.boneDiv, _mouse.x, _mouse.y)
      }else{
        app.boneGrabbed = false
      }
      app.currentTouches.splice(currentTouchIndex, 1);
    } else {
      console.log('Touch was not found!');
    }
  }
  if (app.currentTouches.length == 0) {
    //document.removeEventListener("mousemove", app.dragListener);
    //document.removeEventListener("touchmove", app.dragListener);
   
  }

}
function onDocumentMouseUp(event) {
  event.preventDefault();
  console.log(event.changedTouches,'UPEVENT')
  Velocity(document.getElementById(event.target.dataset.bone+'boneDrag'), { opacity: 0 ,scale:1}, { duration: 300 })
  document.removeEventListener('mousemove', app.dragListener)
  var  _domElement=app.renderer.domElement
  var rect = _domElement.getBoundingClientRect();
  var _mouse={}
   _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
   _mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
  console.log(app, 'moueup',_mouse.x,_mouse.y)
  var y
  event.changedTouches ? y = event.changedTouches[0].screenY : y = event.pageY
  if( y < (window.innerHeight - 300)){
      console.log('DROPBONE',window)
    app.boneGrabbed = false
    app.addBoneEvent(app.selectedBone,_mouse.x,_mouse.y)
  }else{
    app.boneGrabbed = false
  }
}

function onDocumentMouseDown(event) {
  console.log(app,'dddd')
  event.preventDefault();
  if (app.state.boneMarkers==true){
    var intersectSprite
    var _domElement = app.renderer.domElement
    var rect = _domElement.getBoundingClientRect();
    console.log(event.changedTouches,event,'event')
    if (event.changedTouches){
      event = event.changedTouches[0]
      var mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      var mouseY = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
    }else{
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    console.log(mouseX,mouseY,'mouse')
    var vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    app.projector.unprojectVector(vector, app.camera);
    var raycaster = new THREE.Raycaster(app.camera.position, vector.sub(app.camera.position).normalize());
    //var intersects = raycaster.intersectObjects(app.group.children, true);
    var intersects=[]
    //intersects = raycaster.intersectObjects(app.orca.children, true);
    //currentPage === 'kruzofpuzzle' ?  intersects = raycaster.intersectObjects(app.orca.children, true) : null
    intersects = raycaster.intersectObjects(app.orca.children, true)
    console.log(intersects, 'intersects', app.orca.children)
    // Animate markers
    function tweenMarker(x, y, z, marker, domElement) {
      var startingX = marker.scale.x;
      var startingY = marker.scale.y;
      var startingZ = marker.scale.z;
      var deltaX = x - startingX;
      var deltaY = y - startingY;
      var deltaZ = z - startingZ;
      var canvas = document.getElementById('example')
      console.log(canvas, 'canvas')
      Velocity(domElement, {
        tween: [1, 0]
      }, {
          easing: "spring", duration: 400,
          progress: function (elements, complete, remaining, current, tweenValue) {
            marker.scale.x = startingX + (deltaX * tweenValue);
            marker.scale.y = startingY + (deltaY * tweenValue);
            marker.scale.z = startingZ + (deltaZ * tweenValue);
          }
        });
    }

    var intersectsFound = []
    function intersectsSprite(intersects){
      
      if (intersects.length > 0 ){
        for (var i=0; i < intersects.length; ++i){
          intersects[i].object.type == "Sprite" ? intersectSprite = intersects[i].object : null
          break
        }
      }
      //activeMarker =intersectSprite
      if (intersectSprite != undefined) {
        return true
      }else{
        return false
      }
    
    }
    if (intersects.length > 0 && intersectsSprite(intersects) ) {
      
      var boneName = intersects[0].object.name;
      console.log(intersects,'intersets')
      
      //tween Previous Marker
      if (app.activeMarker != undefined) {
        console.log('lastmarkertweeen')
        tweenMarker(.4, .4, .4, app.activeMarker, document.getElementById('example'))
        var lambert = new THREE.MeshLambertMaterial({ color: '#6f6f6f' })
        if (app.orca.getObjectByName(app.activeMarker.name.split(' ').join('_'))) {
          //app.orca.getObjectByName(activeMarker.name.split(' ').join('_')).material.color=0x000000
          console.log(app.activeBones,'activebones')
          if (app.bonesLeft.indexOf(app.activeMarker.name.split(' ').join('_'))== -1){
            app.orca.getObjectByName(app.activeMarker.name.split(' ').join('_')).material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .56, metalness: .2,normalMap:app.boneMatBump })
          }else{
            app.orca.getObjectByName(app.activeMarker.name.split(' ').join('_')).material = new THREE.MeshStandardMaterial({ depthWrite: false, color: '#ffffff', transparent: true, opacity: .15, blending: THREE.AdditiveBlending, roughness: .6, metalness: .2 })
          } 
          //app.orca.getObjectByName(app.activeMarker.name.split(' ').join('_')).material = app.activeBoneHighlight
        }
      }
      if (app.orca.getObjectByName(boneName.split(' ').join('_'))) {
        app.activeBoneHighlight = app.orca.getObjectByName(boneName.split(' ').join('_')).material
        var newlambert = new THREE.MeshStandardMaterial({ color: '#7dff9c', emissive:"#1a331f",roughness: .5, metalness: .1 })
        newlambert.normalMap=app.boneMatBump
        app.orca.getObjectByName(boneName.split(' ').join('_')).material = newlambert
       // app.orca.getObjectByName(boneName.split(' ').join('_')).material.color = newlambert.color
      }
      app.activeMarker = intersectSprite
      tweenMarker(1, 1, 1, intersectSprite, document.body)
      console.log(intersects[0].object, app.orca, 'orca');  // <======== CHANGED
      var info = document.getElementById('boneName')
      Velocity(info, { translateY: [-10, 0], opacity: 0 }, {
        duration: 300, easing: 'easeOutBack',
        complete: function (elements) {
          console.log(info, elements, 'toooo'); info.innerHTML = intersects[0].object.name.replace('_', " ");

        }
      })
      Velocity(info, { translateY: [10, 0] }, { duration: 0 })
      Velocity(info, { translateY: [0, 10], opacity: 1 }, {
        duration: 300, easing: 'easeOutBack',
      })
      //document.getElementById('info').innerHTML = intersects[0].object.name;
    }
  }
}

window.addEventListener('resize', resizeWindow, false);

console.log('Starting initialisation phase...');
app.initGL();
app.resizeDisplayGL();
app.initContent();

render();