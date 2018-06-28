/// <reference types="node" />
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { SpawnOptions } from 'child_process';
export interface RunOptions extends SpawnOptions {
}
export declare function run(command: string, args?: string[], spawnOptions?: RunOptions): {
    stdout: Observable<string | Buffer>;
    stderr: Observable<string | Buffer>;
    close: Observable<{}>;
};
