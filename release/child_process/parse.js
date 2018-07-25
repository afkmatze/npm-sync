"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/mergeMap");
function parse(source, sep = '\n') {
    let buffer = '';
    return Observable_1.Observable.create((observer) => {
        function processData(data) {
            if ('string' === typeof data) {
                buffer += data;
                const parts = buffer.split(sep);
                while (parts.length > 1) {
                    observer.next(parts.shift());
                }
                buffer = parts.pop();
            }
            else {
                processData(data.toString('utf8'));
            }
        }
        function flush() {
            buffer && observer.next(buffer);
            observer.complete();
        }
        source.subscribe(data => {
            processData(data);
        }, error => {
            observer.error(error);
        }).add(flush);
    });
}
exports.parse = parse;
