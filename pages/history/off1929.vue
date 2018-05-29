<template>
<div class="page">
  <div class="content" >
    <div class="container-fluid ">
     
        <div class="row row-t-half">
          <div class="col-4" style="">
            <img class="img-full obj-fit-cover" src="/images/history/download.jpg" />
          </div>
          <div class="col-4" style="">
            <img class="img-full obj-fit-cover" src="/images/history/Pics828.jpg" />
          </div>
          <div class="col-4" style="">
            <img class="img-full obj-fit-cover" src="/images/history/Mechanical_drawing_class.jpg" />
          </div>
        </div>
    </div>
    <div class="container2 ">

      <div class="row-h">
        <div class="col" >
          <h1 class="page-title">Industrial Arts</h1>
        </div>
        
      </div>
      <div class="row-h">
        <div class="col" >
          <div class="text-col-3"><p>The Sage building was built in 1929 with $50,000 that was donated by Margaret Olivia Sage, the wife of a New York businessman. The building housed industrial arts. It also housed the 140 horsepower hydroplant that would supply energy for the campus and the neighborhood until the 1990s.</p><p>Students in the vocational school used the Sage Building and the Mill Building (the building next door, which was built in 1934 and then rebuilt in 1941) to learn about milling wood, carpentry and boat building. The Sage Building housed a machine shop, a print shop, a shoe repair shop and a wood shop.</p></div>
        </div>
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
  //JXSlider.updateSlider(percentage, animate);
 
		
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
	
	]
	},

	transition: {
		mode:'out-in',
		css:false,
		beforeEnter:function(){
			console.log('entree1929')
			var hero = document.getElementById("heroimage");
			var heading= document.getElementsByClassName("heading")[0];
      var container= document.getElementsByClassName("content")[0];
      var title= document.getElementsByClassName("page-title")[0];
			//hero.style.opacity=0;
			//heading.style.opacity=0;
			container.style.opacity=0;
      //heading.style.transform='translateX(-500px)'
      console.log(title,'title')
      var text= document.getElementsByClassName("text-col-3")[0];
      Velocity(text, { translateX: '-50px', opacity:0}, { duration:0  })
      Velocity(title, { translateY: '50px', opacity:0}, { duration:0  })
			//Velocity(heading, { translateX: '-500px'}, { duration:0  })
			//Velocity(container, { opacity: 0}, { duration: 0 })
			
		},
		enter:function(el){
			console.log('historyenter1929')
			var hero = document.getElementById("heroimage");
			var heading= document.getElementsByClassName("heading")[0];
      var container= document.getElementsByClassName("content")[0];
      var title= document.getElementsByClassName("page-title")[0];
      var text= document.getElementsByClassName("text-col-3")[0];
      Velocity(text, { translateX: '0px', opacity:1}, { duration:800,delay:600,easing:[100,0]  })
      Velocity(title, { translateY: '0px', opacity:1}, { duration:800,delay:400,easing: [100,0]  })
			Velocity(container, { opacity: 1}, { duration: 600,easing: [.65,.05,.51,.99] })

		},
		leave: function(el, done){
			console.log('leavvvvvvvvving')
			var page= document.getElementsByClassName("content")[0];
			Velocity(page, { opacity: 0}, { duration: 600,easing: [.65,.05,.51,.99], complete: function(elements) { done() } })
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
.container2, .container-fluid {
  padding:0px 120px;
	max-height:100vh;
	position:relative;

	width:100%;
  height:auto;
	display: flex;
	flex-wrap: wrap;

}
.container-fluid{
  padding:0px 40px;
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