"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
const keys_1 = require("./keys");
function merge(left, right) {
    const merged = {};
    function getValue(key) {
        if (key in right) {
            return right[key];
        }
        return left[key];
    }
    keys_1.keys(left, right).forEach((key) => {
        merged[key] = getValue(key);
    });
    return merged;
}
exports.merge = merge;
function mergePackage(left, right) {
    const out = {};
    keys_1.keys(left, right).forEach(key => {
        if (/dependencies/i.test(key)) {
            out[key] = merge(left[key], right[key]);
        }
        else {
            if (key in left) {
                out[key] = left[key];
            }
            else if (key in right) {
                out[key] = right[key];
            }
        }
    });
    return out;
}
exports.mergePackage = mergePackage;
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
function readJSON(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = yield readFile(filename, 'utf8');
        return JSON.parse(json);
    });
}
exports.readJSON = readJSON;
function writeJSON(filename, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = JSON.stringify(data, null, '  ');
        yield writeFile(filename, json, 'utf8');
        return data;
    });
}
exports.writeJSON = writeJSON;
function mergeFiles(left, right) {
    return __awaiter(this, void 0, void 0, function* () {
        const leftData = yield readJSON(left);
        const rightData = yield readJSON(right);
        return mergePackage(leftData, rightData);
    });
}
exports.mergeFiles = mergeFiles;
