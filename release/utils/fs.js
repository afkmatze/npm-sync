"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
var rm_1 = require("./rm");
exports.rm = rm_1.rm;
function promiseCallback(resolve, reject, bailValue) {
    return function (error, result) {
        if (error) {
            'undefined' === typeof bailValue ? reject(error) : resolve(bailValue);
        }
        else {
            resolve(result);
        }
    };
}
exports.promiseCallback = promiseCallback;
/**
 * create directory at filepath;
 * returns promise emitting boolean flag which is
 * true if directory was created,
 * false if it already existed
 *
 * @param      {string}  filepath  The filepath
 * @return     {Promise<boolean>}
 */
function mkdir(filepath) {
    return isDirectory(filepath, false).then(isDir => {
        if (!isDir && filepath) {
            return new Promise((resolve, reject) => {
                fs.mkdir(filepath, (error) => {
                    error ? reject(error) : resolve(true);
                });
            });
        }
        return Promise.resolve(false);
    });
}
exports.mkdir = mkdir;
exports.mktmpdir = util.promisify(fs.mkdtemp);
exports.readdir = util.promisify(fs.readdir);
exports.readFile = util.promisify(fs.readFile);
exports.writeFile = util.promisify(fs.writeFile);
function _readdir(filepath, bail = true) {
    return new Promise((resolve, reject) => {
        fs.readdir(filepath, promiseCallback(resolve, reject, bail ? undefined : []));
    });
}
exports._readdir = _readdir;
function stats(filepath) {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, promiseCallback(resolve, reject));
    });
}
exports.stats = stats;
function isDirectory(filepath, bail = false) {
    return stats(filepath)
        .catch(error => {
        return bail ? Promise.reject(error) : Promise.resolve(false);
    })
        .then(stats => typeof stats === 'boolean' ? stats : stats.isDirectory());
}
exports.isDirectory = isDirectory;
function isFile(filepath, bail = false) {
    return stats(filepath)
        .catch(error => {
        return bail ? Promise.reject(error) : Promise.resolve(false);
    })
        .then(stats => typeof stats === 'boolean' ? stats : stats.isFile());
}
exports.isFile = isFile;
