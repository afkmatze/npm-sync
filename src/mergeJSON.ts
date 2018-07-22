import * as fs from './utils/fs'


export function readJSON ( filename:string ) {
  return fs.readFile(filename, 'utf8').then ( JSON.parse )
}

export function writeJSON ( filename:string, content:any ) {
  const json = JSON.stringify(content,null,'  ')
  return fs.writeFile(filename,json,'utf8')
}

export function mergeArray <T> ( left:T[], right:T[] ) {
  const addRight = right.filter ( r => left.indexOf(r) === -1 )
  return left.concat(addRight)
}

export function mergeValue ( left:any, right:any ) {

  if ( Array.isArray(right) ) {

    const leftList:any[] = left
    const rightList:any[] = right
    return mergeArray(leftList,rightList)
  } else if ( right instanceof Date ) {
    return right
  } else if ( left instanceof Object || right instanceof Object ) {
    return mergeObjects((left||{}) as any,(right||{}) as any)
  } else {
    return right || left
  }

}

export function mergeObjects <T extends object> ( ...objs:T[] ) {

  const [ a, b, ...rest ] = objs

  if ( !b ) {
    return Object.assign({},a)
  }

  const out:T = Object.assign({},a)
  
  Object.keys(b).forEach ( key => {
    out[key] = mergeValue(a[key],b[key])
  } )

  if ( rest.length > 0 ) {
    const [ next, ...nextObjs ] = rest
    return mergeObjects ( out, next, ...rest )
  }
  return out

}

export function merge ( ...filenames:string[] ) {

  return Promise.all(filenames.map ( filename => readJSON(filename) ))
    .then ( contents => {
      return mergeObjects(...contents)
    } )
}