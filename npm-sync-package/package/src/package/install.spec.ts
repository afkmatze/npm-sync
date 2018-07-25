import 'mocha'
import { expect } from 'chai'
import * as path from 'path'
import { syncPackage } from './install'
import { createTmpDir, unlink } from '../child_process/utils'

describe(`Test syncPackage`,function(){

  const PACKAGE_DIR=path.resolve('.')
  
  describe ( `First scenario`, () => {

    let tmpDir:string

    before((done)=>{

      createTmpDir().then ( tmp => {

        console.log('sync "%s" to "%s"', PACKAGE_DIR, tmp)
        return syncPackage(PACKAGE_DIR,tmp).then ( () => {
          done()
        })
      } )
      .catch ( error => {
        console.error(error)
        done(error)
      })

    })

    it(`expectation`,()=> {

      expect(tmpDir).to.be.ok
      console.log('tmpDir',tmpDir)

    })

  } )

})

