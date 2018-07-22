import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/map';
export declare function syncPackage(sourcePath: string, targetPackagePath: string): Observable<string>;
