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

function resolve_arg () {
  if [[ -d "${1}" ]]; then
    cd "${1}"
    pwd
  fi
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
      SYNC_ARGS=(${SYNC_ARGS[@]} "$(resolve_arg "${arg}")")
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

function sync_to_package () {

  local name="${1}"
  local source="${2}"
  local targets="${@:3}"

  for target in ${targets[@]}; do
    if [[ ! -d "${target}" ]]; then
      printf '\x1b[31mInvalid target path: %s\x1b[0m\n' "${target}"
      exit 1
    fi

    if [[ -d "${target}/node_modules/${name}" ]]; then
      mkdir -p "${target}/node_modules/${name}"
    fi

    printf 'Syncing "%s" to %s...\n' "${name}" "${target}/node_modules/${name}"
    rsync -avzh --delete "${source}/." "${target}/node_modules/${name}"
  done

}

function untar_package () {

  local package_file="${1}"
  local tmp_target="$TMPDIR/npm-sync-$RANDOM"

  mkdir "${tmp_target}"
  mv "${package_file}" "${tmp_target}"

  cd $tmp_target

  tar xf "${tmp_target}/$(basename "${package_file}")"

  #rsync -avzh --delete "${tmp_target}/package/." "${target_directory}"

  # sync_to_package "${package_name}" "${tmp_target}/package" ${target_directories}

  # rm -rf "${tmp_target}"
  echo "${tmp_target}/package"

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

function create_package () {

  PACKAGE_TAR="$(build_package)"
  untar_package "${PACKAGE_TAR}"

}

function sync_package () {

  printf '\x1b[35;1m[npm-sync]\x1b[0m building package of \x1b[1m%s\x1b[0m\n' "${SOURCE_PACKAGE_NAME}"
  PACKAGE_DIR="$(create_package)"

  sync_to_package "${SOURCE_PACKAGE_NAME}" "${PACKAGE_DIR}" ${SYNC_ARGS[@]}

  printf '\x1b[35;1m[npm-sync]\x1b[0m done\n'

}

if [[ ${OPT_WATCH} -eq 1 ]]; then
  
  printf '\x1b[35;1m[npm-sync]\x1b[0m watching \x1b[1m%s\x1b[0m...\n' "${SOURCE_PACKAGE}"  
  "${NODEMON_BIN}" --exec "${SCRIPT_FILE} ${SYNC_ARGS[@]}" 

else
  sync_package
fi
