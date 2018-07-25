"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/map");
const run_1 = require("./run");
const parse_1 = require("./parse");
const fs = require("fs");
const path = require("path");
function resolvePackageKey(packagePath, key) {
    const pckg = require(path.resolve(packagePath, 'package.json'));
    return pckg[key];
}
exports.resolvePackageKey = resolvePackageKey;
function promiseChain(promises) {
    const results = [];
    return new Promise((resolve, reject) => {
        function chain(ps) {
            if (ps.length === 0) {
                resolve(results);
            }
            else {
                const [current, ...next] = ps;
                current.then(result => {
                    results.push(result);
                    chain(next);
                })
                    .catch(reject);
            }
        }
        chain(promises);
    });
}
exports.promiseChain = promiseChain;
function createTmpDir() {
    return new Promise((resolve, reject) => {
        fs.mkdtemp('npm-sync', (error, dirpath) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(dirpath);
            }
        });
    });
}
exports.createTmpDir = createTmpDir;
function splitPath(filepath) {
    let current = path.resolve(filepath);
    let parts = [current];
    let basename;
    do {
        basename = path.basename(current);
        current = path.resolve(current, '..');
        if (current !== '/') {
            parts.unshift(current);
        }
        else {
            break;
        }
    } while (true);
    return parts;
}
exports.splitPath = splitPath;
function mkdirp(filepath) {
    const parts = splitPath(filepath);
    return promiseChain(parts.map(part => {
        return exists(part).then(ex => {
            return ex ? Promise.resolve(part) : mkdir(part);
        });
    })).then(parts => {
        return filepath;
    });
}
exports.mkdirp = mkdirp;
function mkdir(filepath) {
    return new Promise((resolve, reject) => {
        fs.mkdir(filepath, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(filepath);
            }
        });
    });
}
exports.mkdir = mkdir;
function unlink(filepath) {
    return run_1.run('rm', ['-rf', filepath]).close;
}
exports.unlink = unlink;
function mv(source, target) {
    return run_1.run('mv', [source, target]).close.mapTo(target);
}
exports.mv = mv;
function untar(source, cwd) {
    const untar = run_1.run('tar', ['xvf', path.basename(source)], { cwd });
    return parse_1.parse(untar.stderr) // tar emits files on stderr
        .map(filename => `${filename}`.slice(2));
}
exports.untar = untar;
function stats(filename) {
    return new Promise((resolve, reject) => {
        fs.stat(filename, (error, stats) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(stats);
            }
        });
    });
}
exports.stats = stats;
function exists(filepath) {
    return stats(filepath).then(s => true).catch(e => Promise.resolve(false));
}
exports.exists = exists;
