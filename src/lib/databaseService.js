const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Database {

  constructor() {
    this.userDataPath = (electron.app).getPath('userData');
    this.path = path.join(this.userDataPath, 'skylinData.json');
    this.data = parseDataFile(this.path, 'skylinData.json');

    try {
      if (!fs.existsSync(this.path)) {
        let obj = {}

        const currentKeys = {
          publicKey: null,
          privateKey: null,
          revocationCertificate: null
        }

        obj.currentKeys = currentKeys
        obj.publicKeys = []
        obj.favorites = []
        obj.history = []

        fs.writeFileSync(this.path, JSON.stringify(obj));
      }
    } catch (err) {
      throw e
    }
  }

  selectKeyAuto() {
    fs.readFile(this.path, 'utf8', (err, res) => {
      if (err) {
        throw err
      } else {
        let obj = JSON.parse(res);

        const publicKeys = this.get("publicKeys")
        if (publicKeys.length) {
          const newkeys = publicKeys[0]

          obj.currentKeys.publicKey = newkeys.public
          obj.currentKeys.privateKey = newkeys.private
          obj.currentKeys.revocationCertificate = newkeys.revocation
          const json = JSON.stringify(obj)

          fs.writeFile(this.path, json, 'utf8', (err) => {
            if (err) {
              throw err
            }
          });
        }
      }
    })
  }

  changeCurrentKeys(id) {
    fs.readFile(this.path, 'utf8', (err, res) => {
      if (err) {
        throw err
      } else {
        let obj = JSON.parse(res);

        for (let i = 0; i < obj['publicKeys'].length; i++) {
          if (obj['publicKeys'][i].key === id) {
            obj.currentKeys.publicKey = obj['publicKeys'][i].public
            obj.currentKeys.privateKey = obj['publicKeys'][i].private
            obj.currentKeys.revocationCertificate = obj['publicKeys'][i].revocation
          }
        }
        const json = JSON.stringify(obj)
        fs.writeFile(this.path, json, 'utf8', (err) => {
          if (err) {
            throw err
          }
        })
      }
    }
    )
  }

  getMyPublicKey() {
    try {
      const keys = JSON.parse(fs.readFileSync(this.path, 'utf8'))
      return keys.currentKeys.publicKey
    } catch (e) {
      throw e
    }

  }

  deletePublicKey(key, id) {
    fs.readFile(this.path, 'utf8', (err, res) => {
      if (err) {
        throw err
      } else {
        const obj = JSON.parse(res);

        for (let i = 0; i < obj[key].length; i++) {
          if (obj[key][i].key === id) {
            obj[key].splice(i, 1);
          }
        }

        const json = JSON.stringify(obj)
        fs.writeFileSync(this.path, json)
        this.selectKeyAuto()
      }
    })
  }

  deleteFavorite(key, id) {
    fs.readFile(this.path, 'utf8', (err, res) => {
      if (err) {
        throw err
      } else {
        const obj = JSON.parse(res);

        for (let i = 0; i < obj[key].length; i++) {
          if (obj[key][i].key === id) {
            obj[key].splice(i, 1);
          }
        }

        const json = JSON.stringify(obj)

        fs.writeFile(this.path, json, 'utf8', (err) => {
          if (err) {
            throw err
          }
        })
      }
    })
  }

  deleteHistory(key) {
    fs.readFile(this.path, 'utf8', (err, res) => {
      if (err) {
        throw err
      } else {
        const obj = JSON.parse(res)
        obj[key] = []
        const json = JSON.stringify(obj)

        fs.writeFile(this.path, json, 'utf8', (err) => {
          if (err) {
            throw err
          }
        })
      }
    })
  }

  get(key) {
    const data = fs.readFileSync(this.path, 'utf8')
    const parsedData = JSON.parse(data)
    return parsedData[key]
  }

  setPgpKeys(keys) {

    fs.readFile(this.path, 'utf8', (err, res) => {
      if (err) {
        throw err
      } else {
        let obj = JSON.parse(res);
        let id = obj['publicKeys'].length
        id++

        let data = {}
        data.public = keys.publicKeyArmored
        data.private = keys.privateKeyArmored
        data.revocation = keys.revocationCertificate
        data.key = id

        obj['publicKeys'].push(data)
        obj.currentKeys.publicKey = keys.publicKeyArmored
        obj.currentKeys.privateKey = keys.privateKeyArmored
        obj.currentKeys.revocationCertificate = keys.revocationCertificate

        const json = JSON.stringify(obj)

        fs.writeFile(this.path, json, 'utf8', (err) => {
          if (err) {
            throw err
          }
        })
      }
    })
  }

  add(key, data) {
    fs.readFile(this.path, 'utf8', (err, res) => {
      if (err) {
        throw err
      } else {
        let obj = JSON.parse(res)
        let id = obj[key].length
        id++
        data.key = id
        obj[key].push(data)
        const json = JSON.stringify(obj)

        fs.writeFile(this.path, json, 'utf8', (err) => {
          if (err) {
            throw err
          }
        })
      }
    })
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return defaults;
  }
}


module.exports = Database;