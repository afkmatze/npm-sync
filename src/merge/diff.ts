import { keys } from './keys'
import { PartialObject } from './types'

export function diffObject <T> ( left:T, right:T ):Partial<T>|T {
  
  const out:Partial<T>|T = {}
  if ( !right ) {
    return left
  }
  
  keys(left,right).forEach ( <K extends keyof T>(key:K) => {
  
    const diffValue = diff <T[K]> ( left[key], right[key] )

    if ( !diffValue ) {
      // skip if no difference

    } else {
      out[key] = diffValue as T[K]
    }
  
  } )
  
  return out
}

const NON_DIFF_CONSTRUCTORS = [Date,Buffer,ArrayBuffer]

export function isDiffableObject ( value:any ) {

  if ( 'object' !== typeof value ) {
    return false
  }

  if ( Array.isArray(value) ) {
    return false
  }

  return NON_DIFF_CONSTRUCTORS.every ( constr => !(value instanceof constr) )

}

export function diff <T> ( left:T, right:T ):T|Partial<T>|PartialObject<T> {

  if ( left === right ) {
    return undefined
  }

  if ( isDiffableObject(left) ) {
    return diffObject(left,right)
  } else {
    
    if ( left !== right ) {
      return right
    }

  }

}