import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toArray'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/observable/concat'
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/throw'


import { run, RunOptions } from '../child_process/run'

import { toString } from './toString'

export function rm ( filename:string, ...args:string[] )
{
  
  const cmd = run('rm',[...args,filename])
  const stdout = cmd.stdout.map ( toString( /* '\x1b[1mSTDOUT\x1b[0m' */) )
  const stderr = cmd.stderr.map ( toString( /* '\x1b[1mSTDERR\x1b[0m' */) ).toArray()

  return Observable.concat(cmd.close.mapTo(true),stderr.mergeMap(errors=>{
    if ( errors.length ) {
      return Observable.throw(new Error(`Failed to run "npm ${args.join(' ')}". ${errors.join('\n---\n')}`))
    }
    return Observable.empty()
  })).takeUntil(cmd.close)
}