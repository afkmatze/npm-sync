import { Observable } from 'rxjs/Observable'

export interface IPackageInstaller {

  /**
   * installs package at target package and returns installation location path
   *
   * @param      {string}  packageFilepath        The package filepath
   * @param      {string}  targetPackageFilepath  The target package filepath
   * @return     {Observable<string>}  Observable emitting installation location path
   */
  installPackage ( packageFilepath:string, targetPackageFilepath:string ):Observable<string>

}