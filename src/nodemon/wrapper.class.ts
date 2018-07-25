import { EventEmitter } from 'events'

import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'

import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/filter'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/fromEvent'

import * as nodemon from 'nodemon'


export class NodemonWrapper extends EventEmitter {

  constructor ( protected nodemonInstance:any ) {

    super()

    this._bind()

  }

  public on ( eventName:'start', callback:{():void} )
  public on ( eventName:'quit', callback:{():void} )
  public on ( eventName:'restart', callback:{(files:string[]):void} )
  public on ( eventName:string, callback:{(...args:any[]):void} )
  {
    return super.on(eventName,callback)
  }

  private _eventHandler = ( eventName:string|'start'|'restart'|'quit', files?:string[] ) => {
    this.emit(eventName,files)
  }

  private _bind () {

    this.nodemonInstance.on('start',this._eventHandler.bind(this,'start'))
    this.nodemonInstance.on('quit',this._eventHandler.bind(this,'quit'))
    this.nodemonInstance.on('restart',this._eventHandler.bind(this,'restart'))

  }


  public observe () {

    const start = Observable.fromEvent(this,'start',()=>['start'])
    const restart = Observable.fromEvent(this,'restart',(files:string[])=>['restart',...files])
    const quit = Observable.fromEvent(this,'quit',()=>['quit'])

    return Observable.merge(
        start, restart
      ).takeUntil(quit)

  }


}