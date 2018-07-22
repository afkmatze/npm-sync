import * as fs from 'fs'
import * as util from 'util'

import { diff, diffObject, isDiffableObject } from './diff'
import { keys } from './keys'

export function merge <T1 extends Object, T2 extends Object, R extends T1&T2> ( left:T1, right:T2 ):R {

  const merged:Partial<R> = {}

  function getValue ( key:keyof (T1&T2) ) {
    if ( key in right ) {
      return right[key as keyof T2]
    }
    return left[key as keyof T1]
  }

  keys(left,right).forEach ( (key:keyof T1) => {
    merged[key] = getValue(key) as any
  } )

  return merged as R
}


export function mergePackage ( left:any, right:any ) {

  const out:any = {}

  keys(left,right).forEach( key => {
    if ( /dependencies/i.test(key as string) ) {
      out[key] = merge(left[key],right[key])
    } else {
      if ( key in left ) {
        out[key] = left[key]
      } else if ( key in right ) {
        out[key] = right[key]
      }
    }
  } )

  return out

}



const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

export async function readJSON <T=any> ( filename:string ):Promise<T> {
  const json = await readFile(filename,'utf8')
  return JSON.parse(json)
}

export async function writeJSON <T=any> ( filename:string, data:T ):Promise<T> {
  const json = JSON.stringify(data,null,'  ')
  await writeFile(filename,json,'utf8')
  return data
}

export async function mergeFiles ( left:string, right:string ) {
  const leftData = await readJSON(left)
  const rightData = await readJSON(right)

  return mergePackage ( leftData, rightData )
}