import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/merge'

import { spawn, SpawnOptions } from 'child_process'

export interface RunOptions extends SpawnOptions {
}


export function run ( command:string, args:string[]=[], spawnOptions?:RunOptions ) {

  if ( process.env.NODE_ENV === 'debug' ) {
    console.log('\x1b[2m[run]\t\x1b[0;1;35m%s\x1b[0;35m %s\x1b[0m',command, args.join(' '), spawnOptions||'')
  }

  const cp = spawn(command,args,spawnOptions)

  const closeSource = Observable.merge (
    Observable.fromEvent(cp,'close'),
    Observable.fromEvent(cp,'end')
  ).take(1)

  return {
    stdout: Observable.fromEvent(cp.stdout,'data').takeUntil(closeSource) as Observable<Buffer|string>,
    stderr: Observable.fromEvent(cp.stderr,'data').takeUntil(closeSource) as Observable<Buffer|string>,
    close: closeSource
  }

}