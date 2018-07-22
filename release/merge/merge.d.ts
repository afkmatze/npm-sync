export declare function merge<T1 extends Object, T2 extends Object, R extends T1 & T2>(left: T1, right: T2): R;
export declare function mergePackage(left: any, right: any): any;
export declare function readJSON<T = any>(filename: string): Promise<T>;
export declare function writeJSON<T = any>(filename: string, data: T): Promise<T>;
export declare function mergeFiles(left: string, right: string): Promise<any>;
