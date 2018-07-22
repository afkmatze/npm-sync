import 'mocha'
import { expect } from 'chai'

import * as json from './mergeJSON'


const TEST_OBJ_0 = {
  "name": "Original Name",
  "children": [
    "foo"
  ],
  "deps": {
    "foo": "foobar-dependency"
  }
}

const TEST_OBJ_1 = {
  "name": "New Name",
  "children": [
    "foo",
    "bar"
  ],
  "deps": {
    "foo": "foobar-dependency",
    "bar": "bar-dependency",
  }
}

describe(`Test mergeJSON`,function(){
  
  describe ( `merge json`, () => {

    let merged:any

    before((done)=>{

      merged = json.mergeObjects(TEST_OBJ_0,TEST_OBJ_1)

      done()

    })

    it(`children has "foo" and "bar"`,()=> {
      expect(merged.children).to.contain('foo','bar')
    })

    it(`deps has "foo" and "bar"`,()=> {
      expect(merged.deps).to.contain.keys('foo','bar')
    })

    it(`new name is "New Name"`,()=> {
      expect(merged.name).to.equal(TEST_OBJ_1.name)
    })

  } )

})

