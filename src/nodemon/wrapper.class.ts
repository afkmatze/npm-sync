import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'

import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/filter'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/fromEvent'

import * as nodemon from 'nodemon'


export class NodemonWrapper {

  constructor ( protected options:any ) {

    this._wrap()

    this.start = this._events.filter ( k => k[0] === 'start' ).mapTo(this)
    this.restart = this._events.filter ( k => k[0] === 'restart' ).map ( k => k.slice(1) )
    this.quit = this._events.filter ( k => k[0] === 'quit' ).mapTo(this)

  }

  private _events:Observable<string[]>

  public get events() {
    return this._events
  }

  readonly start:Observable<this>
  readonly restart:Observable<string[]>
  readonly quit:Observable<this>

  private _wrap ( ) {

    const inst:any = nodemon(this.options)
    this._events = this._observeNodemon(inst)

  }

  private _observeNodemon ( nodemonInstance:any ) {
    return Observable.create((observer:Observer<string[]>) => {

      nodemonInstance.on('start',()=>observer.next(['start']))
      nodemonInstance.on('restart',(files:string[])=>observer.next(['restart',...files]))
      nodemonInstance.on('quit',()=>{
        observer.next(['quit'])
        observer.complete()
      })

    })
  }

}