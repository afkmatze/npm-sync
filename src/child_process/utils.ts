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

export function promiseChain <T> ( promises:Promise<T>[] ):Promise<T[]> {
  const results:T[] = []

  return new Promise((resolve,reject)=>{

    function chain ( ps:Promise<T>[] ) {
      
      if ( ps.length === 0 ) {
        resolve(results)
      } else {

        const [ current, ...next ] = ps
        current.then ( result => {
          results.push(result)
          chain (next)
        } )
        .catch (reject)

      }

    }

    chain(promises)

  })

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

export function splitPath ( filepath:string ) {

  let current:string = path.resolve(filepath)
  let parts:string[] = [current]

  let basename:string

  do {
    basename = path.basename(current)
    current = path.resolve(current,'..')
    if ( current !== '/' ) {
      parts.unshift(current)
    } else {
      break
    }
  }while(true)

  return parts
}

export function mkdirp ( filepath:string ):Promise<string> {

  const parts = splitPath(filepath)

  return promiseChain(parts.map ( part => {
    return exists(part).then ( ex => {
      return ex ? Promise.resolve(part) : mkdir(part)
    } )
  } )).then ( parts => {
    return filepath
  } )

}

export function mkdir ( filepath:string ):Promise<string> {

  return new Promise((resolve,reject)=>{
    fs.mkdir(filepath,(error:Error)=>{
      if ( error ) {
        reject(error)
      } else {
        resolve(filepath)
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

export function stats ( filename:string ):Promise<fs.Stats> {

  return new Promise((resolve,reject)=>{
    fs.stat(filename,(error:Error,stats:fs.Stats) => {

      if ( error ) {
        reject(error)
      } else {
        resolve(stats)
      }

    })
  })

}

export function exists ( filepath:string ):Promise<boolean> {
  return stats (filepath).then ( s => true ).catch ( e => Promise.resolve(false) )
}