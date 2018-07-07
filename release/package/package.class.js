"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/concatMap");
require("rxjs/add/operator/take");
require("rxjs/add/operator/shareReplay");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/observable/of");
require("rxjs/add/observable/zip");
const path = require("path");
const fsUtils = require("../utils/fs");
const npm_1 = require("../utils/npm");
class NpmPackage {
    constructor(source) {
        this.source = source;
        this.info = Observable_1.Observable.fromPromise(this.readPackageConfig());
        this.dependencies = this.info.mergeMap(info => {
            return Object.keys(info.dependencies).map(name => {
                const dependency = {
                    name,
                    version: info.dependencies[name]
                };
                return dependency;
            });
        });
        this.modulePackages = this.readPackageModules().shareReplay();
        this.dependencyPackages = this.dependencies.concatMap(dependency => {
            return this.resolvePackageModule(dependency.name);
        });
        this.source = path.resolve(source);
    }
    /**
     * executes npm pack and returns name of tar archive created
     *
     * @return     {Observable<string>}  observable emitting single value of tar archive filename
     */
    pack() {
        return npm_1.pack(this.source).map(filename => filename.slice(0, -1));
    }
    /*
      public unpackTo ( archiveFilename:string ):Observable<string>
      public unpackTo ( archiveFilename:string, targetDirectory:string ):Observable<string>
      public unpackTo ( archiveFilename:Observable<string>, targetDirectory:string ):Observable<string>
      public unpackTo ( archiveFilename:string|Observable<string>, targetDirectory?:string ):Observable<string>
      {
    
        if ( targetDirectory === undefined && 'string' === typeof archiveFilename ) {
          return this.unpackTo ( this.pack(), archiveFilename )
        }
    
        if ( 'string' === typeof archiveFilename ) {
          return this.unpackTo(Observable.of(archiveFilename),targetDirectory)
        }
    
        const modulenName:string = ''
    
        return this.info.mergeMap ( info => {
          return fsUtils.mkdir(targetDirectory).then ( () => targetDirectory )
        } ).mergeMap ( packagePath => {
          return archiveFilename.take(1).mergeMap((filename:string)=>{
            return untar(filename,packagePath)
          })
        } )
    
      }
    */
    createAction(actionFactory) {
        return this.info.map(info => actionFactory(Object.assign({}, info, { source: this.source })));
    }
    readPackageConfig() {
        return new Promise((resolve, reject) => {
            let info;
            let error;
            try {
                info = require(path.join(this.source, 'package.json'));
            }
            catch (e) {
                error = e;
            }
            if (error) {
                reject(error);
            }
            else {
                resolve(info);
            }
        });
    }
    readPackageModules() {
        const modules_path = path.join(this.source, 'node_modules');
        return Observable_1.Observable.fromPromise(fsUtils.readdir(modules_path, false)).mergeMap(items => {
            return Observable_1.Observable.of(...items)
                .concatMap(item => {
                return this.resolvePackageModule(item);
            });
        });
    }
    assertPackagePath(filepath) {
        if (path.basename(filepath).substr(0, 1) === '.') {
            return Observable_1.Observable.of(false);
        }
        else {
            return Observable_1.Observable.fromPromise(fsUtils.isFile(path.join(filepath, 'package.json')));
        }
    }
    resolvePackageModule(packageName) {
        const itemPath = path.join(this.source, 'node_modules', packageName);
        return this.assertPackagePath(itemPath).filter(res => res === true).map(p => this.createPackage(itemPath));
    }
    createPackage(source) {
        return new NpmPackage(source);
    }
}
exports.NpmPackage = NpmPackage;
