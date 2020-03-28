const skynet = require('@nebulous/skynet');
const databaseService = require('./databaseService');
const encryptorService = require('./encryptorService')
const fs = require("fs");

const db = new databaseService()
const encryptor = new encryptorService()

class UploaderService {

  async uploadToSkynet(file) {
    const skylink = await skynet.UploadFile(
      file,
      skynet.DefaultUploadOptions
    )
    return skylink
  }

  async uploadFile(filePath, data) {

    if (data.encryptionType === 'none') {
      try {
        const skylink = await this.uploadToSkynet(filePath)
        db.add('history', { skylink: skylink, encryption: data.encryptionType, type: 'upload' })
        return { skylink: skylink, encryption: data.encryptionType }
      } catch (e) {
        return 'noneUploadFailed'
      }

    } else if (data.encryptionType === 'symmetric') {
      try {
        const encryptedFile = await encryptor.symmetricEncryption(filePath, data.password)
        const skylink = await this.uploadToSkynet(encryptedFile)
        fs.unlinkSync(encryptedFile)
        db.add('history', { skylink: skylink, encryption: data.encryptionType, type: 'upload' })
        return { skylink: skylink, encryption: data.encryptionType };
      } catch (e) {
        return 'symmetricUploadFailed'
      }
    } else if (data.encryptionType === 'asymmetric') {
      try {
        const encryptedFile = await encryptor.asymmetricEncryption(filePath, data.publicAddress)
        const skylink = await this.uploadToSkynet(encryptedFile)
        fs.unlinkSync(encryptedFile)
        db.add('history', { skylink: skylink, encryption: data.encryptionType, type: 'upload' })
        return { skylink: skylink, encryption: data.encryptionType }
      } catch (e) {
        //throw e
        return 'asymmetricUploadFailed'
      }
    }
  }
}

module.exports = UploaderService;