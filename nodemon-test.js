const path = require('path')
const nodemon = require('nodemon')

nodemon({
  watch: path.resolve('.','src')
}).on('readable',function(){
  console.log('readable',this)
})