import { Observable } from 'rxjs/Observable'
import { NodemonWrapper } from './wrapper.class'
import * as nodemonApi from 'nodemon'



export function nodemon ( options:any ) {
  const wrapper = new NodemonWrapper(nodemonApi(options))
  return wrapper.observe()
}
