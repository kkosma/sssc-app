<template>
<div class="page">
  <div class="content">
  
    <div class="container-fluid ">
      <div class="row">
        <div class="col-4" style="padding: 0px 40px" >
          <div class="" style="padding: 0px 80px">
            <h1 class="page-title" style="margin-top:80px">A National Landmark</h1>
            <div class=""><p>Sheldon Jackson Training School was designated a National Historic Landmark, with 20 contributing structures including the Sage and Mill Buildings.</p></div>
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
              <li v-for="(building,value,key) in buildings" v-on:click="navPop(value,true);selected = building"  v-bind:class="{ selected: selected == building}" :data-building="(value)">
              {{value}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
   
  </div>

 
  
</div>

</template>

<script>

let leaflet
let markers=[]
let map


let zoomCount=0;
let buildings={
      "SSSC - Sage Building":{
        coor:[1284,4187],
        image:'/images/history/SSSC_present.jpg'
      },
      "Sawmill":{
        coor:[1152,4533],
        image:'/images/history/Sawmill.jpg'
      },
      "Pears Cottage":{
        coor:[1348,4737],
        image:'/images/history/Pears Cottage.jpg'
      },
      "Ocean Vista Cottage":{
        coor:[1346,5357],
        image:'/images/history/Ocean Vista Cottage.jpg'
      },
      "Craig Cottage":{
        coor:[1633,5127],
        image:'/images/history/Craig Cottage.jpg'
      },
      "Sheldon Jackson Museum":{
        coor:[1934,4161],
        image:'/images/history/Jackson Museum.jpg'
      },
      "Fraser Hall":{
        coor:[2049,4075],
        image:'/images/history/Fraser Hall.jpg'
      },
      "Power Plant & Laundry":{
        coor:[2281,4039],
        image:'/images/history/Powerplant.jpg'
      },
      "Whitmore Hall":{
        coor:[2265.035677,3520.985863],
        image:'/images/history/Whitmore Hall.jpg'
      },
       "The Quadrangle":{
        coor:[1873,2958],
        image:'/images/history/Quadrangle.jpg'
      },

      "Allen Memorial Hall":{
        coor:[2433,2835],
        image:'/images/history/Allen Hall.jpg'
      },
      "Ceramics/Storehouse":{
        coor:[2344,2561],
        image:'/images/history/ceramics.jpg'
      },
      "North Pacific Hall":{
        coor:[2276,2331],
        image:'/images/history/North Pacific Hall.jpg'
      },
      
      "Stevenson Hall":{
        coor:[2162,2099],
        image:'/images/history/Stevenson Hall.jpg'
      },
      "Tillie Paul Manor":{
        coor:[2197,1630],
        image:'/images/history/Tillie Paul Manor.jpg'
      },
  
      "West Cottage":{
        coor:[1774,1535],
        image:'/images/history/West Cottage.jpg'
      },
      "Houk House":{
        coor:[1930,1874],
        image:'/images/history/Houk House.jpg'
      },
      "North Cottage":{
        coor:[2029,1203],
        image:'/images/history/North Cottage.jpg'
      }
    }
let currentImage=2
let navPop = function (value,firePop){
      zoomCount++
      var latLng= markers[value].getLatLng()
      console.log('navpop',value,currentImage)
      if (firePop){
         markers[value].openPopup()
         map.flyTo(latLng,map.getZoom(),{animate:true,duration:1,easeLinearity:.1}) 
      }else{
        
        
        var buildingImg=document.getElementById("buildingImages");

        if(currentImage ==2 ){
          currentImage=1
          buildings[value].image ? buildingImages.getElementsByTagName('img')[0].src=buildings[value].image : null;
        }else{
          currentImage=2
          buildings[value].image ? buildingImages.getElementsByTagName('img')[1].src=buildings[value].image : null;
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
  asyncData() {
		return {
      selected: '',
      buildings:buildings,
		//	name: process.static ? 'static' : (process.server ? 'server' : 'client')
		}
	},
	head: {
	title: '2001',
	script:[
	
	]
	},
	mounted () {
    console.log(buildings,'buiolder')

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

   // map.on('click', onMapClick);
   
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
      markers[building]=L.marker(coor,{
        icon:myIcon,
        fillColor:'#0db6b6',
        color:'white',
         building:building
      }).bindPopup(
          '<div class="" data-building="'+building+'">'+building+'</div><div class="content-pop" ></div>',
          {className:'building-popup'
          }).addTo(map);
     
    }
    map.on('popupopen',function(e){
      console.log(e.popup._source,e.popup._content,'pop',)
      navPop(e.popup._source.options.building,false)
    })
    for (var building in buildings){
      console.log(building,'builind')
      creatMarker(building,buildings[building].coor)
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

    
        
    
      //document.addEventListener('click', callback, false);

//map.addLayer( L.gridLayer.canvasCircles() );

	},
	methods:{
    navPop: navPop
  },
	transition: {
		mode:'out-in',
		css:false,
		leave: function(el){
		console.log('indexleave')
		var video = document.getElementsByClassName("video")[0];
		var nav= document.getElementsByClassName("nav")[0];
		var heading= document.getElementsByClassName("heading")[0];
				var videoEl = document.getElementById("homevid");
		//videoEl.currentTime=20;
		//this.$store.commit('increment')
		if (videoEl){
		this.$store.state.counter=videoEl.currentTime
		}
				Velocity(nav, { translateX: '500px', opacity: 0}, { duration: 800 ,easing: [.65,.05,.51,.99]})
				Velocity(heading, { translateX: '-500px', opacity: 0}, { duration: 800,easing: [.65,.05,.51,.99] })
				Velocity(video, { scale: '1.5', opacity: 0}, { duration: 800,easing: [.65,.05,.51,.99] })

		console.log(this.$store,this.$store.state.counter,'store')

		},
		beforeEnter:function(){
      var hero = document.getElementById("heroimage");
      var buildingImg = document.getElementById("buildingImg");
			var mapNav= document.getElementsByClassName("map-nav")[0];
      var container= document.getElementsByClassName("content")[0];
      var title= document.getElementsByClassName("page-title")[0];
			//hero.style.opacity=0;
			//heading.style.opacity=0;
			container.style.opacity=0;
      //heading.style.transform='translateX(-500px)'
      console.log(title,'title')
      var text= document.getElementsByClassName("text-col-3")[0];
      Velocity(text, { translateX: '-50px', opacity:0}, { duration:0  })
     // Velocity(buildingImg, { opacity:0}, { duration:0  })
      Velocity(title, { translateY: '50px', opacity:0}, { duration:0  })
      Velocity(mapNav, { translateX: '500px', opacity:0}, { duration:0  })
			//Velocity(heading, { translateX: '-500px'}, { duration:0  })
			//Velocity(container, { opacity: 0}, { duration: 0 })
			
		},
		enter:function(el){
      console.log('historyenter')
      currentImage=2
      var hero = document.getElementById("heroimage");
      var buildingImg = document.getElementById("buildingImg");
			var mapNav= document.getElementsByClassName("map-nav")[0];
      var container= document.getElementsByClassName("content")[0];
      var title= document.getElementsByClassName("page-title")[0];
      var text= document.getElementsByClassName("text-col-3")[0];
       //Velocity(buildingImg, {  opacity:1}, { duration:800,delay:1250,easing:[100,0]  })
      Velocity(mapNav, { translateX: '0px', opacity:1}, { duration:1250,delay:1350,easing:[100,0]  })
      Velocity(text, { translateX: '0px', opacity:1}, { duration:800,delay:600,easing:[100,0]  })
      Velocity(title, { translateY: '0px', opacity:1}, { duration:800,delay:400,easing: [100,0]  })
			Velocity(container, { opacity: 1}, { duration: 600,easing: [.65,.05,.51,.99] })

		},
		leave: function(el, done){
			var page= document.getElementsByClassName("content")[0];
			Velocity(page, { opacity: 0}, { duration: 600,easing: [.65,.05,.51,.99], complete: function(elements) { done() } })
		},
	}   
}
</script>
<style src="leaflet/dist/leaflet.css" lang="css"></style>
<style scoped>
*{
   -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.ftscroller_container{
	display:flex;
}
.ftscroller_x, .ftscroller_y{
	display:flex;
}
.hero-image-con{
	display:flex;
	height:100vh;
}
.justify-center{
	justify-content: center
}
.section{

}
.container2, .container-fluid {

	max-height:100vh;
	position:relative;

	width:100%;
  height:auto;


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