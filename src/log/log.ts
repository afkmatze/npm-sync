import { wrap } from './color'

const PREFIX = wrap('[npm-sync]',[35,1])

export function log ( format:string|any, ...args:any[] ) {

  if ( 'string' !== typeof format ) {
    return log ( '', format, ...args )
  }

  console.log(PREFIX + ' ' + format, ...args)

}


export function debug ( format:string|any, ...args:any[] ) {

  if ( process.env.NODE_ENV === 'debug' ) {
    return log ( format, ...args )
  }

}