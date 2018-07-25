"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/toArray");
require("rxjs/add/operator/map");
require("rxjs/add/operator/take");
require("rxjs/add/observable/fromPromise");
const path = require("path");
const utils_1 = require("../child_process/utils");
const Rsync = require("rsync");
function assertExists(filepath, throwIfNot = true) {
    return utils_1.stats(filepath).then(stats => {
        return stats.isDirectory() ? Promise.resolve(true) : Promise.reject(false);
    }).catch(error => {
        return throwIfNot ? Promise.reject(`"${filepath}" does not exist.`) : Promise.resolve(false);
    });
}
exports.assertExists = assertExists;
function assertPackagePath(packagePath, packageName) {
    const packageInstallPath = path.join(packagePath, 'node_modules', packageName);
    return utils_1.promiseChain([
        assertExists(packagePath),
        //assertExists(path.join(packagePath,'package.json')),
        utils_1.mkdirp(packageInstallPath)
    ]).then(results => {
        return packageInstallPath;
    });
}
exports.assertPackagePath = assertPackagePath;
function syncPackage(sourcePackage, targetPackage) {
    const name = utils_1.resolvePackageKey(sourcePackage, 'name');
    const source = path.join(sourcePackage) + '/.';
    const destination = path.join(targetPackage, 'node_modules', name) + '/.';
    console.log('SYNC');
    console.log(source);
    console.log('TO');
    console.log(destination);
    console.log('---');
    const rsync = new Rsync().flags('azh')
        .source(source)
        .destination(destination)
        .recursive()
        .exclude(['.*']);
    return Observable_1.Observable.fromPromise(assertPackagePath(targetPackage, name).then((v) => {
        return new Promise((resolve, reject) => {
            rsync.execute((error, code, cmd) => {
                console.log('cmd\n--\n', cmd);
                if (error) {
                    reject(error);
                }
                else {
                    resolve(targetPackage);
                }
            });
        });
    }));
}
exports.syncPackage = syncPackage;
