"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = require("./keys");
function diffObject(left, right) {
    const out = {};
    if (!right) {
        return left;
    }
    keys_1.keys(left, right).forEach((key) => {
        const diffValue = diff(left[key], right[key]);
        if (!diffValue) {
            // skip if no difference
        }
        else {
            out[key] = diffValue;
        }
    });
    return out;
}
exports.diffObject = diffObject;
const NON_DIFF_CONSTRUCTORS = [Date, Buffer, ArrayBuffer];
function isDiffableObject(value) {
    if ('object' !== typeof value) {
        return false;
    }
    if (Array.isArray(value)) {
        return false;
    }
    return NON_DIFF_CONSTRUCTORS.every(constr => !(value instanceof constr));
}
exports.isDiffableObject = isDiffableObject;
function diff(left, right) {
    if (left === right) {
        return undefined;
    }
    if (isDiffableObject(left)) {
        return diffObject(left, right);
    }
    else {
        if (left !== right) {
            return right;
        }
    }
}
exports.diff = diff;
