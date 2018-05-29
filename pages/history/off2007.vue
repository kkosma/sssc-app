<template>
<div class="page">
  <div class="content" >
    <div class="container-fluid ">
     
        <div class="row row-t-half">
          <div class="col-8" style="">
            <img class="img-full obj-fit-cover" src="/images/history/ssscbuilding-old.jpg" />
          </div>
   
          <div class="col-4" style="">
            <img class="img-full obj-fit-cover" src="/images/history/sjc-boarded.jpg" />
          </div>
        </div>
    </div>
    <div class="container2 ">

      <div class="row-h">
        <div class="col" >
          <h1 class="page-title">Endings and Beginnings</h1>
        </div>
        
      </div>
      <div class="row-h">
        <div class="col" >
          <div class="text-col-3"><p>In 2007, the Sheldon Jackson College closed its doors. Volunteers from the community helped keep the hatchery operational. Once that was stabilized, the University of Alaska organized a meeting in Sitka of state and federal agencies such as the Department of Fish and Game, NOAA, University of Alaska, representatives from aquaculture and science education and researchers from across the State. The meeting was held to determine how Sheldon Jackson College’s legacy of providing science education and quality research for the state could be maintained. The Sitka Sound Science Center was formed as a nonprofit with the goal of improving understanding of the marine and terrestrial ecosystems in Alaska through scientific education and research. The Sitka Sound Science Center immediately occupied the Sage and the Mill Buildings.</p><p>The rest of the campus was deeded to Alaska Arts Southeast, which now owns 20 structures and puts on the Sitka Fine Arts Camp, Youth Advocates of Sitka, a social service agency, the Sitka Summer Music Festival, which owns Stevenson Hall, and the State of Alaska, which purchased the Stratton Library in order to expand the Sheldon Jackson Museum. Many of the buildings on the Sheldon Jackson Campus were and continue to be restored and brought back to functionality by the volunteer efforts of community members. 
</p>
          </div>
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
      var text= document.getElementsByClassName("text-col-3")[0];
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