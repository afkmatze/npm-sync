import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/shareReplay'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/zip'


import * as fs from 'fs'
import * as path from 'path'
import * as fsUtils from '../utils/fs'
import { run } from '../child_process/run'
import { pack as npmPack } from '../utils/npm'
import { untar } from '../utils/tar'




import { IDependency } from '../interfaces/dependency'
import { IPackageInfo } from '../interfaces/package-info'
import { IPackageAction, IPackageActionFactory } from '../interfaces/package-action'


import { factory as actionFactoryPack } from './actions/pack'
import { factory as actionFactoryUnpackTo } from './actions/unpackTo'



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

  readonly dependencyPackages=this.dependencies.concatMap ( dependency => {
    return this.resolvePackageModule(dependency.name)
  } )

  /**
   * executes npm pack and returns name of tar archive created
   *
   * @return     {Observable<string>}  observable emitting single value of tar archive filename
   */
  public pack ( ):Observable<string> {

    return npmPack(this.source).map ( filename => filename.slice(0,-1) )
  }
/*
  public unpackTo ( archiveFilename:string ):Observable<string> 
  public unpackTo ( archiveFilename:string, targetDirectory:string ):Observable<string> 
  public unpackTo ( archiveFilename:Observable<string>, targetDirectory:string ):Observable<string> 
  public unpackTo ( archiveFilename:string|Observable<string>, targetDirectory?:string ):Observable<string> 
  {

    if ( targetDirectory === undefined && 'string' === typeof archiveFilename ) {
      return this.unpackTo ( this.pack(), archiveFilename )
    }

    if ( 'string' === typeof archiveFilename ) {
      return this.unpackTo(Observable.of(archiveFilename),targetDirectory)
    }

    const modulenName:string = ''

    return this.info.mergeMap ( info => {
      return fsUtils.mkdir(targetDirectory).then ( () => targetDirectory )
    } ).mergeMap ( packagePath => {
      return archiveFilename.take(1).mergeMap((filename:string)=>{
        return untar(filename,packagePath)
      })
    } )

  }
*/
  protected createAction<R,A extends IPackageActionFactory<R>> ( actionFactory:A ) {

    return this.info.map ( info => actionFactory({
        ...info,
        source: this.source
      }) 
    )

  }


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
    return Observable.fromPromise(fsUtils.readdir(modules_path)).mergeMap ( items => {
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
    return this.assertPackagePath(itemPath).filter ( res => res === true ).map(p => this.createPackage(itemPath))


  }

  protected createPackage ( source:string ):NpmPackage {
    return new NpmPackage(source)
  }


}