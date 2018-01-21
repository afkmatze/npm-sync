#!/usr/bin/env bash

SCRIPT_PATH="$(dirname "${0}")"
SCRIPT_FILE="$(basename "${0}")"

__USAGE__="Usage: sync-package.sh ...targetPaths"

__SYNC_SOURCE__="$(pwd)"

if [[ ! -e "${__SYNC_SOURCE__}/package.json" ]]; then
  printf '%s is not a valid package.\n' "${__SYNC_SOURCE__}"
  exit 2
fi


TARGET_DIRS=${@:1}

if [[ ${#} -lt 1 ]]; then
  printf '%s\n' "${__USAGE__}"
  exit 1
fi

printf '%s\n' "${TARGET_DIRS[@]}"


main () {

  local package_name="$(node -p 'require("./package.json").name')"
  local tmp_package="$TMPDIR/npm-sync-$RANDOM"

  sync_to () {
    
    local target_dir="$(cd "${1}"; pwd)"

    if [[ ! -d "${target_dir}" ]]; then
      printf '%s is not a directory.\n' "${target_dir}"
      exit 1
    fi

    if [[ ! -d "${target_dir}/node_modules" ]]; then
      mkdir -p "${target_dir}/node_modules"
    fi

    if [[ ! -d "${target_dir}/node_modules/${pacakge_name}" ]]; then
      mkdir -p "${target_dir}/node_modules/${package_name}"
    fi

    printf 'Syncing \x1b[1m%s\x1b[0m to %s.\n' "${package_name}" "${target_dir}"

    rsync -vazh --delete "${tmp_package}/package/." "${target_dir}/node_modules/${package_name}"
  }

  mkdir -p "${tmp_package}"

  local package_tar="$(npm pack)"

  mv "${package_tar}" "${tmp_package}/${package_tar}"

  cd ${tmp_package}
  tar xf "${package_tar}"

  for target_dir in ${TARGET_DIRS[@]}; do
    sync_to "${__SYNC_SOURCE__}/${target_dir}"
  done
  
  rm -rf "${tmp_package}"

}

main