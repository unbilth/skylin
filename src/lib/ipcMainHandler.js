const { ipcMain, dialog } = require('electron');

const encryptorService = require('./encryptorService')
const databaseService = require('./databaseService')
const uploaderService = require('./uploaderService')
const downloaderService = require('./downloaderService')

const db = new databaseService()
const encryptor = new encryptorService()
const uploader = new uploaderService()
const downloader = new downloaderService()

const ipcMainHandler = (() => {
  ipcMain.on('upload', (event, data) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory']
    }).then(result => {
      const filePath = result.filePaths[0]
      if (filePath) {
        event.reply('reply', 'pong')
        uploader.uploadFile(filePath, data).then((res) => {
          switch(res) {
            case 'symmetricUploadFailed':
              event.reply('symmetricUploadFailed')
            case 'asymmetricUploadFailed':
              event.reply('asymmetricUploadFailed')
            case 'noneUploadFailed':
              event.reply('noneUploadFailed')
            default:
              event.reply('successful upload', res)
          }
        })
      }
    })
  })
  
  ipcMain.on('download', (event, data, skylink) => {
    event.reply('download reply', 'pong')
    downloader.downloadFile(data).then((res) => {
      switch(res) {
        case 'symmetricDownloadFailed':
          event.reply('symmetricDownloadFailed')
        case 'asymmetricDownloadFailed':
          event.reply('asymmetricDownloadFailed')
        case 'noneDownloadFailed':
          event.reply('noneDownloadFailed')
        default:
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
})()

module.exports = ipcMainHandler
