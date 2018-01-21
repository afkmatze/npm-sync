import 'mocha'
import { expect } from 'chai'

import 'rxjs/add/operator/take'

import { NodemonWatchProvider } from './nodemon'

import * as path from 'path'
import * as fs from 'fs'

const ROOT_DIR=path.resolve('.','src')

function touch() {
  fs.writeFileSync(path.join(ROOT_DIR,'touched.ts'),'')
  fs.writeFileSync(path.join(ROOT_DIR,'touched2.ts'),'')
}


describe(`Test NodemonWatchProvider`,function(){

  const watchProvider = new NodemonWatchProvider()
  
  describe ( `watch src`, () => {

    let hasChanged:boolean=false

    before((done)=>{

      watchProvider.watch(ROOT_DIR).take(1)
      .subscribe ( changed => {
        hasChanged = true
        done()
      } )

      setTimeout(()=>{
        touch()
      },300)
      

    })

    it(`has changed`,()=> {
      expect(hasChanged).to.equal(true)
    })

  } )

})

