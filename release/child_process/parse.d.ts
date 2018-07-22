/// <reference types="node" />
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
export declare function parse(source: Observable<Buffer | string>, sep?: string[1]): Observable<string>;
