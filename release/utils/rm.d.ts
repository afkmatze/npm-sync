import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';
export declare function rm(filename: string, ...args: string[]): Observable<any>;
