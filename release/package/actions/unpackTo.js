"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/map");
const run_1 = require("../../child_process/run");
function factory(packageData) {
    return function (archiveFilename, targetDirectory) {
        return run_1.run('tar', ['xf', archiveFilename, '-C', targetDirectory], {
            cwd: packageData.source
        }).stdout.map(d => `${d}`);
    };
}
exports.factory = factory;
