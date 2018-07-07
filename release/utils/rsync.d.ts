import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';
/**
 * sync source to destination; emits rsync verbose output
 *
 * @param      {string}  source       The source path
 * @param      {string}  destination  The destination path
 * @return     {Observable<string>}  stdout data by rsync with verbose option
 */
export declare function rsync(source: string, destination: string): Observable<string>;
