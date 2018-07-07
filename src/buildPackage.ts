import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/toPromise'

import { pack } from './utils/npm'
import { untar } from './utils/tar'
import { rm } from './utils/rm'
import { mktmpdir } from './utils/fs'

import { debug } from './log/log'

import * as path from 'path'

export function buildPackage ( packagePath:string ) {

  return pack(packagePath).toPromise().then ( archiveFilepath => {
    return mktmpdir().then ( tmpDir => path.resolve(tmpDir) )
      .then ( tmpPath => [tmpPath,archiveFilepath] )
      .catch ( console.error )
  } )
  .then ( ([tmpPath,archiveFilepath]) => {
    const tmpTargetPath = path.join(tmpPath,'package')
    debug('tmpTargetPath', tmpTargetPath)
    return untar(archiveFilepath,tmpPath).toArray().toPromise().then ( files => {
      return rm(archiveFilepath,'-rf').toPromise()
    } )
    .then ( res => {
      return tmpTargetPath
    } )
  } )

}