"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/concatMap");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/toArray");
require("rxjs/add/observable/fromPromise");
const path = require("path");
const tar_1 = require("../../utils/tar");
const npm_1 = require("../../utils/npm");
const fs_1 = require("../../utils/fs");
const rsync_1 = require("../../utils/rsync");
const log_1 = require("../../log/log");
function packPackage(sourcePackagePath) {
    const archiveSource = npm_1.pack(sourcePackagePath).map((filename) => filename.replace(/\n$/, ''));
    log_1.log('Packing %s...', sourcePackagePath);
    return Observable_1.Observable.fromPromise(fs_1.mktmpdir('npm-sync')).mergeMap(tmpDirectory => {
        tmpDirectory = path.join(process.cwd(), tmpDirectory);
        log_1.log(tmpDirectory);
        return tar_1.untar(archiveSource, tmpDirectory).toArray().mapTo(path.join(tmpDirectory, 'package'));
    });
}
exports.packPackage = packPackage;
function syncToPackage(sourcePackagePath, targetPackagePath) {
    if (Array.isArray(targetPackagePath)) {
        return syncToPackage(sourcePackagePath, Observable_1.Observable.of(...targetPackagePath));
    }
    else if ('string' === typeof targetPackagePath) {
        return syncToPackage(sourcePackagePath, Observable_1.Observable.of(targetPackagePath));
    }
    const sourcePackageInfo = npm_1.readPackage(sourcePackagePath);
    return packPackage(sourcePackagePath).mergeMap(tmpDirectoryPath => {
        return targetPackagePath.mergeMap(targetPath => {
            log_1.log('unpack at %s', targetPath);
            const targetModulePath = path.resolve(targetPath, 'node_modules/' + sourcePackageInfo.name);
            return rsync_1.rsync(tmpDirectoryPath + '/.', targetModulePath).toArray().mapTo(targetModulePath);
        })
            .toArray()
            .concatMap(packagePaths => {
            return fs_1.rm(path.dirname(tmpDirectoryPath), '-rf').concat(Observable_1.Observable.of(packagePaths));
        });
    });
}
exports.syncToPackage = syncToPackage;
