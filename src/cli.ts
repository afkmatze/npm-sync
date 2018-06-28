#!/usr/bin/env node

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/concat'

import * as yargs from 'yargs'
import { rm } from './utils/fs'

import * as path from 'path'
import { syncPackage } from './syncPackage'
import { buildPackage } from './buildPackage'


const argv = yargs
  .usage(`$0 ...targets`)
  .demand(1)
  .help('h')
  .argv


const destinationPackages = argv._.map(p => path.resolve(p))
const sourcePackage = process.cwd()

buildPackage(sourcePackage).then ( tmpPackagePath => {
  console.log('syncing %s to ', tmpPackagePath, destinationPackages)

  return Observable.of(...destinationPackages).mergeMap ( destinationPackage => {
    return syncPackage ( tmpPackagePath, destinationPackage )
  } )
  .toArray()
  .toPromise()
  .then ( destinationPackagePaths => {
    return rm(tmpPackagePath.replace(/\/package$/,''),'-rf').concat(Observable.of(destinationPackagePaths)).toPromise()
  } )

} ).catch( error => {
  console.error(error)
} )

