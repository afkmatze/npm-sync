export function toString (debug:false|string=false) {
  return function (value:string|Buffer) {
    if ( debug ) {
      console.log(debug+'\t%s', value)
    }
    if ( 'string' === typeof value ) {
      return value
    } 
    return value.toString('utf8')
  }
}
