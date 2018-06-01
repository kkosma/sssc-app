<template>
<div class="" style="background-color:#fffdfa;height:100%;width:100%;position:absolute;">
	<div class="top-nav history-nav" >
		<div class="nav-back" style="background-image:url('/images/history/nav-back-history.jpg')"></div>
    <ul>
     
      <li ><nuxt-link to="/"  exact><i class="material-icons">home</i></nuxt-link></li>
      <li ><nuxt-link to="/history"  >History</nuxt-link></li>
    </ul>
  </div>

	<nuxt-link to="/" :transition="transitionName"><div class="back-button nav-button"><i class="material-icons">keyboard_arrow_left</i></div></nuxt-link>
 	<transition name="page" mode="out-in" >
	<div>
		<nuxt-child :key="$route.params.year" :yearsMD="yearsMD"   />
	</div>
	</transition>


	<div class="bottom-nav">
		<div class="slide-nav nav-button">

			<nuxt-link :to="navLinks('prev',currentRoute) " v-on:click.native="updateTimeline(currentRoute)" class="nav-left" id="prevBtn">
			<i class="material-icons">keyboard_arrow_left</i>
			</nuxt-link>
			<nuxt-link :to="navLinks('next',currentRoute) "v-on:click.native="updateTimeline(currentRoute)" class="nav-right" id="nextBtn">
		<i class="material-icons">keyboard_arrow_right</i>
			</nuxt-link>
		</div>

    
		<ol class="flex-con history-event">
			<h2>Our History</h2>
			<nuxt-link tag="li"  :key="year"  class="time-dot" v-for="(year,value,key) in yearPages" :to="'/history/'+year"  :data-year="(year)"  v-on:click.native="timeLine($event);yearSelected = year">
				<span>{{year[0].toUpperCase() + year.substr(1)}}</span>
				<a class="dot" ></a>
			
			</nuxt-link>
			
			<!-- other dates here -->
		</ol>

	</div>

  </div>
</div>
</template>

<script>

if (process.browser) {

}

let currentRoute
let context1
let transitionName

