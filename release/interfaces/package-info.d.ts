export interface IPackageInfo {
    name: string;
    version: string;
    dependencies: {
        [key: string]: string;
    };
    devDependencies?: {
        [key: string]: string;
    };
    peerDependencies?: {
        [key: string]: string;
    };
}
