"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrapper_class_1 = require("./wrapper.class");
const nodemonApi = require("nodemon");
function nodemon(options) {
    const wrapper = new wrapper_class_1.NodemonWrapper(nodemonApi(options));
    return wrapper.observe();
}
exports.nodemon = nodemon;
