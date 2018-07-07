"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/concat");
require("rxjs/add/observable/fromPromise");
const package_class_1 = require("../package.class");
const path = require("path");
const fsUtils = require("../../utils/fs");
const tar_1 = require("../../utils/tar");
const rsync = require("rsync");
const log_1 = require("../../log/log");
const sync_1 = require("../actions/sync");
class LocalNpmPackage extends package_class_1.NpmPackage {
    constructor(source) {
        super(source);
        const info = this.readPackageInfo();
        this.name = info.name;
        this.version = info.version;
        this.dependencies = info.dependencies;
        this.devDependencies = info.devDependencies;
        this.peerDependencies = info.peerDependencies;
    }
    readPackageInfo() {
        return require(path.join(this.source, 'package.json'));
    }
    unpackTmp() {
        return Observable_1.Observable.fromPromise(fsUtils.mktmpdir(`${this.name}@${this.version}`))
            .mergeMap(tmpDirectory => {
            return tar_1.untar(this.pack(), tmpDirectory).toArray().mapTo(path.join(tmpDirectory, 'package'));
        });
    }
    deleteTmp(tmpDirectory) {
        const tmp = tmpDirectory.replace(/package$/, '');
        return fsUtils.rm(tmp, '-rf');
    }
    syncToPackage(tmpDirectory, targetPath, sourcePackageName = this.name) {
        if (targetPath instanceof package_class_1.NpmPackage) {
            return this.syncToPackage(tmpDirectory, targetPath.source, sourcePackageName);
        }
        const p = path.join(targetPath, 'node_modules', sourcePackageName);
        log_1.log('installing package at "%s"', p);
        const rs = new rsync().flags('avzh').source(tmpDirectory + '/.').destination(p).delete();
        return new Promise((resolve, reject) => {
            rs.execute((error, code) => {
                error ? reject(error) : resolve(p);
            });
        });
    }
    syncToPackages(...targetPackages) {
        return sync_1.syncToPackage(this.source, targetPackages.map(p => p.source));
    }
    syncNodeModulesToPackage(targetPackage) {
        const sourcePackageNames = this.dependencyPackages.map(p => p.name).toArray();
        const targetPackageNames = targetPackage.dependencyPackages.map(p => p.name).toArray();
        return Observable_1.Observable.zip(sourcePackageNames, targetPackageNames).mergeMap(([sourcePackages, targetPackages]) => {
            return sourcePackages.filter(sourcePackage => targetPackages.indexOf(sourcePackage) === -1);
        })
            .concatMap(missingPackageName => {
            return sync_1.syncToPackage(path.join(this.source, 'node_modules', missingPackageName), path.join(targetPackage.source, 'node_modules', missingPackageName));
        });
    }
    resolvePackageModule(packageName) {
        return super.resolvePackageModule(packageName);
    }
    createPackage(source) {
        return new LocalNpmPackage(source);
    }
}
exports.LocalNpmPackage = LocalNpmPackage;
