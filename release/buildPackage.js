"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/take");
require("rxjs/add/operator/concatMap");
require("rxjs/add/operator/toPromise");
const npm_1 = require("./utils/npm");
const tar_1 = require("./utils/tar");
const rm_1 = require("./utils/rm");
const fs_1 = require("./utils/fs");
const log_1 = require("./log/log");
const path = require("path");
function buildPackage(packagePath) {
    return npm_1.pack(packagePath).toPromise().then(archiveFilepath => {
        return fs_1.mktmpdir().then(tmpDir => path.resolve(tmpDir))
            .then(tmpPath => [tmpPath, archiveFilepath])
            .catch(console.error);
    })
        .then(([tmpPath, archiveFilepath]) => {
        const tmpTargetPath = path.join(tmpPath, 'package');
        log_1.debug('tmpTargetPath', tmpTargetPath);
        return tar_1.untar(archiveFilepath, tmpPath).toArray().toPromise().then(files => {
            return rm_1.rm(archiveFilepath, '-rf').toPromise();
        })
            .then(res => {
            return tmpTargetPath;
        });
    });
}
exports.buildPackage = buildPackage;
