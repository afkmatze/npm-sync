
const PREFIX = '\x1b[35m[npm-sync]\x1b[0m\t'

export function log ( format:string|any, ...args:any[] ) {

  if ( 'string' !== typeof format ) {
    return log ( '', format, ...args )
  }

  console.log(PREFIX + format, ...args)

}


export function debug ( format:string|any, ...args:any[] ) {

  if ( process.env.NODE_ENV === 'debug' ) {
    return log ( format, ...args )
  }

}