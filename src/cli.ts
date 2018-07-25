#!/usr/bin/env node

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/throttleTime'
import 'rxjs/add/operator/concat'

import * as yargs from 'yargs'
import { rm } from './utils/fs'

import * as path from 'path'
import { syncPackage } from './syncPackage'
import { buildPackage } from './buildPackage'
import logger from './log'
import { nodemon } from './nodemon/run'



const argv = yargs
  .usage(`$0 ...targets`)
  .options({
    watch: {
      alias: 'w',
      type: 'array',
      default: [],
      describe: 'sync package after one of these filepaths have changed.'
    }
  })
  .demand(1)
  .help('h')
  .argv


const destinationPackages = argv._.map(p => path.resolve(p))
const sourcePackage = process.cwd()

function watch () {

  nodemon({
    watch: argv.watch
  })
  .map ( item => {
    //console.log('%s event', new Date().toLocaleTimeString(), item)
    return item
  } )
  .throttleTime ( 5000 )
  .filter ( events => events.length > 0 )
  .concatMap ( events => {
    //console.log('%s syncing', new Date().toLocaleTimeString(), events)
    return sync()
  } ).subscribe ( events => {
    //console.log('Synced', events)
  }, error => {
    console.error(error)
  } )

}


function sync () {
  
  return buildPackage(sourcePackage).then ( tmpPackagePath => {
    
    logger.debug('syncing %s to ', tmpPackagePath, destinationPackages)

    return Observable.of(...destinationPackages).mergeMap ( destinationPackage => {
      return syncPackage ( tmpPackagePath, destinationPackage )
    } )
    .toArray()
    .toPromise()
    .then ( destinationPackagePaths => {
      return rm(tmpPackagePath.replace(/\/package$/,''),'-rf')
              .concat(Observable.of(destinationPackagePaths)).toPromise()
    } )

  } ).catch( error => {
    console.error(error)
  } )

}



if ( argv.watch && argv.watch.length > 0 ) {

  logger.log('watching filepaths: ', argv.watch)
  watch()

} else {

  sync()

}
