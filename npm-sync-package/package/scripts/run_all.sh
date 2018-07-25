#!/usr/bin/env bash

SCRIPT_PATH="$(dirname "${0}")"
SCRIPT_FILE="$(basename "${0}")"
CLI_ROOT="$(cd "$(dirname "${0}")/.."; pwd)"

NPM_COMMANDS="${@}"

function run_all () {
  for npm_cmd in ${NPM_COMMANDS}; do
    npm run "${npm_cmd}" || break
  done
}


run_all