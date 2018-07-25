"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toArray");
require("rxjs/add/operator/takeUntil");
require("rxjs/add/observable/concat");
require("rxjs/add/observable/empty");
require("rxjs/add/observable/throw");
const run_1 = require("../child_process/run");
const toString_1 = require("./toString");
/**
 * sync source to destination; emits rsync verbose output
 *
 * @param      {string}  source       The source path
 * @param      {string}  destination  The destination path
 * @return     {Observable<string>}  stdout data by rsync with verbose option
 */
function rsync(source, destination) {
    const cmd = run_1.run('rsync', ['-avzh', '--delete', source, destination]);
    const stdout = cmd.stdout.map(toString_1.toString());
    const stderr = cmd.stderr.map(toString_1.toString()).toArray();
    return Observable_1.Observable.concat(stdout, stderr.mergeMap(errors => {
        if (errors.length) {
            return Observable_1.Observable.throw(new Error(`Failed to sync "${source}" to "${destination}". ${errors.join('\n---\n')}`));
        }
        return Observable_1.Observable.empty();
    })).takeUntil(cmd.close);
}
exports.rsync = rsync;
