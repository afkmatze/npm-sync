import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/toArray'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import 'rxjs/add/observable/fromPromise'

import { run } from '../child_process/run'
import { parse } from '../child_process/parse'

import * as fs from 'fs'
import * as path from 'path'

import { mv, mkdir, mkdirp, promiseChain, stats, unlink, untar, createTmpDir, resolvePackageKey } from '../child_process/utils'
import * as Rsync from 'rsync'


export function assertExists ( filepath:string, throwIfNot:boolean=true ) {

  return stats(filepath).then ( stats => {
    return stats.isDirectory() ? Promise.resolve(true) : Promise.reject(false)
  } ).catch ( error => {
    return throwIfNot ? Promise.reject(`"${filepath}" does not exist.`) : Promise.resolve(false)
  } )

}

export function assertPackagePath ( packagePath:string, packageName:string ):Promise<string> {

  const packageInstallPath = path.join(packagePath,'node_modules',packageName)

  return promiseChain<string|boolean>([
        assertExists(packagePath),
        //assertExists(path.join(packagePath,'package.json')),
        mkdirp(packageInstallPath)
      ]).then ( results => {      
      return packageInstallPath
    } )
  
}


export function syncPackage ( sourcePackage:string, targetPackage:string ):Observable<string> {

  const name = resolvePackageKey(sourcePackage,'name')
  
  const source = path.join(sourcePackage)+'/.'
  const destination = path.join(targetPackage,'node_modules',name)+'/.'

  console.log('SYNC')
  console.log(source)
  console.log('TO')
  console.log(destination)
  console.log('---')

  const rsync = new Rsync().flags('azh')
    .source(source)
    .destination(destination)
    .recursive()
    .exclude(['.*'])

  return Observable.fromPromise<string>(assertPackagePath(targetPackage, name).then ( (v:string) => {
    return new Promise<string>((resolve,reject)=>{
      rsync.execute((error:Error,code:number,cmd:string)=>{
        console.log('cmd\n--\n',cmd)
        if ( error ) {
          reject(error)
        } else {
          resolve(targetPackage)
        }
      })
    })
  }))

}

