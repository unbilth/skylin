const fs = require("fs")
//const skynet = require('@nebulous/skynet');
const skynet = require('./skynetService');
const databaseService = require('./databaseService');
const encryptorService = require('./encryptorService')

const db = new databaseService()
const encryptor = new encryptorService()

const homeDirectory = process.env['HOME']

class DownloaderService {

  async downloadFromSkynet(skylink, encryptionType, destination) {
    return await skynet.DownloadFile(
      destination,
      skylink,
      skynet.DefaultDownloadOptions
    ).then((res) => {
      db.add('history', { skylink: skylink, encryption: encryptionType, type: 'download' })
      return res
    });
  }

  async downloadFile(data) {
    const downloadedFilePath = homeDirectory + '/Downloads/'
    const tmpFilePath = homeDirectory + '/Downloads/'

    switch(data.encryptionType) {
      case 'none':
        try {
          await this.downloadFromSkynet(data.skylink, 'none', downloadedFilePath)
          return downloadedFilePath
        } catch (e) {
          //throw e
          return 'downloadFileFailed'
        }
      case 'symmetric':
        try {
          const filename = await this.downloadFromSkynet(data.skylink, 'symmetric', tmpFilePath)
          const fileExtension = filename.match((/\{([^}]+)\}/))[1]
          const formattedFileName = filename.replace(/\{([^}]+)\}/g, '');
          const decrypt = await encryptor.symmetricDecryption(tmpFilePath + filename, data.password)
          fs.writeFileSync(downloadedFilePath + formattedFileName, decrypt)

          fs.rename(downloadedFilePath + formattedFileName, downloadedFilePath + formattedFileName + '.' + fileExtension, function(err) {
            if ( err ) console.log('ERROR: ' + err);
          });
          fs.unlinkSync(tmpFilePath + filename)

          return downloadedFilePath + formattedFileName + '.' + fileExtension
        } catch (e) {
          //throw e
          return 'downloadSymmetricFileFailed'
        }
        

      case 'asymmetric':
        try{
          const currentKeys = db.get('currentKeys');
          const filename = await this.downloadFromSkynet(data.skylink, 'asymmetric', tmpFilePath)
          const fileExtension = filename.match((/\{([^}]+)\}/))[1]
          const formattedFileName = filename.replace(/\{([^}]+)\}/g, '');
          const decryptedFile = await encryptor.asymmetricDecryption(tmpFilePath + filename, currentKeys.privateKey, data.privateKeyPassphrase)
          
          fs.writeFileSync(downloadedFilePath + formattedFileName, decryptedFile)
          fs.unlinkSync(tmpFilePath + filename)
          fs.rename(downloadedFilePath + formattedFileName, downloadedFilePath + formattedFileName + '.' + fileExtension, function(err) {
            if ( err ) console.log('ERROR: ' + err);
          });

          return downloadedFilePath + formattedFileName + '.' + fileExtension
        } catch(e){
          //throw e
          return 'downloadAsymmetricFileFailed'
        }
    }
  }
}

module.exports = DownloaderService