export default {
	mounted (context) {
	console.log('timelines')
	//	timeline()
	//	console.log(this,this.currentRoute.name,'conteeeee')
	//console.log(this,'contect')
		var currentRoute = this.currentRoute
		//var yearPages = this.yearPages
		var prevBtn = document.getElementById("prevBtn");
		var nextBtn = document.getElementById("nextBtn");
		function navLinks2(link,currentRoute){
			//console.log(link,'ink',currentRoute)
		
			
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
		const context2 = require.context('~/content/history/', true, /\.md$/);

    const yearsMD = context2.keys().map(key => ({
      ...context2(key),
			_path: `${key.replace('.md', '').replace('./', '')}`
		
		}));
		//	console.log( yearsMD.map(a => a.year).sort(),'years')
			var sortedYears={}
			yearsMD.forEach(function(key,index){sortedYears[yearsMD[index].year]=yearsMD[index]})
			console.log(sortedYears,Object.keys(sortedYears),'YEARS')
		return {
			transitionContainer:'',
			transitionName:'d',
			yearSelected: '',
			
			n:0,
			years:yearsMD.map(a => a.yearsMD).sort(),
			yearsMD:sortedYears,
			yearPages:Object.keys(sortedYears).sort(),
			//currentRoute: (context.route.name).split('-').pop(),
			currentRoute: (context.route.name).replace('history-',''),
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
		getYear:function(year){
			console.log(year,'year')
		},
		updateTimeline:function(year){
				 setTimeout((parent) => {
			//console.log('yeard',year)
			year = this.$route.path.split("/").pop();
		//	console.log('yeard',year,currentRoute)
			if (year == 'history'){
					var parent = document.querySelector('[data-year="' + this.yearPages[0] + '"]')
					console.log(parent,'parent')
						parent.classList.add('yearSelected')
			}else{
					var parent = document.querySelector('[data-year="' + year + '"]')
				if (	document.getElementsByClassName('yearSelected')[0]){
					document.getElementsByClassName('yearSelected')[0].classList.remove('yearSelected')
				}
				//	console.log( 'yearrrrrrrr',year)
				//var parent = event.target.parentElement;
			
			//	parent.classList.add('yearSelected')
				
			
							// parent.classList.add('older-event')
					
			//	console.log( 'parettttttttt',parent,year)
			//	var active = element.querySelector('.active');
				var prev = parent.previousElementSibling;
				var next = parent.nextElementSibling;
			//	console.log(prev, next, parent, 'siblings')
				if (prev){	

							 prev.classList.add("older-event");	

				//	console.log(prev,'prev')
					while (prev = prev.previousElementSibling) {

							 prev.classList.add("older-event");	

					}
				
				}
				if (next){
					next.classList.remove('older-event')
				//	console.log(next,'next')
					while (next = next.nextElementSibling) next.classList.remove("older-event");
				}
			}
				 }, 20,parent);
		},
		timeLine:function(event){
			//console.log('yearsssssssssssss',event.target.tagName)
			if (event.target.tagName==  "A"){
			//	event.target.classLists.add('yearSelected')
				//yearSelected= event.target.getAttribute('data-year')
				//console.log('yearsssssssssssss',event.target)
				//event.target.classList.add('selected')
				
				if (	document.getElementsByClassName('yearSelected')[0]){
				document.getElementsByClassName('yearSelected')[0].classList.remove('yearSelected')
				}
				var parent = event.target.parentElement;
				//parent.classList.add('yearSelected')
			//	parent.classList.remove('older-event')
				console.log(event.target, 'tareget',parent)
			//	var active = element.querySelector('.active');
				var prev = parent.previousElementSibling;
				var next = parent.nextElementSibling;
			//	console.log(prev, next, parent, 'siblings')
				if (prev){	
					 setTimeout((prev) => {
							 prev.classList.add("older-event");	
						 }, 50,prev);
				
					while (prev = prev.previousElementSibling){
					//	prev.classList.remove("nuxt-link-exact-active");
						 //prev.classList.remove("nuxt-link-active");	
						 setTimeout((prev) => {
							 prev.classList.add("older-event");	
						 }, 50,prev);
						 
						 
						 console.log(prev,'prev',prev.classList)
					}
				}
				if (next){
					next.classList.remove('older-event')
					//console.log(next,'next')
					while (next = next.nextElementSibling) next.classList.remove("older-event");
				}
			}
			
		},
		navLinks: function(link,currentRoute){
		//	console.log(link,'ink',currentRoute,this.$route)
			currentRoute = this.$route.path.split("/").pop();
			//console.log(currentRoute,'cur')
			if (link == 'prev'){
				if (currentRoute == 'history'){
					return ''
				}
				if (this.yearPages[this.yearPages.indexOf(currentRoute)-1] != undefined){
					var pre=this.yearPages[this.yearPages.indexOf(currentRoute)-1]
					//console.log(pre,'preeeeeee')
					return pre
				}else{
				//	console.log(pre,'undfined')
					return '/history'
				}

			}
			if (link == 'next'){
				//console.log(currentRoute, this.yearPages,'pagesss')
				if (currentRoute == 'history'){
				//	console.log('fuckhistory')
				return currentRoute+'/1910'
				}
				if (this.yearPages[this.yearPages.indexOf(currentRoute)+1] != undefined){
					var next=this.yearPages[this.yearPages.indexOf(currentRoute)+1]
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

      //Velocity(heading, { translateX: '-500px'}, { duration:0  })
      //Velocity(nav, { translateX: '500px'}, { duration:0  })
			//Velocity(container, { opacity: 0}, { duration: 0 })
			
		},
		enter:function(el){
			console.log('historyenter')
			var hero = document.getElementById("heroimage");
			var heading= document.getElementsByClassName("heading")[0];
      var container= document.getElementsByClassName("page1")[0];
       var nav= document.getElementsByClassName("map-nav")[0];
		//	Velocity(container, { opacity: 1}, { duration: 800,easing: [.65,.05,.51,.99] })
     // Velocity(heading, { translateX: '00px' }, { duration: 800,easing: [.65,.05,.51,.99] })
     // Velocity(nav, { translateX: '00px' }, { duration: 800,easing: [.65,.05,.51,.99] })
		//	Velocity(hero, {scale: 1.1}, { duration: 800,easing: [.65,.05,.51,.99] })
		},
		leave: function(el){
			var destination = this.$route.name
		//	console.log('to','from',destination)
			var hero = document.getElementById("heroimage");
      var heading= document.getElementsByClassName("heading")[0];
			var container= document.getElementsByClassName("content")[0];
			var container2= document.getElementsByClassName("page")[0];
			var page= document.getElementsByClassName("page1")[0];

			if (destination == 'index'){
			//	Velocity(page, { opacity: 0}, { duration: 600,easing: [.65,.05,.51,.99], complete: function(elements) { } })
			}else{
				console.log('notindx')
			//	Velocity(container, { opacity: 0}, { duration: 600,easing: [.65,.05,.51,.99], complete: function(elements) { } })
			}
      
      //Velocity(heading, { translateX: '-500px', opacity: 0}, { duration: 800,easing: [.65,.05,.51,.99] })
			//Velocity(hero, {scale: 1}, { duration: 800,easing: [.65,.05,.51,.99] })
		//	Velocity(page, { opacity: 0}, { duration: 600,easing: [.65,.05,.51,.99] })
			
			//Velocity(container, { opacity: 0}, { duration: 600,easing: [.65,.05,.51,.99], complete: function(elements) { done() } })
			
		},
	}   
}
</script>

<style scoped >
@import '~/assets/css/globals.css';
#timeline{

}

h1{
	font-size:3rem;
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
	width:100vw;
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
.flex-con{
	align-self:center;
	bottom:initial;
	padding-bottom:20px

}
.bottom-nav{
	background-color:var(--blue);
	height:110px;
	width:100%;
	position:absolute;
	bottom:0;
	left:0;
	display:flex;
	z-index:4
}
.slide-nav{
	bottom:0px;
	right:20px;
	height:110px;
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