export function color ( colors:number|number[] ) {
  if ( !Array.isArray(colors) ) {
    return color([colors])
  }
  return `\x1b[${colors.join(';')}m`
}

export function wrap ( value:any, colors:number|number[], terminate:number=0 ) {
  if ( 'number' === typeof terminate ) {
    return `${color(colors)}${value}${color(terminate)}`
  }
  return `${color(colors)}${value}`
}

export function light ( value:any, terminate:number=0 ) {
  return wrap ( value, [1], terminate )
}

export function green ( value:any, terminate:number=0 ) {
  return wrap ( value, [32], terminate )
}

export function red ( value:any, terminate:number=0 ) {
  return wrap ( value, [31], terminate )
}

export function yellow ( value:any, terminate:number=0 ) {
  return wrap ( value, [33], terminate )
}