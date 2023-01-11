import { ipcMain as im, dialog, SaveDialogOptions, OpenDialogOptions, nativeImage, shell } from 'electron'
import fs, { promises as fsp } from 'fs'

im.handle('saveTextFile', async (event, text: string) => {
  const options: SaveDialogOptions = {
    properties: ['createDirectory']
  }
  const r = await dialog.showSaveDialog(options)
  if (!r.filePath) throw Error('cancel')
  await fsp.writeFile(r.filePath, text)
  return r.filePath
})

im.handle('loadTextFile', async () => {
  const options: OpenDialogOptions = {
    properties: ['openFile']
  }
  const r = await dialog.showOpenDialog(options)
  if (!r.filePaths.length) throw Error('cancel')
  const buf = await fsp.readFile(r.filePaths[0])
  console.log('here', buf)
  return buf.toString()
})

im.handle('getDirectoryPath', async () => {
  const options: OpenDialogOptions = {
    properties: ['openDirectory']
  }
  const { canceled, filePaths } = await dialog.showOpenDialog(options)
  if (canceled) {
    return ''
  } else {
    return filePaths[0]
  }
})

im.handle('openDirectory', async (event, paths: string) => {
  shell.openPath(paths)
  return true
})

im.handle('getImages', async () => {
  const options: OpenDialogOptions = {
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Images',
        extensions: ['png', 'jpg', 'webp', 'jpeg']
      }
    ]
  }
  const { canceled, filePaths } = await dialog.showOpenDialog(options)
  if (canceled) {
    return []
  } else {
    return filePaths
  }
})

im.handle('resizeImage', async (event, originPath:string, savePath:string, imgName:string, percentage:number, minimum:number) => {
  console.log('originPath,,,', originPath)
  console.log('savePath,,,', savePath)
  console.log('imgName,,,', imgName)
  const size = nativeImage.createFromPath(originPath).getSize()
  const calcWidth = size.width - ((percentage / 100) * size.width)
  const calcHeight = size.height - ((percentage / 100) * size.height)
  const resizeOption: any = {}
  if (calcWidth > minimum && calcHeight > minimum) {
    if (calcWidth > calcHeight) {
      resizeOption.height = calcHeight
    } else if (calcHeight > calcWidth) {
      resizeOption.width = calcWidth
    } else {
      resizeOption.width = calcWidth
      resizeOption.height = calcHeight
    }
    const newImage = nativeImage.createFromPath(originPath).resize(resizeOption).toDataURL()
    const data = newImage.replace(/^data:image\/\w+;base64,/, '')
    const buf = Buffer.from(data, 'base64')
    if (!fs.existsSync(savePath)) {
      fs.mkdir(savePath, { recursive: true }, (err) => {
        if (err) {
          return 404
        }
      })
    }
    await fsp.writeFile(savePath + imgName, buf)
    return 200
  } else {
    const newMin = (100 * minimum) / 100
    if (calcWidth > calcHeight) {
      resizeOption.height = newMin
    } else if (calcHeight > calcWidth) {
      resizeOption.width = newMin
    } else {
      resizeOption.width = newMin
      resizeOption.height = newMin
    }
    const newImage = nativeImage.createFromPath(originPath).resize(resizeOption).toDataURL()
    console.log(1)
    const data = newImage.replace(/^data:image\/\w+;base64,/, '')
    console.log(2)
    const buf = Buffer.from(data, 'base64')
    console.log(3)
    if (!fs.existsSync(savePath)) {
      console.log(4)
      fs.mkdir(savePath, { recursive: true }, (err) => {
        if (err) {
          return 404
        }
      })
    }
    console.log(5)
    await fsp.writeFile(savePath + imgName, buf)
    return 200
  }
})
