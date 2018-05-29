<template>
<div>
	<div class="page1" style="background-color:black">

		<div class="top-nav " >
	
				<ul>
					<li ><nuxt-link to="/"  exact><i class="material-icons">home</i></nuxt-link></li>
					<li ><nuxt-link to="/research"  >{{currentRoute[0].toUpperCase() + currentRoute.substr(1)}}</nuxt-link></li>
				</ul>
		</div>

			<a   :transition="transitionName"><div @click="backNav()" class="back-button nav-button"><i class="material-icons">keyboard_arrow_left</i></div></a>
		

		<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%"  id="svgBack">
			<linearGradient id="background" gradientUnits="objectBoundingBox" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop id="start" offset="0%" stop-color="rgb(126, 189, 187)"/>
				<stop id="end" offset="100%" stop-color="rgb(20, 73, 71)"/>
			</linearGradient>
			<rect id="rect" width="100%" height="100%" fill="url(#background)"/>
		</svg>
		<div class="particles">
			<video id="homevid" autoplay loop><source src="/video/particles2.mp4" type="video/mp4" ></video>
		</div>


	
			<nuxt-child v-bind="{ 'msgChild': msgChild }"/>


		<div class="animals-back-img">
			<img src="/images/research/research-back.jpg" class="img-fluid obj-fit-cover obj-pos-c" >
		</div>

		

	</div>
</div>
</template>

<script>

if (process.browser) {

}
let yearPages=[
	'1910','1929','1972','2001','2005','2007','2010'
]
let currentRoute
let context1
let transitionName

export default {

	components:{

	},
	mounted (context) {
		//console.log(timeline,'timelines',)
	//	timeline()
	//	console.log(this,this.currentRoute.name,'conteeeee')

		var currentRoute = this.currentRoute[0].toUpperCase() + this.currentRoute.substr(1)
		//var yearPages = this.yearPages
		var prevBtn = document.getElementById("prevBtn");
		var nextBtn = document.getElementById("nextBtn");
		function navLinks2(link,currentRoute){
			console.log(link,'ink',currentRoute)
		
			
				if (currentRoute == 'history'){
					prevBtn.href=''
					nextBtn.href=currentRoute+'/1910'
				}
				if (yearPages[yearPages.indexOf(currentRoute)-1] != undefined){
					prevBtn.href= (yearPages[yearPages.indexOf(currentRoute)-1])
				}else{
					prevBtn.href='history'
				}

				if (yearPages[yearPages.indexOf(currentRoute)+1] != undefined){
					nextBtn.href= (yearPages[yearPages.indexOf(currentRoute)+1])
				}else{
					nextBtn.href= ''
				}
		
		}
		//navLinks2(null,currentRoute)
		console.log('mont')
	
		console.log('weereee')
	var containerElement
	var scroller;



	},
	asyncData(context) {
			console.log(context.route,'contect')
		return {
			transitionContainer:'',
			transitionName:'d',
			yearSelected: '',
			msgChild: null,
      years:[
        '1910','1929','1942','1974','2001','2005','2004','2010'
			],
			n:0,
			yearPages:yearPages,
      currentRoute: (context.route.name).split('-').pop(),
      projects:{
        "Coastal Resilience":{},
        "SEASWAP":{},
        "Chum Project":{}
      },
			//context1:this.$route
			//name: process.static ? 'static' : (process.server ? 'server' : 'client')
		}
	
	},
	head() {
     return{
    style: [
      { cssText: '.animal-name-back { background-color: '+ this.shadeColor('#28918d',.4) +'!important;color:'+this.shadeColor('#28918d',.4) + '!important } .overlay-w{background:'+this.shadeColor('#28918d',-.4)+'!important}.top-nav{background:'+this.shadeColor('#28918d',-.3)+'!important}.hero-image-con img,.animal-tile img{background:'+this.shadeColor('#28918d',.3)+'!important}', type: 'text/css' }
    ]
     }


	},
	methods:{
		shadeColor: function(color,percent){
			var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
			return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    },
		backNav: function(){
      this.msgChild = ['doIt'];
      var routePath=this.$route.path
      var backUrl=routePath.split('/');
      backUrl.pop()
      routePath = backUrl.join('/')
      routePath == '' ? this.$router.push('/') : this.$router.push(routePath)
    },
		navLinks: function(link,currentRoute){
			//console.log(link,'ink',currentRoute,this.$route)
			currentRoute = this.$route.name.split('-').pop()
			if (link == 'prev'){
				if (currentRoute == 'history'){
					return ''
				}
				if (yearPages[yearPages.indexOf(currentRoute)-1] != undefined){
					var pre=yearPages[yearPages.indexOf(currentRoute)-1]
					//console.log(pre,'preeeeeee')
					return pre
				}else{
				//	console.log(pre,'undfined')
					return '/history'
				}

			}
			if (link == 'next'){
				console.log(currentRoute, yearPages,'pagesss')
				if (currentRoute == 'history'){
				//	console.log('fuckhistory')
				return currentRoute+'/1910'
				}
				if (yearPages[yearPages.indexOf(currentRoute)+1] != undefined){
					var next=yearPages[yearPages.indexOf(currentRoute)+1]
					//console.log(next,'neeeeeeeeeeeeeee')
					return next
				}else{
					return ''
				}
			}
		},
		getRouteName:function(){
			return this.$route.name
		}
	},
	
	transition: {
		mode:'out-in',
		css:true,
		
		beforeEnter:function(){
			console.log('beforeenter')
			var hero = document.getElementById("heroimage");
      var heading= document.getElementsByClassName("heading")[0];
      var nav= document.getElementsByClassName("map-nav")[0];
			var container= document.getElementsByClassName("page1")[0];
		
		//	container.style.opacity=0;

     // Velocity(heading, { translateX: '-500px'}, { duration:0  })
    //  Velocity(nav, { translateX: '500px'}, { duration:0  })
			//Velocity(container, { opacity: 0}, { duration: 0 })
			
		},
		enter:function(el){
			console.log('historyenter')
			var hero = document.getElementById("heroimage");
			var heading= document.getElementsByClassName("heading")[0];
      var container= document.getElementsByClassName("research-child")[0];
       var nav= document.getElementsByClassName("map-nav")[0];
		//	Velocity(container, { opacity: 1}, { duration: 800,easing: [.65,.05,.51,.99], complete: function(elements) { done() }})
      //Velocity(heading, { translateX: '00px' }, { duration: 800,easing: [.65,.05,.51,.99] })
      //Velocity(nav, { translateX: '00px' }, { duration: 800,easing: [.65,.05,.51,.99] })
		//	Velocity(hero, {scale: 1.1}, { duration: 800,easing: [.65,.05,.51,.99] })
		},
		leave:function(el){

		}
		

	
	}   
}
</script>

<style  scoped>
*{
   -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#timeline{

}
.history-nav{
	position:fixed;
}
.vignette{
  position:absolute
}

.justify-center{
	justify-content: center
}
.section{

}
.top-nav{
	background:#0f615e;
	background:linear-gradient(to right,#0f615e,#358e8b);
}
.back-button{
	background:#144947
}



.animals-back-img img{
  opacity:1;
  transition: opacity .4s;
  position: absolute;
  
  transition-timing-function: ease-in-out;
}
.content{
  max-height:initial
}
.container2 {
  justify-content: center;
	max-height:100vh;
	position:relative;
	overflow-x:auto;
	min-width:100vw;
  height:100vh;
	display: flex;
	flex-wrap: wrap;
	flex-direction:column;
	-webkit-overflow-scrolling: touch
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


</style>