module.exports = {
  generate: {
    dir: 'dist-static'
  },
  dev: process.env.NODE_ENV === 'DEV',
  resolveLoader: {
    alias: {
     // 'my-loader': path.join(__dirname, '/middleware/myloader.js')
    }
  },
  serverMiddleware: [],
  router: {},
  head: {
    title: 'ssscapp',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=0,minimum-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon-32x32.png' },
    ],
     script:[
      
      { src: '/js/TweenMax.min.js' },
      {src:'/js/velocity.min.js'},
      { src: '/js/velocity.ui.min.js' },
      { src: '/js/juxtapose.js' },
      { src: '/js/impetus.js' },
      { src: "../js/three/build/three.min.js" },
      { src: "../js/three/loaders/JDLoader.min.js" },
      { src: "../js/three/controls/OrbitControlsSmooth.js" },
      { src: "../js/three/controls/DragControls.js" },
      { src: "../js/three/loaders/LoaderSupport.js" },
      { src: "../js/three/loaders/OBJLoader2.js" },

    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: false,
  /*
  ** Build configuration
  */
  build: {
    //vendor: ['leaflet','~/middleware/myloader.js','image-preloader'],
    vendor: ['leaflet'],
    extend(config, { isDev, isClient, isServer }) {
      // Extend only webpack config for client-bundle
      
       // console.log('client')
     // config.resolveLoader.alias={}
      //config.resolveLoader.alias['my-loader'] = path.join(__dirname, '/middleware/myloader.js')
  
      config.module.rules.push({
        test: /\.md/,
        loader: 'markdown-with-front-matter-loader',
      })
      
      if (isClient && process.env.NODE_ENV != 'NDEV') {
        config.target = 'electron-renderer'
      }
      /*
      config.module.rules.forEach((rule) => {
        if (rule.test.toString() === '/\.(png|jpe?g|gif|svg)$/') {
          console.log('img/[name].[hash:7].[ext]')
          rule.use = [
            {
              loader: path.join(__dirname, '/middleware/myloader.js')

            },
            {
              loader: 'url-loader',
              options: {
                limit: 1000,
                name: 'img/[name].[hash:7].[ext]'
              }
            },
            
          ];
          //delete rule.loader;
          //delete rule.options;
        }
      })*/
      
    }
    /*
    ** Run ESLint on save
    */
    
  },
  css: [
    '~assets/css/juxtapose.css',
    '~assets/css/main.css'
    
  ],
  plugins: [
    
  ],
  env: {
    environment: process.env.NODE_ENV,
    buildEnv: process.env.BUILD_ENV || 'undefined',
  },
}
