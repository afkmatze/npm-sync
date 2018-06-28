import { NPMSyncApp } from './app.class'
import { NodemonWatchProvider } from './watch/nodemon'
import { buildPackage } from './buildPackage'
import { syncPackage } from './syncPackage'
import * as fsUtils from './utils/fs'

export { fsUtils }
export { buildPackage } from './buildPackage'
export { syncPackage } from './syncPackage'

export const NpmSync = new NPMSyncApp(new NodemonWatchProvider(),{buildPackage},{installPackage: syncPackage})

export default NpmSync