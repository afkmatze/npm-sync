import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/shareReplay'
import 'rxjs/add/operator/filter'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of'


import * as fs from 'fs'
import * as path from 'path'
import * as fsUtils from '../utils/fs'


import { IDependency } from '../interfaces/dependency'
import { IPackageInfo } from '../interfaces/package-info'



export class NpmPackage {

  constructor(
      readonly source:string
    ){
    this.source = path.resolve(source)
  }

  readonly info:Observable<IPackageInfo>=Observable.fromPromise(this.readPackageConfig<IPackageInfo>())



  readonly dependencies:Observable<IDependency>=this.info.mergeMap ( info => {
    return Object.keys(info.dependencies).map ( name => {

      const dependency:IDependency = {
        name,
        version: info.dependencies[name]
      }

      return dependency
    } )
  } )

  readonly modulePackages=this.readPackageModules().shareReplay()

  readonly dependencyPackages:Observable<NpmPackage>=this.dependencies.concatMap ( dependency => {
    return this.resolvePackageModule(dependency.name)
  } )

  readPackageConfig <T extends IPackageInfo> ():Promise<T> {

    return new Promise((resolve,reject) => {

      let info:T
      let error:Error
      
      try{
        info = require(path.join(this.source,'package.json'))
      }catch(e){
        error = e
      }

      if ( error ) {
        reject(error)
      } else {
        resolve(info)
      }

    })

  }

  readPackageModules ():Observable<NpmPackage> {

    const modules_path = path.join(this.source,'node_modules')
    return Observable.fromPromise(fsUtils.readdir(modules_path,false)).mergeMap ( items => {
      return Observable.of(...items)
      .concatMap ( item => {
        return this.resolvePackageModule(item)
      } )
    } )


  }

  protected assertPackagePath ( filepath:string ):Observable<boolean> {

    if ( path.basename(filepath).substr(0,1) === '.' ) {
      return Observable.of(false)
    } else {
      return Observable.fromPromise(fsUtils.isFile(path.join(filepath,'package.json')))
    }

  }

  protected resolvePackageModule ( packageName:string ):Observable<NpmPackage> {

    const itemPath = path.join(this.source,'node_modules',packageName)
    return this.assertPackagePath(itemPath).filter ( res => res === true ).map(p => new NpmPackage(itemPath))


  }


}