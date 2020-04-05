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
        event.reply('upload', '')
        uploader.uploadFile(filePath, data).then((res) => {
          switch(res) {
            case 'uploadSymmetricFileFailed':
              event.reply('uploadSymmetricFileFailed')
              break
            case 'uploadAsymmetricFileFailed':
              event.reply('uploadAsymmetricFileFailed')
              break
            case 'uploadFileFailed':
              event.reply('uploadFileFailed')
              break
            default:
              event.reply('successful upload', res)
          }
        })
      }
    })
  })
  
  ipcMain.on('download', (event, data) => {
    event.reply('download', '')
    downloader.downloadFile(data).then((res) => {
      switch(res) {
        case 'downloadSymmetricFileFailed':
          event.reply('downloadSymmetricFileFailed')
          break
        case 'downloadAsymmetricFileFailed':
          event.reply('downloadAsymmetricFileFailed')
          break
        case 'downloadFileFailed':
          event.reply('downloadFileFailed')
          break
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
    event.reply('CurrentKeysChanged')
  })
  
  ipcMain.on('getPublicKey', (event, id) => {
    const publicKey = db.getMyPublicKey(id)
    event.reply('publicKey', publicKey)
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
