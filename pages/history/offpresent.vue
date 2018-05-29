<template>
<div class="page"style="">

<div class="content">
	<div class="container2 ">
			<div class="hero-image-con">
				<img class="obj-fit-cover obj-pos-lc" id="heroimage" src="/images/history/SSSC16.jpg"/>
				<div class="heading justify-center" style="padding-top:200px"><h1>Today and into the future we're building Sitka's legacy as an educational and scientific community</h1></div>
			</div>
		
	

	</div>

	</div>
	

  </div>
</div>
</template>

<script>

if (process.browser) {

}
let yearPages=[
	'1910','1929','1972','2001'
]
let currentRoute
let context1
let transitionName
export default {
	mounted (context) {
		//console.log(timeline,'timelines',)
	//	timeline()
	//	console.log(this,this.currentRoute.name,'conteeeee')

		var currentRoute = this.currentRoute
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
      years:[
        '1910','1929','1942','1974','2001','2004','2010','2014'
			],
			n:0,
			yearPages:[
				'1910','1929','1972','2001'
			],
			currentRoute: (context.route.name).split('-').pop(),
			//context1:this.$route
			//name: process.static ? 'static' : (process.server ? 'server' : 'client')
		}
	
	},
	head: {
	title: 'History',
	script:[
	
	],
	link: [
	
	]

	},
	methods:{
		getRouteName:function(){
			return this.$route.name
		}
	},
		transition: {
		mode:'out-in',
		css:false,
		
		beforeEnter:function(){
			console.log('beforeenter')
			var hero = document.getElementById("heroimage");
      var heading= document.getElementsByClassName("heading")[0];
      var nav= document.getElementsByClassName("map-nav")[0];
			var container= document.getElementsByClassName("container2")[0];
		
			container.style.opacity=0;

      Velocity(heading, { translateX: '-500px'}, { duration:0  })
      Velocity(nav, { translateX: '500px'}, { duration:0  })
			//Velocity(container, { opacity: 0}, { duration: 0 })
			
		},
		enter:function(el){
			console.log('historyenter')
			var hero = document.getElementById("heroimage");
			var heading= document.getElementsByClassName("heading")[0];
      var container= document.getElementsByClassName("container2")[0];
       var nav= document.getElementsByClassName("map-nav")[0];
			Velocity(container, { opacity: 1}, { duration: 800,easing: [.65,.05,.51,.99] })
      Velocity(heading, { translateX: '00px' }, { duration: 800,easing: [.65,.05,.51,.99] })
      Velocity(nav, { translateX: '00px' }, { duration: 800,easing: [.65,.05,.51,.99] })
			Velocity(hero, {scale: 1.1}, { duration: 800,easing: [.65,.05,.51,.99] })
		},
	}
	
}
</script>

<style scoped >
*{
   -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
h1{
  text-shadow: 2px 2px 12px rgba(0, 0, 0, .7);
}
#timeline{

}
.ftscroller_container{
	display:flex;
}
.ftscroller_x, .ftscroller_y{
	display:flex;
}
.hero-image-con{
	display:flex;
top:0;
height:100%;
}
.justify-center{
	justify-content: center
}
.section{

}
.container2 {
  justify-content: center;
	max-height:100vh;
	position:relative;
	overflow-x:auto;
	min-width:100%;
  height:100%;
	display: flex;
	flex-wrap: wrap;
	flex-direction:column;
	-webkit-overflow-scrolling: touch
}
.hero-image-con{
  width:100%;
  height:100%;
  left:0;
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
</style>