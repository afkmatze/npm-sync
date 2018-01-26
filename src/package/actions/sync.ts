import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/toArray'
import 'rxjs/add/observable/fromPromise'

import * as path from 'path'

import { untar } from '../../utils/tar'
import { npm, readPackage, pack } from '../../utils/npm'
import { mktmpdir, mkdir, rm } from '../../utils/fs'
import { rsync } from '../../utils/rsync'
import { log, debug } from '../../log/log'



export function packPackage ( sourcePackagePath:string ) {
  
  const archiveSource = pack(sourcePackagePath).map ( (filename:string) => filename.replace(/\n$/,'') )

  log('Packing %s...', sourcePackagePath)

  return Observable.fromPromise(mktmpdir()).mergeMap ( tmpDirectory => {
    tmpDirectory = path.join(process.cwd(),tmpDirectory)
    log(tmpDirectory)
    return untar(archiveSource,tmpDirectory).toArray().mapTo ( path.join(tmpDirectory,'package') )
  } )
}

export function syncToPackage ( sourcePackagePath:string, targetPackagePath:string|string[]|Observable<string> ):Observable<string[]> {

  if ( Array.isArray(targetPackagePath) ) {
    return syncToPackage(sourcePackagePath,Observable.of(...targetPackagePath))
  } else if ( 'string' === typeof targetPackagePath ) {
    return syncToPackage(sourcePackagePath,Observable.of(targetPackagePath))
  }

  const sourcePackageInfo = readPackage(sourcePackagePath)

  return packPackage(sourcePackagePath).mergeMap ( tmpDirectoryPath => {
      return targetPackagePath.mergeMap ( targetPath => {
        log('unpack at %s', targetPath)
        const targetModulePath = path.resolve(targetPath,'node_modules/' + sourcePackageInfo.name)
        return rsync(tmpDirectoryPath+'/.',targetModulePath).toArray().mapTo ( targetModulePath )
      })
      .toArray()
      .concatMap ( packagePaths => {
        return rm(path.dirname(tmpDirectoryPath),'-rf').concat(Observable.of(packagePaths))
      } )
  } )
  
}



