#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/concatMap");
require("rxjs/add/operator/concat");
const yargs = require("yargs");
const fs_1 = require("./utils/fs");
const path = require("path");
const syncPackage_1 = require("./syncPackage");
const buildPackage_1 = require("./buildPackage");
const argv = yargs
    .usage(`$0 ...targets`)
    .demand(1)
    .help('h')
    .argv;
const destinationPackages = argv._.map(p => path.resolve(p));
const sourcePackage = process.cwd();
buildPackage_1.buildPackage(sourcePackage).then(tmpPackagePath => {
    console.log('syncing %s to ', tmpPackagePath, destinationPackages);
    return Observable_1.Observable.of(...destinationPackages).mergeMap(destinationPackage => {
        return syncPackage_1.syncPackage(tmpPackagePath, destinationPackage);
    })
        .toArray()
        .toPromise()
        .then(destinationPackagePaths => {
        return fs_1.rm(tmpPackagePath.replace(/\/package$/, ''), '-rf').concat(Observable_1.Observable.of(destinationPackagePaths)).toPromise();
    });
}).catch(error => {
    console.error(error);
});
