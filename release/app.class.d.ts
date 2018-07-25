import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { IPackageBuilder } from './interfaces/package-builder';
import { IPackageInstaller } from './interfaces/package-installer';
import { IWatchProvier } from './interfaces/watch-provider';
export declare class NPMSyncApp {
    private watchProvider;
    private packageBuilder;
    private packageInstaller;
    constructor(watchProvider: IWatchProvier, packageBuilder: IPackageBuilder, packageInstaller: IPackageInstaller);
    syncPackage(filepath: string, targetPackageDirs: string[]): void;
    watchAndSync(filepath: string, targetPackages: string[]): Observable<string>;
}
