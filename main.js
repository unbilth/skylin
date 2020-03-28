const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const encryptorService = require('./src/lib/encryptorService')
const databaseService = require('./src/lib/databaseService')
const uploaderService = require('./src/lib/uploaderService')
const downloaderService = require('./src/lib/downloaderService')

const db = new databaseService()
const encryptor = new encryptorService()
const uploader = new uploaderService()
const downloader = new downloaderService()

let mainWindow
let dev = false


if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  let indexPath

  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:3000',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  mainWindow.loadURL(indexPath)

  mainWindow.on('page-title-updated', function(e) {
    e.preventDefault()
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      /*
      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
        */
      mainWindow.webContents.openDevTools()
    } else {
      //mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('upload', (event, data) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }).then(result => {
    const filePath = result.filePaths[0]
    if (filePath) {
      event.reply('reply', 'pong')
      uploader.uploadFile(filePath, data).then((res) => {
        if(res === 'symmetricUploadFailed') {
          event.reply('symmetricUploadFailed')
        } else if(res === 'asymmetricUploadFailed') {
          event.reply('asymmetricUploadFailed')
        } else if(res === 'noneUploadFailed') {
          event.reply('noneUploadFailed')
        } else {
          event.reply('successful upload', res)
        }
      })
    }
  })
})

ipcMain.on('download', (event, data, skylink) => {
  event.reply('download reply', 'pong')
  downloader.downloadFile(data).then((res) => {
      if(res === 'symmetricDownloadFailed') {
      event.reply('symmetricDownloadFailed')
    } else if(res === 'asymmetricDownloadFailed') {
      event.reply('asymmetricDownloadFailed')
    } else if(res === 'noneDownloadFailed') {
      event.reply('noneDownloadFailed')
    } else {
      event.reply('successful download', res)
    }
  })
})

ipcMain.on('postPublicKey', (event, passphrase) => {
  encryptor.generatePgpKeys(passphrase).then(() => {
    event.reply('NewPublicKey')
  })
})

ipcMain.on('deletePublicKey', (event, id) => {
  db.deletePublicKey('publicKeys', id)
  event.reply('publicKeyDeleted')
})

ipcMain.on('changeCurrentKeys', (event, id) => {
  db.changeCurrentKeys(id)
  event.reply('changeCurrentKeys')
})

ipcMain.on('getMyPublicKey', (event, id) => {
  const publicKey = db.getMyPublicKey(id)
  event.reply('myPublicKey', publicKey)
})

ipcMain.on('deleteFavorite', (event, id) => {
  db.deleteFavorite('favorites', id)
  event.reply('favoriteDeleted')
})

ipcMain.on('deleteHistory', (event, id) => {
  db.deleteHistory('history')
  event.reply('historyDeleted')
})

ipcMain.on('getPublicKeys', (event, arg) => {
  event.reply('publicKeys', db.get('publicKeys'))
})

ipcMain.on('postFav', (event, data) => {
  db.add('favorites', data)
})

ipcMain.on('getFavorites', (event, data) => {
  event.reply('favorites', db.get('favorites'))
})

ipcMain.on('getHistory', (event, data) => {
  event.reply('history', db.get('history'))
})