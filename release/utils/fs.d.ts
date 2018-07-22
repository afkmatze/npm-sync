/// <reference types="node" />
import * as fs from 'fs';
export { rm } from './rm';
export declare function promiseCallback<T>(resolve: Function, reject: Function, bailValue?: T): (error: Error, result?: T) => void;
/**
 * create directory at filepath;
 * returns promise emitting boolean flag which is
 * true if directory was created,
 * false if it already existed
 *
 * @param      {string}  filepath  The filepath
 * @return     {Promise<boolean>}
 */
export declare function mkdir(filepath: string): Promise<boolean>;
export declare const mktmpdir: typeof fs.mkdtemp.__promisify__;
export declare const readdir: typeof fs.readdir.__promisify__;
export declare const readFile: typeof fs.readFile.__promisify__;
export declare const writeFile: typeof fs.writeFile.__promisify__;
export declare function _readdir(filepath: string, bail?: boolean): Promise<string[]>;
export declare function stats(filepath: string): Promise<fs.Stats>;
export declare function isDirectory(filepath: string, bail?: boolean): Promise<boolean>;
export declare function isFile(filepath: string, bail?: boolean): Promise<boolean>;
