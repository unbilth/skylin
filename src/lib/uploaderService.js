const fs = require("fs");
const skynet = require('@nebulous/skynet');
const databaseService = require('./databaseService');
const encryptorService = require('./encryptorService')

const db = new databaseService()
const encryptor = new encryptorService()

class UploaderService {

  async uploadToSkynet(file, encryptionType) {
    const skylink = await skynet.UploadFile(
      file,
      skynet.DefaultUploadOptions
    ).then((res) => {
      console.log(res)
      db.add('history', { skylink: res, encryption: encryptionType, type: 'upload' })
    })
    return skylink
  }

  async uploadFile(filePath, data) {
    switch(data.encryptionType) {
      case 'none':
        try {
          const skylink = await this.uploadToSkynet(filePath, data.encryptionType)
          return { skylink: skylink, encryption: data.encryptionType }
        } catch (e) {
          return 'noneUploadFailed'
        }
      case 'symmetric':
        try {
          const encryptedFile = await encryptor.symmetricEncryption(filePath, data.password)
          const skylink = await this.uploadToSkynet(encryptedFile, data.encryptionType)
          fs.unlinkSync(encryptedFile)
          return { skylink: skylink, encryption: data.encryptionType };
        } catch (e) {
          return 'symmetricUploadFailed'
        }
      case 'asymmetric':
        try {
          const encryptedFile = await encryptor.asymmetricEncryption(filePath, data.publicAddress)
          const skylink = await this.uploadToSkynet(encryptedFile, data.encryptionType)
          fs.unlinkSync(encryptedFile)
          return { skylink: skylink, encryption: data.encryptionType }
        } catch (e) {
          //throw e
          return 'asymmetricUploadFailed'
        }
    }
  } 
}

module.exports = UploaderService;