import { Observable } from 'rxjs/Observable'

export interface IWatchProvier {

  /**
   * start watching target at {filepath}
   *
   * @param      {string}  filepath  The filepath
   * @return     {Observable<string[]>}  Observable emitting changed items
   */
  watch ( filepath:string ):Observable<string[]>

}