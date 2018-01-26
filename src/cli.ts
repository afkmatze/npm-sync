import * as yargs from 'yargs'
import { NpmSync } from './module'
import * as path from 'path'

const argv = yargs
  .usage(`$0 ...targets`)
  .demand(1)
  .help('h')
  .argv


NpmSync.syncPackage(process.cwd(),argv._.map(p => path.resolve(p)))