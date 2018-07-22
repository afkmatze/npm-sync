import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/delay'
import * as path from 'path'

import 'mocha'
import { expect } from 'chai'

import { NPMSyncApp } from './app.class'


describe(`Test NPMSyncApp`,function(){
  
  this.timeout(10000)

  const app = new NPMSyncApp(
      {
        watch: ( filepath:string ) => {
          //console.log('WATCH -- %s', filepath)
          return Observable.of([filepath]).delay(Math.floor(Math.random()*(3000-500))-500)
        }
      },
      {
        buildPackage: ( filepath:string, tempDir:string=process.env.TMPDIR ) => {

          //console.log('BUILD PACKAGE -- %s\ntmpDir: %s', filepath, tempDir)
          return Observable.of(tempDir).delay(Math.floor(Math.random()*(3000-500))-500)
        }
      },
      {
        installPackage: ( filepath:string, target:string, source:string=filepath ) => {
          //console.log('INSTALL PACKAGE -- %s\ntarget: %s', filepath, target)
          return Observable.of(path.join(target,'node_modules',path.basename(filepath))).delay(Math.floor(Math.random()*(3000-500))-500)
        }
      }
    )

  describe ( `First scenario`, () => {

    let result:any
    const modulePath = path.resolve('.')
    const otherModulePath = path.resolve(modulePath,'../')

    before((done)=>{

      app.watchAndSync(modulePath,[otherModulePath]).subscribe ( targetFilepath => {

        //console.log('targetFilepath',targetFilepath)
        result = targetFilepath
        done()

      } )
      

    })

    it(`has result`,()=> {

      expect(result).to.equal(path.join(otherModulePath,'node_modules/npm-sync'))

    })

  } )

})

