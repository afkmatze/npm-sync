"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/observable/of");
const run_1 = require("../child_process/run");
const toString_1 = require("./toString");
function untar(filename, outputDirectory) {
    if ('string' === typeof filename) {
        return untar(Observable_1.Observable.of(filename), outputDirectory);
    }
    return filename.mergeMap(f => {
        const args = ['xvf', f];
        if (outputDirectory) {
            args.push('-C', outputDirectory);
        }
        const cmd = run_1.run('tar', args);
        return Observable_1.Observable.merge(cmd.stdout.map(toString_1.toString()), cmd.stderr.map(toString_1.toString()));
    });
}
exports.untar = untar;
