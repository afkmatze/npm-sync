import 'mocha'
import { expect } from 'chai'

import { buildPackage } from './build'
import * as path from 'path'

const PACKAGE_PATH = path.resolve('.')


describe(`Test buildPackage`,function(){

  describe ( `build`, () => {

    let result:string[] = []

    before((done)=>{

      buildPackage(PACKAGE_PATH).subscribe ( output => {
        result.push(output)
      } ).add(done)
      

    })

    it(`has result`,()=> {

      expect(result).to.be.an('array').with.length.greaterThan(0)
      console.log(result)

    })

  } )

})

