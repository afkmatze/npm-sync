"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
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
function mktmpdir(prefix = 'npm-sync') {
    return new Promise((resolve, reject) => {
        fs.mkdtemp(prefix, promiseCallback(resolve, reject));
    });
}
exports.mktmpdir = mktmpdir;
function readdir(filepath, bail = true) {
    return new Promise((resolve, reject) => {
        fs.readdir(filepath, promiseCallback(resolve, reject, bail ? undefined : []));
    });
}
exports.readdir = readdir;
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
