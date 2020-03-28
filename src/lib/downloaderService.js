const fs = require("fs")
const skynet = require('@nebulous/skynet');
const databaseService = require('./databaseService');
const encryptorService = require('./encryptorService')

const db = new databaseService()
const encryptor = new encryptorService()

const homeDirectory = process.env['HOME']

class DownloaderService {

  async downloadFromSkynet(skylink, encryptionType, destination) {
    await skynet.DownloadFile(
      destination,
      skylink,
      skynet.DefaultDownloadOptions
    ).then(() => {
      db.add('history', { skylink: skylink, encryption: encryptionType, type: 'download' })
    });
  }

  async downloadFile(data) {
    const downloadedFilePath = homeDirectory + '/Downloads/siaFile' + UUID()
    const tmpFilePath = homeDirectory + '/Downloads/encryped_file' + UUID()

    switch(data.encryptionType) {
      case 'none':
        try {
          await this.downloadFromSkynet(data.skylink, 'none', downloadedFilePath)
          return downloadedFilePath
        } catch (e) {
          //throw e
          return 'noneDownloadFailed'
        }
      case 'symmetric':
        try {
          await this.downloadFromSkynet(data.skylink, 'symmetric', tmpFilePath)
          const decrypt = await encryptor.symmetricDecryption(tmpFilePath, data.password)
          fs.writeFileSync(downloadedFilePath, decrypt)
          fs.unlinkSync(tmpFilePath)
          return downloadedFilePath
        } catch (e) {
          //throw e
          return 'symmetricDownloadFailed'
        }
      case 'asymmetric':
        try{
          const currentKeys = db.get('currentKeys');
          await this.downloadFromSkynet(data.skylink, 'asymmetric', tmpFilePath)
          const decryptedFile = await encryptor.asymmetricDecryption(tmpFilePath, currentKeys.privateKey, data.privateKeyPassphrase)
          fs.writeFileSync(downloadedFilePath, decryptedFile)
          fs.unlinkSync(tmpFilePath)
          return downloadedFilePath
        } catch(e){
          //throw e
          return 'asymmetricDownloadFailed'
        }
    }
  }
}

module.exports = DownloaderService

function UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}