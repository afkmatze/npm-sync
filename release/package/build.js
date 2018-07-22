"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/toArray");
require("rxjs/add/operator/map");
require("rxjs/add/operator/take");
require("rxjs/add/observable/fromPromise");
const run_1 = require("../child_process/run");
const path = require("path");
const utils_1 = require("../child_process/utils");
function buildPackage(packagePath) {
    const name = utils_1.resolvePackageKey(packagePath, 'name');
    const npmPack = run_1.run('npm', ['pack'], {
        cwd: packagePath
    });
    const packageFileSource = npmPack.stdout.take(1).map((output) => `${output}`.slice(0, -1));
    return packageFileSource.mergeMap(packageFileName => {
        const packageFile = path.join(packagePath, packageFileName);
        return Observable_1.Observable.fromPromise(utils_1.createTmpDir())
            .mergeMap(tmpDir => utils_1.mv(packageFile, tmpDir)
            .map(tmpDir => path.join(tmpDir, packageFileName))
            .mergeMap(packageFilePath => {
            return utils_1.untar(packageFilePath, tmpDir).toArray().mapTo(path.join(tmpDir, 'package'));
        })
            .map(files => {
            return path.resolve(files);
        }));
    });
}
exports.buildPackage = buildPackage;
