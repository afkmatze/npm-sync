"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrapper_class_1 = require("./wrapper.class");
function nodemon(options) {
    const wrapper = new wrapper_class_1.NodemonWrapper(options);
    return wrapper.events;
}
exports.nodemon = nodemon;
