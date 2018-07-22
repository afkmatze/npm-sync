import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
export declare function untar(filename: string | Observable<string>, outputDirectory?: string): Observable<string>;
