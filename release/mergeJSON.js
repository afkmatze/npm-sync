"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("./utils/fs");
function readJSON(filename) {
    return fs.readFile(filename, 'utf8').then(JSON.parse);
}
exports.readJSON = readJSON;
function writeJSON(filename, content) {
    const json = JSON.stringify(content, null, '  ');
    return fs.writeFile(filename, json, 'utf8');
}
exports.writeJSON = writeJSON;
function mergeArray(left, right) {
    const addRight = right.filter(r => left.indexOf(r) === -1);
    return left.concat(addRight);
}
exports.mergeArray = mergeArray;
function mergeValue(left, right) {
    if (Array.isArray(right)) {
        const leftList = left;
        const rightList = right;
        return mergeArray(leftList, rightList);
    }
    else if (right instanceof Date) {
        return right;
    }
    else if (left instanceof Object || right instanceof Object) {
        return mergeObjects((left || {}), (right || {}));
    }
    else {
        return right || left;
    }
}
exports.mergeValue = mergeValue;
function mergeObjects(...objs) {
    const [a, b, ...rest] = objs;
    if (!b) {
        return Object.assign({}, a);
    }
    const out = Object.assign({}, a);
    Object.keys(b).forEach(key => {
        out[key] = mergeValue(a[key], b[key]);
    });
    if (rest.length > 0) {
        const [next, ...nextObjs] = rest;
        return mergeObjects(out, next, ...rest);
    }
    return out;
}
exports.mergeObjects = mergeObjects;
function merge(...filenames) {
    return Promise.all(filenames.map(filename => readJSON(filename)))
        .then(contents => {
        return mergeObjects(...contents);
    });
}
exports.merge = merge;
