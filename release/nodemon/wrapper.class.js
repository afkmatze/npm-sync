"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/filter");
require("rxjs/add/observable/merge");
require("rxjs/add/observable/fromEvent");
const nodemon = require("nodemon");
class NodemonWrapper {
    constructor(options) {
        this.options = options;
        this._wrap();
        this.start = this._events.filter(k => k[0] === 'start').mapTo(this);
        this.restart = this._events.filter(k => k[0] === 'restart').map(k => k.slice(1));
        this.quit = this._events.filter(k => k[0] === 'quit').mapTo(this);
    }
    get events() {
        return this._events;
    }
    _wrap() {
        const inst = nodemon(this.options);
        this._events = this._observeNodemon(inst);
    }
    _observeNodemon(nodemonInstance) {
        return Observable_1.Observable.create((observer) => {
            nodemonInstance.on('start', () => observer.next(['start']));
            nodemonInstance.on('restart', (files) => observer.next(['restart', ...files]));
            nodemonInstance.on('quit', () => {
                observer.next(['quit']);
                observer.complete();
            });
        });
    }
}
exports.NodemonWrapper = NodemonWrapper;
