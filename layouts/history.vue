<template>
  <div class="page">
     <nuxt-link to="/history"><div class="back-button nav-button"><i class="material-icons">keyboard_arrow_left</i></div></nuxt-link>
    <nuxt/>
    <div class="slide-nav nav-button">
    <div class="nav-left"><i class="material-icons">keyboard_arrow_left</i></div>
    <nuxt-link to="/history/1929"class="nav-right">
    <div ><i class="material-icons">keyboard_arrow_right</i></div>
    </nuxt-link>
  </div>
  <div class="flex-con">{{route}}
    <div class="time-dot"><div class="dot active"></div></div>
    <div class="time-dot"><div class="dot"></div></div>
    <div class="time-dot"><div class="dot"></div></div>
    <div class="time-dot"><div class="dot"></div></div>
    <div class="time-dot"><div class="dot"></div></div>
    <div class="time-dot"><div class="dot"></div></div>
  </div>
  </div>
</template>
<script>
export default {
	mounted () {
	},
	asyncData() {
		return {
      years:['1910','1929','2001'],
      route: this.$route.name
		//	name: process.static ? 'static' : (process.server ? 'server' : 'client')
		}
	},
}
</script>
<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.mark-brand{
  background: url('/images/logo2.svg');
  width:300px;
  height:120px;
  position:fixed;
  left:20px;
  top:20px;
  z-index:33;
  background-repeat:no-repeat;
}
</style>
