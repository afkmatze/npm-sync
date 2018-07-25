import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'

import { IWatchProvier } from '../interfaces/watch-provider'
import { run } from '../child_process/run'
import * as path from 'path'
import { nodemon } from '../nodemon/run'


const NODEMON_BIN = path.join(path.resolve('.'),'node_modules/.bin/nodemon')

export class NodemonWatchProvider implements IWatchProvier {

  watch ( filepath:string ) {

    return nodemon({
      watch: filepath,
      exec: 'printf ""'
    }).map ( (event:string[]) => {
      const [ eventName, ...files ] = event
      return files
    } ).filter ( files => files.length > 0 )

  }

}