import { NPMSyncApp } from './app.class'
import { NodemonWatchProvider } from './watch/nodemon'
import { syncPackage } from './package/install'
import { buildPackage } from './package/build'



export const NpmSync = new NPMSyncApp(new NodemonWatchProvider(),{buildPackage},{installPackage: syncPackage})

export default NpmSync