#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/concatMap");
require("rxjs/add/operator/throttleTime");
require("rxjs/add/operator/concat");
const yargs = require("yargs");
const fs_1 = require("./utils/fs");
const path = require("path");
const syncPackage_1 = require("./syncPackage");
const buildPackage_1 = require("./buildPackage");
const log_1 = require("./log/log");
const run_1 = require("./nodemon/run");
const argv = yargs
    .usage(`$0 ...targets`)
    .options({
    watch: {
        alias: 'w',
        type: 'array',
        default: [],
        describe: 'sync package after one of these filepaths have changed.'
    }
})
    .demand(1)
    .help('h')
    .argv;
const destinationPackages = argv._.map(p => path.resolve(p));
const sourcePackage = process.cwd();
function watch() {
    run_1.nodemon({
        watch: argv.watch
    })
        .map(item => {
        //console.log('%s event', new Date().toLocaleTimeString(), item)
        return item;
    })
        .throttleTime(5000)
        .filter(events => events.length > 0)
        .concatMap(events => {
        //console.log('%s syncing', new Date().toLocaleTimeString(), events)
        return sync();
    }).subscribe(events => {
        //console.log('Synced', events)
    }, error => {
        console.error(error);
    });
}
function sync() {
    return buildPackage_1.buildPackage(sourcePackage).then(tmpPackagePath => {
        log_1.debug('syncing %s to ', tmpPackagePath, destinationPackages);
        return Observable_1.Observable.of(...destinationPackages).mergeMap(destinationPackage => {
            return syncPackage_1.syncPackage(tmpPackagePath, destinationPackage);
        })
            .toArray()
            .toPromise()
            .then(destinationPackagePaths => {
            return fs_1.rm(tmpPackagePath.replace(/\/package$/, ''), '-rf')
                .concat(Observable_1.Observable.of(destinationPackagePaths)).toPromise();
        });
    }).catch(error => {
        console.error(error);
    });
}
if (argv.watch && argv.watch.length > 0) {
    console.log('watching filepaths: ', argv.watch);
    watch();
}
else {
    sync();
}
