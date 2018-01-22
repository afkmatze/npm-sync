"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/concatMap");
require("rxjs/add/operator/toArray");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
class NPMSyncApp {
    constructor(watchProvider, packageBuilder, packageInstaller) {
        this.watchProvider = watchProvider;
        this.packageBuilder = packageBuilder;
        this.packageInstaller = packageInstaller;
    }
    watchAndSync(filepath, targetPackages) {
        return this.watchProvider.watch(filepath).concatMap(changes => {
            return this.packageBuilder.buildPackage(filepath).mergeMap(tempPackagePath => {
                return Observable_1.Observable.of(...targetPackages)
                    .concatMap(targetPackage => {
                    return this.packageInstaller.installPackage(tempPackagePath, targetPackage);
                });
            });
        });
    }
}
exports.NPMSyncApp = NPMSyncApp;
