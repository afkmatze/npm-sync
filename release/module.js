"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_class_1 = require("./app.class");
const nodemon_1 = require("./watch/nodemon");
const install_1 = require("./package/install");
const build_1 = require("./package/build");
exports.NpmSync = new app_class_1.NPMSyncApp(new nodemon_1.NodemonWatchProvider(), { buildPackage: build_1.buildPackage }, { installPackage: install_1.syncPackage });
exports.default = exports.NpmSync;
