import { Observable } from 'rxjs/Observable';
import { IPackage } from './package';
export interface IPackageAction<T> {
    (...args: any[]): T | Promise<T> | Observable<T> | void;
}
export interface IPackageActionFactory<T, A extends IPackageAction<T> = IPackageAction<T>> {
    <P extends IPackage>(packageData: P): A;
}
