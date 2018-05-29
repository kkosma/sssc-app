<template>
<div class="page">
  <div class="content">
    <div class="container-fluid ">
     
        <div class="row ">
          <div class="col-7" style="padding: 0px 40px">
            <div style="padding: 0px 80px">
              <h1 class="page-title" style="margin-top:120px">Our Home</h1>
              <div class="text-col-2"><p>In 2010, the Science Center purchased the Mill and Sage buildings taking over the hatchery and the aquarium. The purchase was made possible by an economic development grant from the City of Sitka, a grant from the Karsh Family Foundation and a loan from local commercial fishermen. The Science Center completed a $1.3 million exterior renovation in 2014 with funding from the Rasmuson Foundation, the M.J. Murdock Trust and the Ahlgren Family Fund.</p>
              </div>
            </div>
          </div>
          <div class="col-5 px-0" style="">
            <img class="img-full obj-fit-cover h-50" src="/images/history/hatchery.png" />
            <img class="img-full obj-fit-cover h-50" src="/images/history/Sheldon_Jackson_College_Fisheries.jpg" />
            
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
			var hero = document.getElementById("heroimage");
			var heading= document.getElementsByClassName("heading")[0];
      var container= document.getElementsByClassName("content")[0];
      var title= document.getElementsByClassName("page-title")[0];
			//hero.style.opacity=0;
			//heading.style.opacity=0;
			container.style.opacity=0;
      //heading.style.transform='translateX(-500px)'
      console.log(title,'title')
      var text= document.getElementsByClassName("text-col-2")[0];
      Velocity(text, { translateX: '-50px', opacity:0}, { duration:0  })
      Velocity(title, { translateY: '50px', opacity:0}, { duration:0  })
			//Velocity(heading, { translateX: '-500px'}, { duration:0  })
			//Velocity(container, { opacity: 0}, { duration: 0 })
			
		},
		enter:function(el){
			console.log('historyenter')
			var hero = document.getElementById("heroimage");
			var heading= document.getElementsByClassName("heading")[0];
      var container= document.getElementsByClassName("content")[0];
      var title= document.getElementsByClassName("page-title")[0];
      var text= document.getElementsByClassName("text-col-2")[0];
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