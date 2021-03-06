export declare function readJSON(filename: string): Promise<any>;
export declare function writeJSON(filename: string, content: any): Promise<void>;
export declare function mergeArray<T>(left: T[], right: T[]): T[];
export declare function mergeValue(left: any, right: any): any;
export declare function mergeObjects<T extends object>(...objs: T[]): any;
export declare function merge(...filenames: string[]): Promise<any>;
