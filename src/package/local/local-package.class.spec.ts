import 'mocha'
import { expect } from 'chai'
import * as path from 'path'

import { LocalNpmPackage } from './local-package.class'

const ROOT_DIR = path.resolve('.')


describe(`Test LocalNpmPackage`,function(){
  
  describe ( `syncToPackages`, () => {

    const sourcePackage = new LocalNpmPackage(ROOT_DIR)
    const targetPackage = new LocalNpmPackage(path.join(ROOT_DIR,'test-target-package'))

    let dirs:string[]

    before((done)=>{

      sourcePackage.syncToPackages(targetPackage).subscribe ( packageDirs => {
        dirs = packageDirs.slice()
        console.log('dirs',dirs)
      }, done, done )

    })

    it(`has dirs`,()=> {

      expect(dirs).to.be.an('array').with.lengthOf(1)

    })

  } )

})

