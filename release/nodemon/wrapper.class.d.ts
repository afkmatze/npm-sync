import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
export declare class NodemonWrapper {
    protected options: any;
    constructor(options: any);
    private _events;
    readonly events: Observable<string[]>;
    readonly start: Observable<this>;
    readonly restart: Observable<string[]>;
    readonly quit: Observable<this>;
    private _wrap();
    private _observeNodemon(nodemonInstance);
}
