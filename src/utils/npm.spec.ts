import 'mocha'
import { expect } from 'chai'
import * as path from 'path'

import { npm, pack } from './npm'

const PACKAGE_DIR = path.resolve('.')

describe(`Test npm`,function(){
  
  this.timeout(10*1000) 

  describe ( `pack ${PACKAGE_DIR}`, () => {

    let archiveFilename:string;

    before((done)=>{

      pack(PACKAGE_DIR).subscribe ( filename => {
        archiveFilename = filename
      }, done, done )
      

    })

    it(`archiveFilename is valid`,()=> {

      expect(archiveFilename).to.be.a('string').which.contain('npm-sync-')

    })

  } )

})

