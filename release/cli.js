#!/usr/bin/env node

const yargs = require("yargs");
const module_1 = require("./module");
const path = require("path");
const argv = yargs
    .usage(`$0 ...targets`)
    .demand(1)
    .help('h')
    .argv;
module_1.NpmSync.watchAndSync(process.cwd(), argv._.map(p => path.resolve(p)));
