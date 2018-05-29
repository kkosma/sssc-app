
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


var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, sprite, size;
var currentPage = document.getElementsByClassName("container")[0].getAttribute('data-current')
//console.log(document.getElementsByClassName("container")[0].getAttribute('data-current'),'this')


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
      posCamera: new THREE.Vector3(0.0, 100.0, 300.0),
      posCameraTarget: new THREE.Vector3(50, 620, 120),
      near: 0.1,
      far: 20000,
      fov: 45,

    };
    this.camera = null;
    this.cameraTarget = this.cameraDefaults.posCameraTarget;

    this.controls = null;
  }

  OBJLoader2Example.prototype.initGL = function () {

    ///Animate position
    // linear interpolation function
    function lerp(a, b, t) { return a + (b - a) * t }

    var t = 0, dt = 0.01,                   // t (dt delta for demo)
      a = { x: -.5, y: -1, z: -1 },          // start position
      b = { x: 1.5, y: 0.5, z: 0.7 };       // end position

    function loop() {
      var newX = lerp(a.x, b.x, ease(t));   // interpolate between a and b where
      var newY = lerp(a.y, b.y, ease(t));   // t is first passed through a easing
      var newZ = lerp(a.z, b.z, ease(t));   // function in this example.
      mesh.position.set(newX, newY, newZ);  // set new position
      t += dt;
      if (t <= 0 || t >= 1) dt = 0;        // ping-pong for demo
      renderer.render(scene, cam);
      requestAnimationFrame(loop)
    }

    // example easing function (quadInOut, see link above)
    function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      autoClear: true,
      sortObjects: true,
      alpha: true
    });
    //this.renderer.setClearColor( 0xb7b7b7);

    this.scene = new THREE.Scene();
    this.projector = new THREE.Projector();
    //this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    this.scene.fog = new THREE.Fog(this.scene.background, 1, 1000);
    //this.scene = new THREE.FaceColors()

    this.camera = new THREE.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
    this.resetCamera();
    currentPage === 'kruzof' ? this.camera.position.set(-10, 5, 10) : this.camera.position.set(-13, 10, 10), this.camera.rotation.x = 90 * Math.PI / 180
    this.camera.fov = 45
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
    this.controls.zoomSpeed = .25
    this.zoomDampingFactor = 0.1;

    this.materialCameraPosition = this.camera.position.clone();
    this.materialCameraPosition.z += 10;

    //var ambientLight = new THREE.AmbientLight( 0xFFB475 );
    var ambientLight = new THREE.AmbientLight(0xFFffff);
    //var directionalLight1 = new THREE.DirectionalLight( 0xC4BFA9 );
    //var directionalLight2 = new THREE.DirectionalLight( 0xB8EEFF );
    var directionalLight1 = new THREE.DirectionalLight(0xC4BFA9);
    var directionalLight2 = new THREE.DirectionalLight(0xB8EEFF);
    directionalLight1.castShadow = true;
    ambientLight.castShadow = true;

    directionalLight1.position.set(200, -150, 200);
    directionalLight2.position.set(-200, 150, -200);
    var light = new THREE.HemisphereLight(0x5d8193, 0x080820, .3);
    //scene.add(light);
    this.scene.add(directionalLight1);
    this.scene.add(directionalLight2);
    this.scene.add(ambientLight);
    // LIGHTS
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.57, .6, 0.7);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    hemiLight.castShadow = true;
    this.scene.add(hemiLight);
    var hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    //this.scene.add(hemiLightHelper);

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
      topColor: { value: new THREE.Color('#99d8ec') },
      bottomColor: { value: new THREE.Color('#15467b') },
      offset: { value: 100 },
      exponent: { value: 4 }
    };
    uniforms.topColor.value.copy(hemiLight.color);
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
      ctx.fillStyle = 'rgba(41,171,226,.25)';
      ctx.fill();

      return canvas;

    }
    var texture = new THREE.Texture(generateTexture());
    var map = new THREE.TextureLoader().load("/images/kruzof/hotspot.svg");
    texture.anisotropy = 0;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true; // important!

    this.group = new THREE.Group();
    var materialC = new THREE.SpriteMaterial({ map: texture, color: 0xffffff, fog: true });
    var materialB = new THREE.SpriteMaterial({ map: texture, color: 0xffffff, fog: true, depthTest: true, transparent: true });
    var coordinate = {
      'Skull': { x: 3, y: .91, z: 2.6 },
      'Stylohyoid': { x: 0, y: -3.25, z: 4.25 },
      'Basihyoid': { x: 0, y: -4.5, z: 4.25 },
      'Cervical Vertebrae': { x: 0, y: 2, z: -.5 },
      'Thoracic Vertebrae': { x: 0, y: 2, z: -4 },
      'Sternum': { x: 0, y: -7, z: -1.5 },
      'Sternal Ribs': { x: 0, y: -7.5, z: -5 },
      'Ribs': { x: 0, y: -4.5, z: -9 },
      'Lumbar Vertebrae': { x: 0, y: .3, z: -14 },
      'Caudal Vertebrae': { x: 0, y: -6, z: -24 },
      'Pelvis': { x: 0, y: -6, z: -17 },
      'Chevrons': { x: 0, y: -11, z: -24 },
      'Scapula': { x: 4.6, y: -4, z: -3 },
      'Humerus': { x: 4.5, y: -7, z: -2.5 },
      'Radius': { x: 4.5, y: -8.5, z: -2 },
      'Ulna': { x: 4.7, y: -7.6, z: -3.5 },
      'Metacarpal': { x: 5.7, y: -9.6, z: -3.5 },
      'Digits': { x: 6.7, y: -10.6, z: -5.5 }
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
      this.group.add(sprite);
    }
    //this.scene.add(this.group);
    this.group.renderOrder = 2
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    //document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    //this.scene.add( helper );
  };

  OBJLoader2Example.prototype.initContent = function () {
    var modelName = 'Kruzof Skeleton';
    this._reportProgress({ detail: { text: 'Loading ' + modelName } });

    var lambert = new THREE.MeshLambertMaterial({ depthWrite: false, color: 0x757575, transparent: true, opacity: .2, emissive: 0x3c3c3c })
    currentPage === 'kruzof' ? lambert = new THREE.MeshLambertMaterial({ color: '#6f6f6f' }) : lambert = new THREE.MeshLambertMaterial({ depthWrite: false, color: '#ffffff', transparent: true, opacity: .2, emissive: 0x3c3c3c })
     
    //lambert.blending= THREE.AdditiveBlending
    var scope = this;
    var objLoader = new THREE.OBJLoader2();
    var callbackOnLoad = function (event) {
      var object = event.detail.loaderRootNode
      console.log(object, 'object')
      object.traverse(function (child) {
        console.log(child.name, 'thechild')
        if (child instanceof THREE.Mesh) {
          child.material = lambert;

        }
      });
      scope.orca = event.detail.loaderRootNode
      scope.scene.add(scope.orca);
      currentPage === 'kruzofpuzzle' ? scope.orca.position.set(0, 3, 4) : null
      scope.orca.children[0].renderOrder = 2
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
    objLoader.load('images/kruzof/orca_bone_groups_split2.obj', callbackOnLoad, null, null, null, false);

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
    this.group.children.forEach(function (sprite) {
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



var resizeWindow = function () {
  app.resizeDisplayGL();
};

var render = function () {
  requestAnimationFrame(render);
  app.render();
};
var activeMarker
function onDocumentTouchStart(event) {
  event = event.changedTouches[0];
   var _domElement = app.renderer.domElement
  var rect = _domElement.getBoundingClientRect();
  var _mouse = {}
  _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  _mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
  console.log(app, 'moueup', _mouse.x, _mouse.y)
  if (app.boneGrabbed == true) {
    console.log('itstrue', window, app.selectedBone)
    var bone = app.selectedBone.getAttribute('data-bone').replace(' ', "_")
    //var activeBoneMask = boneDiv

    var boneOrigin = app.orca.getObjectByName(bone)
    app.boneGrabbed = false
    app.addBoneEvent(app.selectedBone, _mouse.x, _mouse.y)
    app.forceDrag=true;
    var event = new CustomEvent("touchstart", { object: boneOrigin, forceDrag:true });
    app.renderer.domElement.dispatchEvent(event);

    // Dispatch/Trigger/Fire the event
    app.dragControls.dispatchEvent(event);
  }
  
}
function onDocumentMouseDown(event) {
  console.log(app,'dddd')
  event.preventDefault();


  var _domElement = app.renderer.domElement
  var rect = _domElement.getBoundingClientRect();
  var _mouse = {}
  _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  _mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
  console.log(app, 'moueup', _mouse.x, _mouse.y)
  if (app.boneGrabbed == true) {
    console.log('itstrue', window, app.selectedBone)
    var bone = app.selectedBone.getAttribute('data-bone').replace(' ', "_")
    //var activeBoneMask = boneDiv

    var boneOrigin = app.orca.getObjectByName(bone)
    app.boneGrabbed = false
    app.addBoneEvent(app.selectedBone, _mouse.x, _mouse.y)
    app.forceDrag=true;
    var event = new CustomEvent("mousedown", { });
    app.renderer.domElement.dispatchEvent(event);

    // Dispatch/Trigger/Fire the event
    app.dragControls.dispatchEvent(event);
  }

  var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  var vector = new THREE.Vector3(mouseX, mouseY, 0.5);
  app.projector.unprojectVector(vector, app.camera);
  var raycaster = new THREE.Raycaster(app.camera.position, vector.sub(app.camera.position).normalize());
  //var intersects = raycaster.intersectObjects(app.group.children, true);
  var intersects=[]
  //intersects = raycaster.intersectObjects(app.orca.children, true);
  currentPage === 'kruzof' ?  intersects = raycaster.intersectObjects(app.orca.children, true) : null

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



  if (intersects.length > 0) {
    var boneName = intersects[0].object.name;
    //tween Previous Marker
    if (activeMarker != undefined) {
      console.log('lastmarkertweeen')
      //tweenMarker(.4, .4, .4, activeMarker, document.getElementById('example'))
      var lambert = new THREE.MeshLambertMaterial({ color: '#6f6f6f' })
      if (app.orca.getObjectByName(activeMarker.name.split(' ').join('_'))) {
        app.orca.getObjectByName(activeMarker.name.split(' ').join('_')).material = lambert
      }
    }
    if (app.orca.getObjectByName(boneName.split(' ').join('_'))) {
      app.orca.getObjectByName(boneName.split(' ').join('_')).material = new THREE.MeshLambertMaterial({ color: '#366b51' })
    }
    activeMarker = intersects[0].object
    //tweenMarker(1, 1, 1, intersects[0].object, document.body)
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

window.addEventListener('resize', resizeWindow, false);

console.log('Starting initialisation phase...');
app.initGL();
app.resizeDisplayGL();
app.initContent();

render();