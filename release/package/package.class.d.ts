import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import { IDependency } from '../interfaces/dependency';
import { IPackageInfo } from '../interfaces/package-info';
import { IPackageAction, IPackageActionFactory } from '../interfaces/package-action';
export declare class NpmPackage {
    readonly source: string;
    constructor(source: string);
    readonly info: Observable<IPackageInfo>;
    readonly dependencies: Observable<IDependency>;
    readonly modulePackages: Observable<NpmPackage>;
    readonly dependencyPackages: Observable<NpmPackage>;
    /**
     * executes npm pack and returns name of tar archive created
     *
     * @return     {Observable<string>}  observable emitting single value of tar archive filename
     */
    pack(): Observable<string>;
    protected createAction<R, A extends IPackageActionFactory<R>>(actionFactory: A): Observable<IPackageAction<R>>;
    readPackageConfig<T extends IPackageInfo>(): Promise<T>;
    readPackageModules(): Observable<NpmPackage>;
    protected assertPackagePath(filepath: string): Observable<boolean>;
    protected resolvePackageModule(packageName: string): Observable<NpmPackage>;
    protected createPackage(source: string): NpmPackage;
}
