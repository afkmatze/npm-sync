import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/concat'
import 'rxjs/add/observable/fromPromise'

import * as Rsync from 'rsync'


import { NpmPackage } from '../package.class'
import { IPackageInfo } from '../../interfaces/package-info'
import * as path from 'path'
import * as fsUtils from '../../utils/fs'
import { untar } from '../../utils/tar'
import * as rsync from 'rsync'


export class LocalNpmPackage extends NpmPackage implements IPackageInfo {

  constructor(source:string){
    super(source)
    const info:IPackageInfo = this.readPackageInfo()
    
    this.name = info.name
    this.version = info.version
    this.dependencies = info.dependencies
    this.devDependencies = info.devDependencies
    this.peerDependencies = info.peerDependencies
  }

  readonly name:string

  readonly version:string

  readonly dependencies:any
  
  readonly devDependencies:any
  
  readonly peerDependencies:any
  

  protected readPackageInfo ():IPackageInfo {
    return require(path.join(this.source,'package.json'))
  }

  unpackTmp () {

    return Observable.fromPromise(fsUtils.mktmpdir(`${this.name}@${this.version}`))
      .mergeMap ( tmpDirectory => {

        return untar(this.pack(),tmpDirectory).toArray().mapTo(path.join(tmpDirectory,'package'))
      } )

  }

  deleteTmp (tmpDirectory:string) {
    const tmp = tmpDirectory.replace(/package$/,'')
    console.log('REMOVE %s', tmp)
    return fsUtils.rm(tmp,'-rf')
  }

  syncToPackage ( tmpDirectory:string, targetPath:string|NpmPackage ) {

    if ( targetPath instanceof NpmPackage ) {
      return this.syncToPackage(tmpDirectory,targetPath.source)
    }

    const p = path.join(targetPath,'node_modules',this.name)

    const rs = new rsync().flags('avzh').source(tmpDirectory+'/.').destination(p).delete()

    return new Promise((resolve,reject)=>{

      rs.execute((error:Error,code:number)=>{
        error ? reject(error) : resolve(p)
      })

    })

  }

  syncToPackages ( ...targetPackages:LocalNpmPackage[] ) {

    return this.unpackTmp().mergeMap ( (tmpDirectory:string) => {

      return Observable.of(...targetPackages).mergeMap ( targetPackage => {
        return this.syncToPackage(tmpDirectory,targetPackage)
      }, 1 ).toArray().concatMap ( pckgs => {
        return this.deleteTmp(tmpDirectory)
      } )

    } )


  }

}
