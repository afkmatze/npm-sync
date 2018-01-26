import 'mocha'
import { expect } from 'chai'
import * as path from 'path'

import { NpmPackage } from './package.class'

const PACKAGE_ROOT:string = path.resolve('.')
const TARGET_PACKAGE_ROOT:string = path.join(PACKAGE_ROOT,'test-target-package')

describe(`Test NpmPackage`,function(){

  const pckg = new NpmPackage(PACKAGE_ROOT)
  
  describe ( `reading info`, () => {

    let info:any

    before((done)=>{

      pckg.info.subscribe ( packageInfo => {
        info = packageInfo
      } , done, done )

    })

    it(`info has name and version`,()=> {

      expect(info).to.contain.keys('name','version')


    })

  } )

  describe ( `reading dependencies`, () => {

    let deps:any[]=[]

    before((done)=>{

      pckg.dependencies.subscribe ( dependency => {
        deps.push(dependency)
      } , done, done )

    })

    it(`has dependencies`,()=> {

      expect(deps).to.have.length.greaterThan(0)
      console.log('deps',deps)


    })

  } )


  describe ( `reading dependency packages`, () => {

    let deps:any[]=[]

    before((done)=>{

      pckg.dependencyPackages.subscribe ( modPackage => {
        deps.push(modPackage)
      } , done, done )

    })

    it(`has packages`,()=> {

      expect(deps).to.have.length.greaterThan(0)
      deps.forEach((dep) => {
        console.log(dep.source)
      })


    })

  } )

/*
  describe(`unpack`, () => {

    let output:string[]=[]
    let targetPackage = new NpmPackage(TARGET_PACKAGE_ROOT)

    before((done)=>{

      pckg.unpackTo(pckg.pack(),targetPackage).subscribe ( out => {
        output.push(out)
        console.log(out)
      }, done, done )

    })    

    it('output',()=>{
      expect(output).to.be.an('array').with.length.greaterThan(0)
    })

  })*/

})

