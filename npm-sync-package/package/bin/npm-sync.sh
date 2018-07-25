#!/usr/bin/env bash

SCRIPT_PATH="$(dirname "${0}")"
SCRIPT_FILE="$(basename "${0}")"

NPM_SYNC_DIR="$(cd "${SCRIPT_PATH}/.."; pwd)"
case $(basename "${NPM_SYNC_DIR}") in

  "npm-sync" )
    ;;

  * )
    NPM_SYNC_DIR="${NPM_SYNC_DIR}/lib/node_modules/npm-sync"
    ;;

esac

if [[ ! -d "${NPM_SYNC_DIR}" ]]; then
  printf 'Failed to find npm-sync at "%s"\n' "${NPM_SYNC_DIR}"
  exit 1
fi

print_log () {

  printf '\x1b[35;1m[npm-sync]\x1b[0m %s \x1b[1m%s\x1b[0m\n' ${@}

}

NODEMON_BIN="${NPM_SYNC_DIR}/node_modules/.bin/nodemon"

OPT_WATCH=0

SYNC_ARGS=()

for arg in ${@}; do
  
  case ${arg} in
    --watch|-w )
      shift
      OPT_WATCH=1
      ;;

    * )
      SYNC_ARGS=(${SYNC_ARGS[@]} "${arg}")
      ;;

  esac

done


function assert_package () {

  if [[ ! -d "${1}" ]]; then
    printf '"%s" is not a directory.\n' "${1}"
    exit 1
  fi

  local dir_path="$(cd "${1}"; pwd)"

  if [[ ! -f "${dir_path}/package.json" ]]; then
    printf '"%s" has no package.json.\n' "${dir_path}"
    exit 2
  fi

}

function build_package () {

  cd "${SOURCE_PACKAGE}"

  printf '%s/' "${SOURCE_PACKAGE}"
  npm pack

}

function untar_package () {

  local package_file="${1}"
  local target_directory="${2}"
  local tmp_target="$TMPDIR/npm-sync-$RANDOM"

  mkdir "${tmp_target}"
  mv "${package_file}" "${tmp_target}"

  cd $tmp_target

  tar xf "${tmp_target}/$(basename "${package_file}")"

  rsync -azh --delete "${tmp_target}/package/." "${target_directory}"

  rm -rf "${tmp_target}"

}

#echo "SKIP PACKAGE: ${OPT_WATCH}"

SOURCE_PACKAGE="${SYNC_ARGS[@]:0:1}"
TARGET_PACKAGE="${SYNC_ARGS[@]:1:1}"

if [[ ${#SYNC_ARGS[@]} -lt 2 ]]; then
  TARGET_PACKAGE="${SYNC_ARGS[@]:0:1}"
  SOURCE_PACKAGE="$(pwd)"
fi

assert_package "${SOURCE_PACKAGE}"
assert_package "${TARGET_PACKAGE}"

SOURCE_PACKAGE_NAME="$(cd "${SOURCE_PACKAGE}"; node -p 'require("./package.json").name')"

TARGET_PACKAGE="$(cd "${TARGET_PACKAGE}"; pwd)"

function sync_package () {

  if [[ ! -d "${TARGET_PACKAGE}/node_modules" ]]; then
    print_log "creating" "${TARGET_PACKAGE}/node_modules"
    mkdir "${TARGET_PACKAGE}/node_modules"
  fi

  print_log "building package of" "${SOURCE_PACKAGE_NAME}"
  PACKAGE_TAR="$(build_package)"

  print_log "syncing" "${SOURCE_PACKAGE}"
  print_log "to" "${TARGET_PACKAGE}"
  untar_package "${PACKAGE_TAR}" "${TARGET_PACKAGE}/node_modules/${SOURCE_PACKAGE_NAME}"

  print_log "done"
}

if [[ ${OPT_WATCH} -eq 1 ]]; then
  
  print_log "watching" "${SOURCE_PACKAGE}"  
  "${NODEMON_BIN}" -w ./ -i node_modules  --exec "${SCRIPT_FILE} ${SYNC_ARGS[@]}" 

else
  sync_package
fi
