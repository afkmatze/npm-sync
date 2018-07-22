import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'

import { IPackage } from '../../interfaces/package'
import { IPackageAction, IPackageActionFactory } from '../../interfaces/package-action'

import { run } from '../../child_process/run'


export function factory <P extends IPackage> ( packageData:P ) {

  return function ( ):Observable<string> {

    return run('npm',['pack'],{
      cwd: packageData.source
    }).stdout.map ( d => `${d}` )

  }

}