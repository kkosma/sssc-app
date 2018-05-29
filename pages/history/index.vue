<template>

	<div class="content">
		<div class="container2 ">
				<div class="hero-image-con">
					<img class="obj-fit-cover obj-pos-lc" id="heroimage" :src="post.image"/>
					<div class="heading justify-center" style="padding-top:200px"><h1>{{post.heading}}</h1></div>
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
		//	console.log(link,'ink',currentRoute)
		
			
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
		//	console.log(context.route,'contect')
			var index = require('~/content/history.md');
		return {
			transitionContainer:'',
			transitionName:'d',
			yearSelected: '',
      years:[
        '1910','1929','1942','1974','2001','2004','2010','2014'
			],
			n:0,
			post:index,
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
		updateTimeline:function(year){
			year = this.$route.name.split('-').pop()
			if (	document.getElementsByClassName('yearSelected')[0]){
				document.getElementsByClassName('yearSelected')[0].classList.remove('yearSelected')
			}
			//	console.log( 'yearrrrrrrr',year)
			//var parent = event.target.parentElement;
			var parent = document.querySelector('[data-year="' + year + '"]')
			parent.classList.add('yearSelected')
			parent.classList.remove('older-event')
		//	console.log( 'parettttttttt',parent,year)
		//	var active = element.querySelector('.active');
			var prev = parent.previousElementSibling;
			var next = parent.nextElementSibling;
		//	console.log(prev, next, parent, 'siblings')
			if (prev){	
				prev.classList.add('older-event');
			//	console.log(prev,'prev')
				while (prev = prev.previousElementSibling) prev.classList.add("older-event");
			}
			if (next){
				next.classList.remove('older-event')
			//	console.log(next,'next')
				while (next = next.nextElementSibling) next.classList.remove("older-event");
			}
		},
		timeLine:function(event){
			
		//	event.target.classLists.add('yearSelected')
			//yearSelected= event.target.getAttribute('data-year')
			//console.log('yearsssssssssssss',event.target)
			//event.target.classList.add('selected')
			
			if (	document.getElementsByClassName('yearSelected')[0]){
			document.getElementsByClassName('yearSelected')[0].classList.remove('yearSelected')
			}
			var parent = event.target.parentElement;
			parent.classList.add('yearSelected')
			parent.classList.remove('older-event')
			//console.log(event.target, 'tareget',parent)
		//	var active = element.querySelector('.active');
			var prev = parent.previousElementSibling;
			var next = parent.nextElementSibling;
		//	console.log(prev, next, parent, 'siblings')
			if (prev){	
				prev.classList.add('older-event');
			//	console.log(prev,'prev')
				while (prev = prev.previousElementSibling) prev.classList.add("older-event");
			}
			if (next){
				next.classList.remove('older-event')
				//console.log(next,'next')
				while (next = next.nextElementSibling) next.classList.remove("older-event");
			}
			
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
			var container= document.getElementsByClassName("page")[0];
		
		//	container.style.opacity=0;

     // Velocity(heading, { translateX: '-500px'}, { duration:0  })
     // Velocity(nav, { translateX: '500px'}, { duration:0  })
			//Velocity(container, { opacity: 0}, { duration: 0 })
			
		},
		enter:function(el){
			console.log('historyenter')
			var hero = document.getElementById("heroimage");
			var heading= document.getElementsByClassName("heading")[0];
      var container= document.getElementsByClassName("page")[0];
       var nav= document.getElementsByClassName("map-nav")[0];
		//	Velocity(container, { opacity: 1}, { duration: 800,easing: [.65,.05,.51,.99] })
      //Velocity(heading, { translateX: '00px' }, { duration: 800,easing: [.65,.05,.51,.99] })
      //Velocity(nav, { translateX: '00px' }, { duration: 800,easing: [.65,.05,.51,.99] })
			//Velocity(hero, {scale: 1.1}, { duration: 800,easing: [.65,.05,.51,.99] })
		},
	}
	
}
</script>

<style scoped >
@import '~/assets/css/globals.css';
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
	height:100%;
	width:100%;
	left:0;
}
.justify-center{
	justify-content: center
}
.section{

}
.hero-image-con{
	top:0;
	left:0;
	position:relative;
	width:100%;
	height:100%;
}
.container2 {
  justify-content: center;
	max-height:100%;
	position:relative;
	min-width:100%;
  height:100%;
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
.page-enter{
	opacity:0
}
.page-enter .heading  {
 transform:translateX(-300px);
  opacity:0
}
.page-enter-to .heading  {
  transform:translateX(0px) .8s;
  opacity:1;

}
.heading{
   transition:all .6s var(--ease-out-quad);
}
.hero-image-con img{
	transition:all .8s var(--ease-out-quad);
		transform:scale(1.1)
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
.page-enter .hero-image-con img{
	transform:scale(1)
}
/* Enter To */

.page-enter-to  {
opacity:1

}
.page-enter-to .hero-image-con img{
	transform:scale(1.1)
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