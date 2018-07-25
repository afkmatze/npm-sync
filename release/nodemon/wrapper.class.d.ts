/// <reference types="node" />
import { EventEmitter } from 'events';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
export declare class NodemonWrapper extends EventEmitter {
    protected nodemonInstance: any;
    constructor(nodemonInstance: any);
    on(eventName: 'start', callback: {
        (): void;
    }): any;
    on(eventName: 'quit', callback: {
        (): void;
    }): any;
    on(eventName: 'restart', callback: {
        (files: string[]): void;
    }): any;
    private _eventHandler;
    private _bind();
    observe(): Observable<string[]>;
}
