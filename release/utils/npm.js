"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toArray");
require("rxjs/add/operator/take");
require("rxjs/add/operator/takeUntil");
require("rxjs/add/observable/concat");
require("rxjs/add/observable/empty");
require("rxjs/add/observable/throw");
const path = require("path");
const run_1 = require("../child_process/run");
const toString_1 = require("./toString");
function npm(options, commandName, ...args) {
    if ('string' === typeof options) {
        return npm(undefined, options, commandName, ...args);
    }
    const cmdArgs = [commandName, ...args];
    if (['pack', 'start', 'test'].indexOf(commandName) === -1) {
        cmdArgs.unshift('run');
    }
    const cmd = run_1.run('npm', cmdArgs, options);
    const stdout = cmd.stdout.map(toString_1.toString());
    const stderr = cmd.stderr.map(toString_1.toString()).toArray();
    return Observable_1.Observable.concat(stdout, stderr.mergeMap(errors => {
        if (errors.length) {
            return Observable_1.Observable.throw(new Error(`Failed to run "npm ${args.join(' ')}". ${errors.join('\n---\n')}`));
        }
        return Observable_1.Observable.empty();
    })).takeUntil(cmd.close);
}
exports.npm = npm;
function pack(modulePath) {
    return npm({ cwd: modulePath }, 'pack').map(filename => path.resolve(modulePath, filename.slice(0, -1)));
}
exports.pack = pack;
function readPackage(modulePath) {
    return require(path.resolve(modulePath, 'package.json'));
}
exports.readPackage = readPackage;
