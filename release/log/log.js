"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./color");
const PREFIX = color_1.wrap('[npm-sync]', [35, 1]);
function log(format, ...args) {
    if ('string' !== typeof format) {
        return log('', format, ...args);
    }
    console.log(PREFIX + ' ' + format, ...args);
}
exports.log = log;
function debug(format, ...args) {
    if (process.env.NODE_ENV === 'debug') {
        return log(format, ...args);
    }
}
exports.debug = debug;
