import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { IPackage } from '../../interfaces/package';
export declare function factory<P extends IPackage>(packageData: P): () => Observable<string>;
