 <template>
<div class="row" style="margin:0px;width:100%;" >
 <!-- Landmark Map -->
 
  
    <div class="col-4" style="padding: 0px 40px" >
      <div class="" style="padding: 0px 80px">
        <h1 class="page-title" style="margin-top:80px">{{yearsMD[year].title}}</h1>
        <div class="" v-html="yearsMD[year].__content"></div>
      </div>
      <div class="buildingImageCon" id="buildingImages" style="margin-top:60px;position:relative;height:400px;overflow:hidden;">
        <img class="img-full obj-fit-cover building-img" id="buildingImg1" src="/images/history/sheldon.jpg" style="position:absolute">
        <img class="img-full obj-fit-cover building-img building-active" id="buildingImg2" src="/images/history/sheldon.jpg" style="position:absolute">
        </div>
    </div>
    <div class="col-8" style="padding:0" >
      <div id="map"></div>
      <div class="map-nav">
        <ul>
          <li v-for="(landmark,value,key) in yearsMD[year].landmarkmap" v-on:click="navPop(landmark.landmark.name,true);selected = landmark.landmark.name"  v-bind:class="{ selected: selected == landmark.landmark.name}" :data-building="(landmark.landmark.name)">
          {{landmark.landmark.name}}
          </li>
        </ul>
      </div>
    </div>


</div>
</template>

<script>
let leaflet
let markers=[]
let map
let project
let zoomCount=0
let currentImage=2
let buildings
let navPop = function (value,firePop){
      zoomCount++
      var latLng= markers[value].getLatLng()
      console.log('navpop',value,buildings,buildings[value],currentImage,buildings[value].image)
      if (firePop){
         markers[value].openPopup()
         map.flyTo(latLng,map.getZoom(),{animate:true,duration:1,easeLinearity:.1}) 
      }else{
        
        
        var buildingImg=document.getElementById("buildingImages");

        if(currentImage ==2 ){
          currentImage=1
          buildings[value].landmark.image ? buildingImages.getElementsByTagName('img')[0].src=buildings[value].landmark.image : null;
        }else{
          currentImage=2
          buildings[value].landmark.image ? buildingImages.getElementsByTagName('img')[1].src=buildings[value].landmark.image : null;
        }
        buildingImages.getElementsByTagName('img')[0].classList.toggle("building-active");
        buildingImages.getElementsByTagName('img')[1].classList.toggle("building-active")
      }
      

      //markers.openPopup()
    }
