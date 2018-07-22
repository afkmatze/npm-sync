import 'mocha'
import { expect } from 'chai'
import * as path from 'path'
import * as fs from 'fs'

import 'rxjs/add/operator/toPromise'


import { syncPackage } from './install'
import { createTmpDir, unlink } from '../child_process/utils'

describe(`Test syncPackage`,function(){

  const PACKAGE_DIR=path.resolve('.','npm-sync-package/package')
  
  describe ( `First scenario`, () => {

    let tmpDir:string

    before((done)=>{

      createTmpDir().then ( tmp => {

        tmp = path.resolve('.',tmp)

        return syncPackage(PACKAGE_DIR,tmp+'/.').toPromise().then ( () => {
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

    })

  } )

})

