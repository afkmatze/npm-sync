import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/map'

import { run } from './run'
import { parse } from './parse'

import * as fs from 'fs'
import * as path from 'path'

export function resolvePackageKey ( packagePath:string, key:string ):string {

  const pckg:any = require(path.resolve(packagePath,'package.json'))
  return pckg[key] as string

}

export function createTmpDir ( ):Promise<string> {

  return new Promise((resolve,reject)=>{
    fs.mkdtemp('npm-sync',(error:Error,dirpath:string)=>{
      if ( error ) {
        reject(error)
      } else {
        resolve(dirpath)
      }
    })
  })

}

export function unlink ( filepath:string ) {
  return run('rm',['-rf',filepath]).close
}

export function mv ( source:string, target:string ) {
  return run('mv',[source,target]).close.mapTo ( target )
}


export function untar ( source:string, cwd?:string ) {
  const untar = run('tar',['xvf',path.basename(source)],{cwd})
  return parse(untar.stderr) // tar emits files on stderr
    .map ( filename => `${filename}`.slice(2) )
}

