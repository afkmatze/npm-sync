import { Observable } from 'rxjs/Observable'
import { NodemonWrapper } from './wrapper.class'


export function nodemon ( options:any ) {
  const wrapper = new NodemonWrapper(options)
  return wrapper.events
}
