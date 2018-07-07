"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.readFile = readFile;
function writeFile(filename, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, 'utf8', (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        });
    });
}
exports.writeFile = writeFile;
function readJSON(filename) {
    return readFile(filename).then(JSON.parse);
}
exports.readJSON = readJSON;
function writeJSON(filename, content) {
    const json = JSON.stringify(content, null, '  ');
    return writeFile(filename, json);
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
