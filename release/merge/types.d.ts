export declare type PartialObject<T> = {
    [K in keyof T]?: T[K] | Partial<T[K]>;
};
