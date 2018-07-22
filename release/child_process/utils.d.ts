/// <reference types="node" />
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/map';
import * as fs from 'fs';
export declare function resolvePackageKey(packagePath: string, key: string): string;
export declare function promiseChain<T>(promises: Promise<T>[]): Promise<T[]>;
export declare function createTmpDir(): Promise<string>;
export declare function splitPath(filepath: string): string[];
export declare function mkdirp(filepath: string): Promise<string>;
export declare function mkdir(filepath: string): Promise<string>;
export declare function unlink(filepath: string): Observable<{}>;
export declare function mv(source: string, target: string): Observable<string>;
export declare function untar(source: string, cwd?: string): Observable<string>;
export declare function stats(filename: string): Promise<fs.Stats>;
export declare function exists(filepath: string): Promise<boolean>;
