import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/mergeMap'

export function parse ( source:Observable<Buffer|string>, sep:string[1]='\n' ):Observable<string> {

  let buffer:string = ''

  return Observable.create((observer:Observer<string>)=>{

    function processData ( data:Buffer|string ) {
      if ( 'string' === typeof data ) {
        buffer += data
        const parts = buffer.split(sep)
        while ( parts.length > 1 ) {
          observer.next(parts.shift())
        }
        buffer = parts.pop()
      } else {
        processData(data.toString('utf8'))
      }
    }

    function flush () {
      buffer && observer.next(buffer)
      observer.complete()
    }

    source.subscribe ( data => {
      processData(data)
    }, error => {
      observer.error(error)
    } ).add(flush)

  })

}