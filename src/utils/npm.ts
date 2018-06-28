import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toArray'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/observable/concat'
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/throw'

import * as path from 'path'

import { run, RunOptions } from '../child_process/run'
import { IPackageInfo } from '../interfaces/package-info'


import { toString } from './toString'

export function npm ( options:string, ...args:string[] )
export function npm ( options:RunOptions, commandName:string, ...args:string[] )
export function npm ( options:RunOptions|string, commandName?:string, ...args:string[] )
{
  if ( 'string' === typeof options ) {
    return npm ( undefined, options, commandName, ...args )
  }

  const cmdArgs = [commandName,...args]
  if ( ['pack','start','test'].indexOf(commandName) === -1 ) {
    cmdArgs.unshift('run')
  }

  const cmd = run('npm',cmdArgs, options)
  const stdout = cmd.stdout.map ( toString( /* '\x1b[1mSTDOUT\x1b[0m' */) )
  const stderr = cmd.stderr.map ( toString( /* '\x1b[1mSTDERR\x1b[0m' */) ).toArray()

  return Observable.concat(stdout,stderr.mergeMap(errors=>{
    if ( errors.length ) {
      return Observable.throw(new Error(`Failed to run "npm ${args.join(' ')}". ${errors.join('\n---\n')}`))
    }
    return Observable.empty()
  })).takeUntil(cmd.close)
}



export function pack ( modulePath:string ) {
  return npm({cwd: modulePath},'pack').map ( filename => path.resolve(modulePath,filename.slice(0,-1)) )
}


export function readPackage ( modulePath:string ):IPackageInfo {
  return require(path.resolve(modulePath,'package.json'))
}