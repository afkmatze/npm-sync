"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toArray");
require("rxjs/add/operator/takeUntil");
require("rxjs/add/operator/mapTo");
require("rxjs/add/observable/concat");
require("rxjs/add/observable/empty");
require("rxjs/add/observable/throw");
const run_1 = require("../child_process/run");
const toString_1 = require("./toString");
function rm(filename, ...args) {
    const cmd = run_1.run('rm', [...args, filename]);
    const stdout = cmd.stdout.map(toString_1.toString());
    const stderr = cmd.stderr.map(toString_1.toString()).toArray();
    return Observable_1.Observable.concat(cmd.close.mapTo(true), stderr.mergeMap(errors => {
        if (errors.length) {
            return Observable_1.Observable.throw(new Error(`Failed to run "npm ${args.join(' ')}". ${errors.join('\n---\n')}`));
        }
        return Observable_1.Observable.empty();
    })).takeUntil(cmd.close);
}
exports.rm = rm;
