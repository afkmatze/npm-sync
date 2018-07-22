"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function keys(obj, ...others) {
    let result = [];
    if (!obj) {
        return result;
    }
    if (others.length > 0) {
        const [next, ...rest] = others;
        result = keys(next, ...rest);
    }
    Object.keys(obj).forEach((key, idx) => {
        if (result.indexOf(key) === -1) {
            result.push(key);
        }
    });
    return result;
}
exports.keys = keys;
