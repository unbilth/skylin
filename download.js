const skynet = require('@nebulous/skynet');
const database = require('./store.js');
const encryption = require('./encryption')
const fs = require("fs")

const db = new database()
const pgp = new encryption()
const homeDirectory = process.env['HOME']

class Download {

  async downloadFromSkynet(skylink, destination) {
    await skynet.DownloadFile(
      destination,
      skylink,
      skynet.DefaultDownloadOptions
    );
    return skylink
  }

  async downloadFile(data) {
    if (data.encryptionType === 'none') {
      try {
        const downloadFilePath = homeDirectory + '/Downloads/siaFile' + UUID()
        const skylink = await this.downloadFromSkynet(data.skylink, downloadFilePath)
        db.add('history', { skylink: data.skylink, encryption: data.encryptionType, type: 'download' })
        return downloadFilePath
      } catch (e) {
        //throw e
        return 'noneDownloadFailed'
      }
    } else if (data.encryptionType === 'symmetric') {
      try {
        const tmp = homeDirectory + '/Downloads/encryped_file' + UUID()
        await this.downloadFromSkynet(data.skylink, tmp)
        const decrypt = await pgp.symmetricDecryption(tmp, data.password)
        const decryptedFilePath = homeDirectory + '/Downloads/decrypted_file' + UUID()
        fs.writeFileSync(decryptedFilePath, decrypt)
        db.add('history', { skylink: data.skylink, encryption: data.encryptionType, type: 'download' })
        fs.unlinkSync(tmp)
        return decryptedFilePath
      } catch (e) {
        throw e
        return 'symmetricDownloadFailed'
      }
    } else if (data.encryptionType === 'asymmetric') {
      try{
        const currentKeys = db.get('currentKeys');
        const tmp = homeDirectory + '/Downloads/encryped_file' + UUID()
        await this.downloadFromSkynet(data.skylink, tmp)
        fs.readFileSync(tmp)

        const decrypt = await pgp.asymmetricDecryption(tmp, currentKeys.privateKey, data.privateKeyPassphrase)
        const decryptedFilePath = homeDirectory + '/Downloads/decrypted_file' + UUID()
        fs.writeFileSync(decryptedFilePath, decrypt)
        db.add('history', { skylink: data.skylink, encryption: data.encryptionType, type: 'download' })
        fs.unlinkSync(tmp)
        return decryptedFilePath
      } catch(e){
        //throw e
        return 'asymmetricDownloadFailed'
      }
    }
  }

}

module.exports = Download

function UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}