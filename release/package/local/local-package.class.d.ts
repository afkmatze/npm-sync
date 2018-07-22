import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/fromPromise';
import { NpmPackage } from '../package.class';
import { IPackageInfo } from '../../interfaces/package-info';
export declare class LocalNpmPackage extends NpmPackage implements IPackageInfo {
    constructor(source: string);
    readonly name: string;
    readonly version: string;
    readonly dependencies: any;
    readonly devDependencies: any;
    readonly peerDependencies: any;
    readonly dependencyPackages: Observable<LocalNpmPackage>;
    protected readPackageInfo(): IPackageInfo;
    unpackTmp(): Observable<string>;
    deleteTmp(tmpDirectory: string): Observable<any>;
    syncToPackage(tmpDirectory: string, targetPath: string | NpmPackage, sourcePackageName?: string): any;
    syncToPackages(...targetPackages: LocalNpmPackage[]): Observable<string[]>;
    syncNodeModulesToPackage(targetPackage: LocalNpmPackage): Observable<string[]>;
    protected resolvePackageModule(packageName: string): Observable<LocalNpmPackage>;
    protected createPackage(source: string): LocalNpmPackage;
}
