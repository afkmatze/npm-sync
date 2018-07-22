import * as path from 'path'
import * as fs from 'fs'
import * as util from 'util'

export { rm } from './rm'

export function promiseCallback<T> (resolve:Function,reject:Function,bailValue?:T){

  return function(error:Error, result?:T) {

    if ( error ) {
      'undefined' === typeof bailValue ? reject(error) : resolve(bailValue)
    } else {
      resolve(result)
    }

  }
}

/**
 * create directory at filepath; 
 * returns promise emitting boolean flag which is 
 * true if directory was created, 
 * false if it already existed
 *
 * @param      {string}  filepath  The filepath
 * @return     {Promise<boolean>} 
 */
export function mkdir(filepath:string):Promise<boolean> {
  return isDirectory(filepath,false).then ( isDir => {

    if ( !isDir && filepath ) {
      return new Promise<boolean>((resolve,reject) => {
        fs.mkdir(filepath,(error:Error) => {
          error ? reject(error) : resolve(true)
        })
      })
    }

    return Promise.resolve(false)
  } )
}

export const mktmpdir  = util.promisify(fs.mkdtemp)

export const readdir = util.promisify(fs.readdir)

export const readFile = util.promisify(fs.readFile)

export const writeFile = util.promisify(fs.writeFile)


export function _readdir ( filepath:string, bail:boolean=true ):Promise<string[]> {

  return new Promise((resolve, reject)=>{

    fs.readdir(filepath,promiseCallback<string[]>(resolve,reject,bail ? undefined : []))

  })

}

export function stats ( filepath:string ):Promise<fs.Stats> {

  return new Promise((resolve, reject)=>{

    fs.stat(filepath,promiseCallback<fs.Stats>(resolve,reject))

  })

}


export function isDirectory ( filepath:string, bail:boolean=false ) {
  return stats ( filepath )
    .catch ( error => {
      return bail ? Promise.reject(error) : Promise.resolve(false)
    } )
    .then ( stats => typeof stats === 'boolean' ? stats : stats.isDirectory() )
}


export function isFile ( filepath:string, bail:boolean=false ) {
  return stats ( filepath )
    .catch ( error => {
      return bail ? Promise.reject(error) : Promise.resolve(false)
    } )
    .then ( stats => typeof stats === 'boolean' ? stats : stats.isFile() )

}
