"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function color(colors) {
    if (!Array.isArray(colors)) {
        return color([colors]);
    }
    return `\x1b[${colors.join(';')}m`;
}
exports.color = color;
function wrap(value, colors, terminate = 0) {
    if ('number' === typeof terminate) {
        return `${color(colors)}${value}${color(terminate)}`;
    }
    return `${color(colors)}${value}`;
}
exports.wrap = wrap;
function light(value, terminate = 0) {
    return wrap(value, [1], terminate);
}
exports.light = light;
function green(value, terminate = 0) {
    return wrap(value, [32], terminate);
}
exports.green = green;
function red(value, terminate = 0) {
    return wrap(value, [31], terminate);
}
exports.red = red;
function yellow(value, terminate = 0) {
    return wrap(value, [33], terminate);
}
exports.yellow = yellow;
