import { PartialObject } from './types';
export declare function diffObject<T>(left: T, right: T): Partial<T> | T;
export declare function isDiffableObject(value: any): boolean;
export declare function diff<T>(left: T, right: T): T | Partial<T> | PartialObject<T>;
