import { Observable } from 'rxjs/Observable'

export interface IPackageBuilder {

  /**
   * Builds a npm package in a folder and returns it's path
   * if {targetDirectory} is omitted, a temporary folder is created
   *
   * @param      {string}  packageFilepath  The package filepath
   * @param      {string}  targetDirectory  The target directory
   * @return     {Observable<string>}  Observable emitting filepath at which package was built
   */
  buildPackage ( packageFilepath:string, targetDirectory?:string ):Observable<string>

}