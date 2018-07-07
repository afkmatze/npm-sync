export function keys <T1,T2, K extends keyof (T1&T2)> ( obj:T1, ...others:T2[] ):K[] {
  let result:K[] = []
  if ( !obj ) {
    return result
  }
  if ( others.length > 0 ) {
    const [ next, ...rest ] = others
    result = keys <T1,T2,K> ( next as any, ...rest )
  }
  (Object.keys(obj) as K[]).forEach((key:K,idx:number)=>{
    if ( result.indexOf(key) === -1 ) {
      result.push(key)
    }
  })
  return result
}