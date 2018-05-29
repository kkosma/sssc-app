<template>
  <div class="content3">
    <div class="container2 ">
      <div class="hero-card">
        <h1 class="page-title" style="">{{post.heading}}</h1>
        <div id="buttonSpacer"></div>
        <div v-html="post.__content"></div>
        <div class="slide-nav nav-button">
        <nuxt-link to="/research/projects" class="nav-right" id="nextBtn">
          <i class="material-icons">keyboard_arrow_right</i>
        </nuxt-link>
        </div>
      </div>
      <div class="hero-image-con"> 
        <img class="obj-fit-cover obj-pos-lc" id="heroimage" :src="post.image"/>
      </div>
    </div>
  </div>
</template>

<script>
//import sectionIndex from '~/components/sectionIndex.vue'
export default {
  components:{
    ///sectionIndex
  },
  asyncData(context) {
    var index = require('~/content/research.md');
		return {
      post: index
    }
  },
  head() {
    return {
      title: this.name,
      script:[
       
	    ]
      
    }
  
  },
 
  	transition: {
		mode:'out-in',
    css:true,
    appear:true,
		
		beforeEnter:function(){
			console.log('beforeenter')

		
		//	container.style.opacity=0;

     // Velocity(heading, { translateX: '-500px'}, { duration:0  })
    //  Velocity(nav, { translateX: '500px'}, { duration:0  })
			//Velocity(container, { opacity: 0}, { duration: 0 })
			
		},
		enter:function(el){
			console.log('sectionindehender')

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

<style scoped>
@import '~/assets/css/globals.css';

*{
  --transX:translateX(-75px);
  --transXEnter:translateX(75px);
}

.hide{
	width:0;
}
.slide-nav{
  right:30px;
  bottom:30px
}
.hero-card{
  position:absolute;
  right:60px;
  top:140px;

  width:680px;
  background-color:white;
  z-index:5;
  padding:80px
}
.content, .container2, .page1{
  height:100%;
  width:100%;
  position:absolute
}
.content{

}

.nav-right{
	background:#0f615e;
}
h1{
 font-size: 3.75rem;
}
h2 {
  text-align: center;
  margin-top: 100px;
  font-family: sans-serif;
    transform: var(--transX);
}
.page-enter-active, .page-leave-active {
  transition-duration: .7s;
      transition-timing-function: cubic-bezier(.65,.05,.51,.99)

}
.page-enter{opacity:1; transition-duration: .7s;}
.page-enter-to{
 transition-duration: .7s;
}
.page-enter .hero-card, .page-enter .hero-image-con  {
 opacity: 0;
  transform: var(--transXEnter);
}
.page-leave-to  {
opacity:1
 }

.page-enter-to .hero-card {
  opacity: 1;
  transform:translateX(0px);
  transition: opacity .6s var(--ease-out-quad), transform .6s var(--ease-out-quad);
     
}
.page-enter-to .hero-image-con {
  opacity: 1;
  transform:translateX(0px);
 
  transition: opacity .6s var(--ease-out-quad), transform .6s var(--ease-out-quad);
transition-delay:.1s;
}
.page-leave-to  .hero-card, .page-leave-to  .hero-image-con {
  opacity: 0;
  transform: var(--transX);
    transition: opacity .6s cubic-bezier(.65,.05,.51,.99), transform .6s cubic-bezier(.65,.05,.51,.99);

}
 .page-leave-to .hero-card {
  opacity: 0;
  transform: var(--transX);
    transition: opacity .6s cubic-bezier(.65,.05,.51,.99) , transform .6s cubic-bezier(.65,.05,.51,.99);
    transition-delay:.1s

}

</style>