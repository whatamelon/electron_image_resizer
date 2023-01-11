/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
import { contextBridge, ipcRenderer as ir } from 'electron'

contextBridge.exposeInMainWorld('api', {
  saveTextFile (text:string) {
    return ir.invoke('saveTextFile', text)
  },

  loadTextFile () {
    return ir.invoke('loadTextFile')
  },

  getDirectoryPath () {
    return ir.invoke('getDirectoryPath')
  },

  openDirectory (paths:string) {
    return ir.invoke('openDirectory', paths)
  },

  getImages () {
    return ir.invoke('getImages')
  },

  resizeImage (originPath:string, savePath:string, imgName:string, percentage:number, minimum:number) {
    return ir.invoke('resizeImage', originPath, savePath, imgName, percentage, minimum)
  }
})
