import 'mocha'
import { expect } from 'chai'

import { splitPath, promiseChain} from './utils'
import * as path from 'path'

const PACKAGE_DIR = path.resolve('.')

const numParts = PACKAGE_DIR.split('/').length-1

function createPromise<T>(delay:number,value:T|Error):Promise<T>
{
  return new Promise((resolve,reject)=>{

    setTimeout(()=>{

      if ( value instanceof Error ) {
        reject(value)
      }else {
        resolve(value)
      }

    },delay)

  })
}

describe(`Test promiseChain`,function(){

  describe(`promiseChain - success`,function(){

    let keys = [
      'foo', 'bar', 'blub'
    ]

    const c = keys.map ( (k:string,i:number) => createPromise<string>((keys.length-i)*100,k) )

    let result:string[]

    before((done)=>{

      promiseChain(c).then ( chainResult => {
        result = chainResult.slice()
        done()
      } ).catch(done)

    })

    it('result',()=>{

      expect(result).to.be.an('array').with.length.greaterThan(0)

    })

  })

})

describe(`Test splitPath`,function(){
  
  describe ( `${PACKAGE_DIR}`, () => {

    let parts:string[]

    before((done)=>{

      parts = splitPath(PACKAGE_DIR)

      done()

    })

    it(`expect ${numParts} parts`,()=> {

      expect(parts).to.be.an('array').with.lengthOf(numParts)
      
    })

  } )

})

