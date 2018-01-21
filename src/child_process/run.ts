import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/merge'

import { spawn, SpawnOptions } from 'child_process'


export function run ( command:string, args:string[]=[], spawnOptions?:SpawnOptions ) {

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