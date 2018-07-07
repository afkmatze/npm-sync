"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/map");
const rsync_1 = require("./utils/rsync");
const path = require("path");
const logger = require("./log");
const merge_1 = require("./merge");
const mergeJSON_1 = require("./mergeJSON");
const rg_node_modules = /\/node_modules*/;
function syncPackage(sourcePath, targetPackagePath) {
    const sourcePackageJSON = path.join(sourcePath, 'package.json');
    const packageInfo = require(sourcePackageJSON);
    if (rg_node_modules.test(targetPackagePath)) {
        targetPackagePath = targetPackagePath.replace(rg_node_modules, '');
    }
    targetPackagePath = path.join(targetPackagePath, 'node_modules', packageInfo.name) + '/';
    const targetPackageJSON = path.join(targetPackagePath, 'package.json');
    logger.log('Syncing %s@%s to %s', logger.light(packageInfo.name), logger.yellow(packageInfo.version), path.relative(process.cwd(), targetPackagePath));
    return rsync_1.rsync(sourcePath + '/.', targetPackagePath)
        .map(file => {
        logger.debug('%s', file.replace(/\n+$/, ''));
        return file;
    })
        .toArray().mapTo(targetPackagePath)
        .mergeMap(targetPackagePath => {
        return merge_1.mergeFiles(sourcePackageJSON, targetPackageJSON).then(merged => {
            return mergeJSON_1.writeJSON(targetPackageJSON, merged);
        }).then(json => targetPackagePath);
    });
}
exports.syncPackage = syncPackage;
