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


function printDependencies () {

  if [[ ! -e "${1}/package.json" ]]; then
    print_log "Invalid package path ${1}."
    exit 1
  fi

  node -e "var d=require(\"${1}/package.json\").dependencies;Object.keys(d).forEach( k => console.log('%s@%s', k, d[k]) )"
}


function syncDependencies () {

  local sourcePackage="$(cd "${1:-.}"; pwd)"
  shift
  local targetPackage="$(cd "${1:-.}"; pwd)"
  shift

  local sourceDependencies=$(printDependencies "${sourcePackage}")
  print_log "Source dependencies: " 
  printf '%s\n' ${sourceDependencies[@]}
  
  local targetDependencies=$(printDependencies "${targetPackage}")
  print_log "Target dependencies: " 
  printf '%s\n' ${targetDependencies[@]}
  
  local targetPackageModules="${targetPackage}/node_modules"
  
  for sourceDependency in ${sourceDependencies[@]}; do
      
    case ${sourceDependency[@]} in
      
      ${sourceDependency} )
        print_log "${sourceDependency} found in target modules."
        ;;

        * )
        print_log "${sourceDependency} missing in target modules."
        ;;

    esac

  done
}

syncDependencies ${@}