import 'mocha'
import { expect } from 'chai'

import { diff } from './diff'


describe(`Test diff`,function(){
  
  describe ( `number values`, () => {

    it(`diff(42,23) => 23`,()=> {
      expect(diff(42,23)).to.equal(23)
    })

    it(`diff(42,42) => undefined`,()=> {
      expect(diff(42,42)).to.equal(undefined)
    })

  } )

  describe ( `string values`, () => {

    it(`diff("Foo","Bar") => "Bar"`,()=> {
      expect(diff("Foo","Bar")).to.equal("Bar")
    })

    it(`diff("Foo","Foo") => undefined`,()=> {
      expect(diff("Foo","Foo")).to.equal(undefined)
    })

  } )

  describe ( `date values`, () => {

    let leftDate=new Date()
    let rightDate=new Date(leftDate.getTime() + (3600 * 1000))
    let diffDate:any

    before(()=>{
      diffDate = diff(leftDate,rightDate)
    })

    it(`diff date is a Date`,()=> {
      expect(diffDate).to.be.instanceOf(Date)
    })

  } )

  describe ( `object values`, () => {

    let leftObject:any = {
      num: 42,
      text: "Hello",
      both: {
        foo: "Bar"
      },
      left: {
        foo: "Bar"
      }
    }

    let rightObject:any = {
      num: 23,
      text: "Hello",
      both: {
        foo: "Bar"
      },
      left: {
        foo: "Bar",
        bar: "blubb"
      },
      right: {
        foo: "Bar"
      }
    }

    let diffObject:any

    before(()=>{
      diffObject = diff(leftObject,rightObject)
    })

    after(()=>{
      console.log('Diff', JSON.stringify(diffObject,null,'  '))
    })

    it(`changed keys num, left, right`,()=> {
      expect(diffObject).to.contain.keys('num','left','right')
    })

    it('num = 23', () => {
      expect(diffObject.num).to.equal(rightObject.num)
    })

    it('left.foo = undefined', () => {
      expect(diffObject.left.foo).to.equal(undefined)
    })

    it('left.bar = "blubb"', () => {
      expect(diffObject.left.bar).to.equal(rightObject.left.bar)
    })

  } )

})

