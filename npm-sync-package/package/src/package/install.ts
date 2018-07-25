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

import { mv, unlink, untar, createTmpDir, resolvePackageKey } from '../child_process/utils'
import * as Rsync from 'rsync'



export function syncPackage ( sourcePackage:string, targetPackage:string ) {

  const name = resolvePackageKey(sourcePackage,'name')
  const rsync = new Rsync().flags('azh')
    .source(sourcePackage)
    .destination(path.join(targetPackage,'node_modules',name))
    .dry()

  return new Promise((resolve,reject)=>{
    rsync.execute((error:Error,code:number,cmd:string)=>{
      if ( error ) {
        reject(error)
      } else {
        resolve(targetPackage)
      }
    })
  })

}

