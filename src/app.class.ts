import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/toArray'
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of'

import { IPackageBuilder } from './interfaces/package-builder'
import { IPackageInstaller } from './interfaces/package-installer'
import { IWatchProvier } from './interfaces/watch-provider'

import { LocalNpmPackage } from './package/local/local-package.class'



export class NPMSyncApp {

  constructor ( 
      private watchProvider:IWatchProvier,
      private packageBuilder:IPackageBuilder,
      private packageInstaller:IPackageInstaller
    ) {

  }

  syncPackage ( filepath:string, targetPackageDirs:string[] ) {

    const sourcePackage = new LocalNpmPackage(filepath)
    const targetPackages = targetPackageDirs.map ( targetPackageDir => new LocalNpmPackage(targetPackageDir) )

    sourcePackage.syncToPackages(...targetPackages).subscribe ( out => {
      console.log('OUT: %s', out)
    } )

  }


  watchAndSync ( filepath:string, targetPackages:string[] ) {

    return this.watchProvider.watch(filepath).concatMap ( changes => {

      return this.packageBuilder.buildPackage(filepath).mergeMap ( tempPackagePath => {

        return Observable.of(...targetPackages)
          .concatMap ( targetPackage => {

            return this.packageInstaller.installPackage ( tempPackagePath, targetPackage )

          } )

      } )

    } )

  }

}
