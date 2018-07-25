import { Observable } from 'rxjs/Observable'

export interface IPackageInstaller {

  /**
   * installs package at target package and returns installation location path
   *
   * @param      {string}  packageFilepath        The package filepath
   * @param      {string}  targetPackageFilepath  The target package filepath
   * @param      {string}  sourceFilepath         The optional source path to actual install sources
   * @return     {Observable<string>}  Observable emitting installation location path
   */
  installPackage ( packageFilepath:string, targetPackageFilepath:string, sourceFilepath?:string ):Observable<string>

}