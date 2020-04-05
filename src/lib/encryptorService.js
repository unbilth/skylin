const fs = require("fs");
const openpgp = require("openpgp");
const databaseService = require('./databaseService');
const db = new databaseService()
const homeDirectory = process.env['HOME']

class EncryptorService {

  async generatePgpKeys(passphrase) {
    const keys = await openpgp.generateKey({
      userIds: [{}],
      curve: 'ed25519',
      passphrase: passphrase.passphrase
    });

    db.setPgpKeys(keys)
    return keys
  }

  async symmetricEncryption(filePath, password) {
    
    try {
      const fileExtension = filePath.split('.').pop();
      const filePathSplited = filePath.split('.')[0].split('/');
      const filename = filePathSplited[filePathSplited.length - 1] + '{' + fileExtension + '}'
      const fileData = fs.readFileSync(filePath)

      const { message } = await openpgp.encrypt({
        message: openpgp.message.fromBinary(fileData),
        passwords: [password],
        armor: false
      });
      const encryptedFile = message.packets.write();
      const encryptedFilePath = homeDirectory + '/Downloads/' + filename
      fs.writeFileSync(encryptedFilePath, encryptedFile)
      return encryptedFilePath
    } catch (e) {
      throw e
    }
    
  }

  async asymmetricEncryption(filePath, publicAddress) {
    try {

      const fileExtension = filePath.split('.').pop();
      const filePathSplited = filePath.split('.')[0].split('/');
      const filename = filePathSplited[filePathSplited.length - 1] + '{' + fileExtension + '}'
      const fileData = fs.readFileSync(filePath)
      
      const { message } = await openpgp.encrypt({
        message: openpgp.message.fromBinary(fileData),
        publicKeys: (await openpgp.key.readArmored(publicAddress)).keys,
        armor: false
      });

      const encryptedFile = message.packets.write();
      const encryptedFilePath = homeDirectory + '/Downloads/' + filename

      fs.writeFileSync(encryptedFilePath, encryptedFile)      
      return encryptedFilePath

    } catch (e) {
      throw e
    }
  }

  async symmetricDecryption(filePath, password) {
    const encrypted = fs.readFileSync(filePath)

    const { data: decrypted } = await openpgp.decrypt({
      message: await openpgp.message.read(encrypted),
      passwords: [password],
      format: 'binary'
    });

    return decrypted
  }

  async asymmetricDecryption(filePath, privateKeyArmored, passphrase) {

    try {
      const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored)
      await privateKey.decrypt(passphrase)
      const encryptedFile = fs.readFileSync(filePath)

      const { data: decrypted } = await openpgp.decrypt({
        message: await openpgp.message.read(encryptedFile),
        privateKeys: [privateKey],
        format: 'binary'
      });

      return decrypted
    } catch (e) {
      throw e
    }
  }
}

function UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

module.exports = EncryptorService;