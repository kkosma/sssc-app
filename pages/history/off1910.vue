<template>
<div class="">
 
  <div class="content">
    <div class="container-fluid ">
        <div class="row-h row-t-half" style="padding-bottom:0px">
          <div class="col" style="margin:0px;overflow:hidden;">
           <div class="juxtapose" style="width:100vw!important" id="historycompare" data-animate="true" data-makeresponsive="false" data-startingposition="99%">
              <img src="/images/history/sheldon-jackson-teens2.jpg" />
              <img src="/images/history/sheldon-jackson-nowcolor.jpg" />
            </div>
          </div>
        </div>
    </div>
    <div class="container2 ">
      <div class="row-h">
        <div class="col" >
          <h1 class="page-title">Sheldon Jackson Campus</h1>
        </div>
      </div>
      <div class="row-h">
        <div class="col" >
          <div class="text-col-3"><p>The Sitka Sound Science Center is an anchor landowner on the former Sheldon Jackson College campus on the east side of Lincoln Street near the Sitka National Historic Park. The campus is now owned by several nonprofits, but the buildings were once owned by Sheldon Jackson College, which began in the 1880s as a Presbyterian Missionary School for Alaska Natives.</p><p>The Sheldon Jackson School was set up by Presbyterian missionaries to train Alaska Natives in vocational skills. Boys learned boat building, printing and shoe repair, and girls learn ‘domestic skills’ such as housekeeping and cooking. In 1910, the school rebuilt a campus that was designed by the famous New York architectural firm Ludlow and Peabody, designers of Time Square and the New York Times building in New York City. Over the years, Sheldon Jackson was a vocational school, a grade school, a high school, a two year college and ultimately a four year college.</p></div>
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
		console.log('montr',juxtapose)
		juxtapose.sliders=[]
		  juxtapose.scanPage();
  //JXSlider.updateSlider(percentage, animate);
  
		
	var containerElement
	var scroller;


	},
	asyncData(context) {
		return {
		//	name: process.static ? 'static' : (process.server ? 'server' : 'client')
		currentRoute: (context.route.name).split('-').pop(),
		}
	},
	head: {
	title: 'History',

  },
	//layout:'history',
	transition: {
		mode:'out-in',
		css:false,
		name:'childIn',
		appear:true,
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
					
			setTimeout(() => {
    console.log('weereee',juxtapose.sliders,this)
   	juxtapose.sliders[0].updateSlider("50%", true);
  }, 400);
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
			console.log('ellemmmmm',el)
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
	max-height:100%;
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