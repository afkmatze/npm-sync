"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/filter");
require("rxjs/add/observable/merge");
require("rxjs/add/observable/fromEvent");
class NodemonWrapper extends events_1.EventEmitter {
    constructor(nodemonInstance) {
        super();
        this.nodemonInstance = nodemonInstance;
        this._eventHandler = (eventName, files) => {
            this.emit(eventName, files);
        };
        this._bind();
    }
    on(eventName, callback) {
        return super.on(eventName, callback);
    }
    _bind() {
        this.nodemonInstance.on('start', this._eventHandler.bind(this, 'start'));
        this.nodemonInstance.on('quit', this._eventHandler.bind(this, 'quit'));
        this.nodemonInstance.on('restart', this._eventHandler.bind(this, 'restart'));
    }
    observe() {
        const start = Observable_1.Observable.fromEvent(this, 'start', () => ['start']);
        const restart = Observable_1.Observable.fromEvent(this, 'restart', (files) => ['restart', ...files]);
        const quit = Observable_1.Observable.fromEvent(this, 'quit', () => ['quit']);
        return Observable_1.Observable.merge(start, restart).takeUntil(quit);
    }
}
exports.NodemonWrapper = NodemonWrapper;
