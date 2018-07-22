import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { IWatchProvier } from '../interfaces/watch-provider';
export declare class NodemonWatchProvider implements IWatchProvier {
    watch(filepath: string): Observable<string[]>;
}
