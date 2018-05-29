<template>

<div class="container2 ">
	<nuxt-link to="/history.vue"><div class="back-button"><i class="material-icons">keyboard_arrow_left</i></div></nuxt-link>
    <div class="row-h">
			<div class="col" style="overflow:hidden;max-width:1661px">
				<div class="juxtapose" id="historycompare" data-makeresponsive="false">
					<img src="/images/history/sheldon-jackson-teens2.jpg" />
					<img src="/images/history/sheldon-jackson-now2.jpg" />
				</div>
			</div>
		</div>
</div>

</template>

<script>

if (process.browser) {
	
}

export default {
	mounted () {
		console.log('mont')

		console.log('weereee')
	var containerElement
	var scroller;



	},
	asyncData() {
		return {
		//	name: process.static ? 'static' : (process.server ? 'server' : 'client')
		}
	},
	head: {
	title: 'History',
	script:[
		{src:'js/juxtapose.js', body:true}
	]
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
			var heading= document.getElementsByClassName("heading")[0];
			var container= document.getElementsByClassName("container2")[0];
			//hero.style.opacity=0;
			//heading.style.opacity=0;
			container.style.opacity=0;
			//heading.style.transform='translateX(-500px)'
			Velocity(heading, { translateX: '-500px'}, { duration:0  })
			//Velocity(container, { opacity: 0}, { duration: 0 })
			
		},
		enter:function(el){
			console.log('historyenter')
			var hero = document.getElementById("heroimage");
			var heading= document.getElementsByClassName("heading")[0];
			var container= document.getElementsByClassName("container2")[0];
			Velocity(container, { opacity: 1}, { duration: 800,easing: [.65,.05,.51,.99] })
			Velocity(heading, { translateX: '00px' }, { duration: 800,easing: [.65,.05,.51,.99] })
			Velocity(hero, {scale: 1.1}, { duration: 800,easing: [.65,.05,.51,.99] })
		},
		leave: function(el, done){
			var container= document.getElementsByClassName("container2")[0];
			Velocity(container, { opacity: 0}, { duration: 800,easing: [.65,.05,.51,.99], complete: function(elements) { done() } })
		},
	}   
}
</script>
<style scoped >
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
</style>