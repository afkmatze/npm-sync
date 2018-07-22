"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/map");
const rsync_1 = require("./utils/rsync");
const path = require("path");
const logger = require("./log");
const rg_node_modules = /\/node_modules*/;
/*export async function mergePackageJSONs ( sourcePackagePath:string, targetPackagePath:string ) {
  
  const sourcePackageFile = path.join(sourcePackagePath,'package.json')
  const targetPackageFile = path.join(targetPackagePath,'package.json')

  const targetJSON = await fs.readFile(targetPackageFile,'utf8')
  const sourceJSON = await fs.readFile(sourcePackageFile,'utf8')

  const targetDiff = diff.diffLines(targetJSON,sourceJSON)

  targetDiff.forEach ( tDiff => {
    let color:number = 2
    
    if ( tDiff.added ) {
      color = 32
    } else if ( tDiff.removed ) {
      color = 31
    }

    logger.log(`\x1b[${color}m%s\x1b[0m`, tDiff.value)
  } )
  

  return mergeFiles(sourcePackageFile,targetPackageFile).then ( merged => {
    return writeJSON(targetPackageFile,merged)
  } ).then ( json => {
    return targetPackagePath
  } )
}*/
function syncPackage(sourcePath, targetPackagePath) {
    const sourcePackageJSON = path.join(sourcePath, 'package.json');
    const packageInfo = require(sourcePackageJSON);
    if (rg_node_modules.test(targetPackagePath)) {
        targetPackagePath = targetPackagePath.replace(rg_node_modules, '');
    }
    targetPackagePath = path.join(targetPackagePath, 'node_modules', packageInfo.name) + '/';
    const targetPackageJSON = path.join(targetPackagePath, 'package.json');
    logger.log('Syncing %s@%s to %s', logger.light(packageInfo.name), logger.yellow(packageInfo.version), path.relative(process.cwd(), targetPackagePath));
    return rsync_1.rsync(sourcePath + '/.', targetPackagePath)
        .map(file => {
        logger.debug('%s', file.replace(/\n+$/, ''));
        return file;
    })
        .toArray().mapTo(targetPackagePath);
}
exports.syncPackage = syncPackage;