if (process.browser) {
  leaflet = require('leaflet')
}
export default {
  asyncData( context) {
   
    return{
      year:year,
      selected: '',
      
    }
  },
  props: ['yearsMD','year','selected'],
  methods:{
    navPop: navPop,
    get (nestedObj, pathArr) {
    return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
    },
  },
  mounted() {
    var sortedLandmarks={}
    buildings={}
    var landmarks=this.yearsMD[this.year].landmarkmap
			landmarks.forEach(function(key,index){console.log(landmarks[index].landmark.name,'land');buildings[landmarks[index].landmark.name]=landmarks[index]})
    // buildings=this.yearsMD[this.year].landmarkmap
      console.log(this.yearsMD[this.year],buildings, 'yearsmdee')
    juxtapose.sliders=[]
    juxtapose.scanPage();
    setTimeout(() => {
      //console.log('weereee',juxtapose.sliders,this)
     juxtapose.sliders.length != 0 ? juxtapose.sliders[0].updateSlider("50%", true):null
    }, 400);
    if (this.yearsMD[this.year].layout == 'landmark-map'){
      var bounds = [[0,0], [3826,6000]];
     var maxBounds1 = [[5121,-1801], [-1801,8341]];
     var maxBounds = [[3826,0], [0,6000]];
    //var map= document.getElementById("map");
     map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom:-1.8,
      maxZoom:.5,
    // center:[2200,4150],
      zoomDelta:.25,
      zoomSnap:.1,
      inertia:true,
      inertiaDeceleration:500,
      zoom:-1.7,
      zoomControl:false,
      attributionControl:false,
      bounceAtZoomLimits:false,
      maxBounds:maxBounds1,
    maxBoundsViscosity:1,
    pan:{animate:true,duration:.75}
    });
    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

   //map.on('click', onMapClick);
   
    var myIcon = L.icon({
      iconUrl: '/images/history/circle-marker.svg',
      iconSize: [26, 26],
      iconAnchor: [0, 0],
      popupAnchor: [13, -13],
     
      //shadowUrl: 'my-icon-shadow.png',
     // shadowSize: [68, 95],
      //shadowAnchor: [22, 94]
    });
    function creatMarker(building,coor){
      //console.log(building,coor,building.name,'createmarkder')
      console.log(coor,building.name,'popup')
      coor = coor.split(',');console.log(coor)
      markers[building.name]=L.marker(coor,{
        icon:myIcon,
        fillColor:'#0db6b6',
        color:'white',
         building:building.name
      }).bindPopup(
          '<div class="" data-building="'+building.name+'">'+building.name+'</div><div class="content-pop" ></div>',
          {className:'building-popup'
          }).addTo(map);
     
    }
    map.on('popupopen',function(e){
      //console.log(e.popup._source,e.popup._content,'pop',)
      navPop(e.popup._source.options.building,false)
    })
    for (var building in buildings){
      console.log(building,'builind')
      creatMarker(buildings[building].landmark,buildings[building].landmark.coordinates)
    }
    //var backTile = L.imageOverlay('/images/history/map-tile2.png', maxBounds1,{className:'back-tile'}).addTo(map);
    var image = L.imageOverlay('/images/history/sheldon-jackson-mapfinal.png', bounds).addTo(map);
    //var backTile = L.imageOverlay('/images/history/map-tile.png', bounds).addTo(map);
    map.fitBounds(bounds);
   // map.panTo([1000,4000])
    //map.setZoom(-1.5,true,{duration:1000})
    map.flyTo([2000,3200], -1.4, {
     duration:1.25,
    });

    var CanvasLayer = L.GridLayer.extend({
      createTile: function(coords){
        // create a <canvas> element for drawing
        var tile = document.createElement('div');
        //tile.innerHTML = '<img src="/images/history/map-tile.png"/>'
        tile.classList.add('back-tile');
        tile.setAttribute('width', 50);
        tile.setAttribute('height', 50);

        //tile.style.outline = '1px solid red';
        return tile;
      }
    });
    L.canvasLayer = function(opts) {
		  return new CanvasLayer({minZoom:-5,tileSize:150});
	  };
    //map.addLayer(L.canvasLayer())

   L.GridLayer.CanvasCircles = L.GridLayer.extend({
    createTile: function (coords) {
        var tile = document.createElement('canvas');

        var tileSize = this.getTileSize();
        tile.setAttribute('width', 50);
        tile.setAttribute('height', 50);

        var ctx = tile.getContext('2d');

        // Draw whatever is needed in the canvas context
        // For example, circles which get bigger as we zoom in
        ctx.beginPath();
        ctx.arc(tileSize.x/2, tileSize.x/2, 4 + coords.z*4, 0, 2*Math.PI, false);
        ctx.fill();

        return tile;
    }
});

    L.gridLayer.canvasCircles = function(opts) {
        return new L.GridLayer.CanvasCircles({minNativeZoom:-5});
      };

    }
    

  
  }

  
}
</script>

<style src="leaflet/dist/leaflet.css" lang="css"></style>
<style scoped>
.obj-fit-cover{
  object-fit:cover ;height:100%;position:absolute;width:100%;top:0;left:0;
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
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  font-family: sans-serif;
  box-sizing: border-box;
}
.col-10{
	display:block;

}
.col-10{
	width:41.666%;
	height:50%;
}
.col-7{
	width:3.42%;
}
.full-h{
	height:100%;
}
.leaflet-overlay-pane{
  background:url('/images/history/map-tile.png');
  background-size:cover;
  background-color:#d4d0c8;
}
.back-tile{
  background:url('/images/history/map-tile.png');
  background-size:cover;
  background-color:#d4d0c8;
  background-size:100px;
  background-position:center center;
}
.leaflet-marker-icon{
 
}
.leaflet-marker-icon,
.leaflet-marker-shadow {
opacity:0;
left:13px;
top:13px;
  animation: fadein .75s;
  animation-delay:1s;
  transform-origin:center center;
  animation-fill-mode: forwards;
  animation-timing-function: ease;
  
}
.map-nav{
  overflow:auto;
  max-height:100%;
}
@keyframes fadein {
    0% { height:10px;width:10px;left:-5px;top:-5px;opacity: 0; }
    50%   { height:30px;width:30px;left:-15px;top:-15px;opacity: 1; }
    100% { height:26px;width:26px;left:-13px;top:-13px;opacity: 1; }
}
.building-img{
  opacity:0;
  transition:opacity .6s ease;
}
.building-active{
  opacity:1;
  z-index:3
  
}
#map{
  width:100%;
  height:100%;
  overflow:hidden ;
  background-color:#faf7f2;
  z-index:2;
  
}
.white p{
	color:rgb(70, 70, 70);
	
}
.white .section{
	background-color:white;
}
.white h2{
	color:rgb(129, 129, 129);
}
.white h2:after{
	background-color:rgb(194, 194, 194);
}
#map .leaflet-control-attribution,.leaflet-container .leaflet-control-attribution{
  display:none!important;
}
</style>
 
 
