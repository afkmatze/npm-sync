import * as path from 'path'
import * as fs from 'fs'


export function promiseCallback<T> (resolve:Function,reject:Function,bailValue?:T){

  return function(error:Error, result?:T) {

    if ( error ) {
      'undefined' === typeof bailValue ? reject(error) : resolve(bailValue)
    } else {
      resolve(result)
    }

  }
}


export function readdir ( filepath:string, bail:boolean=true ):Promise<string[]> {

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