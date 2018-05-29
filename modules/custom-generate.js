fsExtra=require('fs-extra')
path= require('path')
module.exports = function () {
  this.nuxt.hook('generate:distCopied',   nuxt => {
    console.log('dist', nuxt.distPath, 'd', path.resolve(nuxt.distPath, '/video'))
     fsExtra.remove(nuxt.distPath+ '/video')
  });
};