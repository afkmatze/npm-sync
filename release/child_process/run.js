"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/take");
require("rxjs/add/operator/takeUntil");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/observable/merge");
const child_process_1 = require("child_process");
function run(command, args = [], spawnOptions) {
    if (process.env.NODE_ENV === 'debug') {
        console.log('\x1b[2m[run]\t\x1b[0;1;35m%s\x1b[0;35m %s\x1b[0m', command, args.join(' '), spawnOptions || '');
    }
    const cp = child_process_1.spawn(command, args, spawnOptions);
    const closeSource = Observable_1.Observable.merge(Observable_1.Observable.fromEvent(cp, 'close'), Observable_1.Observable.fromEvent(cp, 'end')).take(1);
    return {
        stdout: Observable_1.Observable.fromEvent(cp.stdout, 'data').takeUntil(closeSource),
        stderr: Observable_1.Observable.fromEvent(cp.stderr, 'data').takeUntil(closeSource),
        close: closeSource
    };
}
exports.run = run;
