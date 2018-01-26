import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/of'

import { run } from '../child_process/run'

import { toString } from './toString'

export function untar ( filename:string|Observable<string>, outputDirectory?:string ) 
{
  if ( 'string' === typeof filename ) {
    return untar(Observable.of(filename),outputDirectory)
  }

  return filename.mergeMap ( f => {
     const args = ['xvf', f]
      if ( outputDirectory ) {
        args.push ( '-C', outputDirectory )
      }
      const cmd = run('tar',args)
      return Observable.merge(cmd.stdout.map ( toString() ) , cmd.stderr.map ( toString() )) 
  } )
}
