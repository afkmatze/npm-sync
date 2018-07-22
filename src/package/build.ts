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



export function buildPackage ( packagePath:string ) {

  const name = resolvePackageKey(packagePath,'name')

  const npmPack = run('npm',['pack'],{
    cwd: packagePath
  })

  const packageFileSource = npmPack.stdout.take(1).map ( (output:string) => `${output}`.slice(0,-1) )

  return packageFileSource.mergeMap ( packageFileName => {
    const packageFile = path.join(packagePath,packageFileName)
    return Observable.fromPromise(createTmpDir())
      .mergeMap ( 
        tmpDir => mv(packageFile,tmpDir)
          .map ( tmpDir => path.join(tmpDir,packageFileName) ) 
          .mergeMap ( packageFilePath => {
            return untar(packageFilePath,tmpDir).toArray().mapTo ( path.join(tmpDir,'package') )
          } )
          .map ( files => {
            return path.resolve(files)
          } )
        )
  } )

}
