"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toString(debug = false) {
    return function (value) {
        if (debug) {
            console.log(debug + '\t%s', value);
        }
        if ('string' === typeof value) {
            return value;
        }
        return value.toString('utf8');
    };
}
exports.toString = toString;
