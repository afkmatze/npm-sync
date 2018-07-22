"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/map");
const path = require("path");
const run_1 = require("../nodemon/run");
const NODEMON_BIN = path.join(path.resolve('.'), 'node_modules/.bin/nodemon');
class NodemonWatchProvider {
    watch(filepath) {
        return run_1.nodemon({
            watch: filepath,
            exec: 'printf ""'
        }).map((event) => {
            const [eventName, ...files] = event;
            return files;
        }).filter(files => files.length > 0);
    }
}
exports.NodemonWatchProvider = NodemonWatchProvider;
