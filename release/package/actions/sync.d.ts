import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/observable/fromPromise';
export declare function packPackage(sourcePackagePath: string): Observable<string>;
export declare function syncToPackage(sourcePackagePath: string, targetPackagePath: string | string[] | Observable<string>): Observable<string[]>;
