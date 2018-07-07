import 'mocha'
import { expect } from 'chai'

import { merge, mergePackage } from './merge'
import * as path from 'path'

const TEST_PACKAGE = require(path.resolve('.','./package.json'))
const TEST_PACKAGE_LEFT = TEST_PACKAGE
const TEST_PACKAGE_RIGHT = {
  ...TEST_PACKAGE,
  name: 'foo-package',
  dependencies: {
    foo: "latest"
  }
}

describe(`Test mergePackage`,function(){

  let mergedPackage:any
  
  before(()=>{
      mergedPackage = mergePackage(TEST_PACKAGE_LEFT,TEST_PACKAGE_RIGHT)
  })

  it(`package.name = ${TEST_PACKAGE.name}`,()=> {
    expect(mergedPackage.name).to.equal(TEST_PACKAGE.name)
  })

  it(`package.dependencies contains "foo": "${TEST_PACKAGE_RIGHT.dependencies.foo}"`,()=> {
    expect(mergedPackage.dependencies).to.contain.keys('foo')
  })

  it(`package.dependencies contain keys "${Object.keys(TEST_PACKAGE_LEFT.dependencies).join('", "')}"`,()=> {
    expect(mergedPackage.dependencies).to.contain.keys(...Object.keys(TEST_PACKAGE_LEFT.dependencies))
  })

})

