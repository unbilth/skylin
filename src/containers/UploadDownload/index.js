import React from 'react'

import './style.css'
import 'antd/dist/antd.css';
import FileUpload from '../../components/FileUpload'
import FileDownload from '../../components/FileDownload'
import { Row, Col, Spin, Modal, message, notification } from 'antd';

const { ipcRenderer } = window.require("electron");
const { confirm } = Modal;

class UploadDownload extends React.Component {
  _isMounted = false
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      downloadLoading: false,
      symmetricPassword: null,
      encryptionType: null,
      addFav: false,
      favoriteSkylink: null,
      encryptionMethod: null,
      addFavModal: false
    }
  }

  componentDidMount() {
    this._isMounted = true

    if(this._isMounted) {
      ipcRenderer.on('reply', (event, messages) => {
        this.setState({ loading: true })
      })
  
      ipcRenderer.on('download reply', (event, messages) => {
        this.setState({ downloadLoading: true })
      })
  
      ipcRenderer.on('successful upload', (event, res) => {
        this.setState({
          loading: false,
          addFavModal: true,
          favoriteSkylink: res.skylink,
          encryptionMethod: res.encryption
        }, () => {
          this.successFulUpload()
        })
      })
  
      ipcRenderer.on('successful download', (event, res) => {
        this.setState({
          downloadLoading: false,
          encryptionMethod: res.encryption
        },() => {
          this.successFulDownload()
        })
      })

      ipcRenderer.on('noneUploadFailed', (e) => {
        this.setState({ loading: false }, () => {
          this.noneUploadFailed()
        });
      })

      ipcRenderer.on('symmetricUploadFailed', (e) => {
        this.setState({ loading: false }, () => {
          this.symmetricUploadFailed()
        });
      })

      ipcRenderer.on('asymmetricUploadFailed', (e) => {
  
        this.setState({ loading: false }, () => {
          this.asymmetricUploadFailed()
        });
      })

      ipcRenderer.on('noneDownloadFailed', (e) => {
        this.setState({ downloadLoading: false }, () => {
          this.noneDownloadFailed()
        });
      })
  
      ipcRenderer.on('symmetricDownloadFailed', (e) => {
        this.setState({ downloadLoading: false }, () => {
          this.symmetricDownloadFailed()
        });
      })

      ipcRenderer.on('asymmetricDownloadFailed', (e) => {
  
        this.setState({ downloadLoading: false }, () => {
          this.asymmetricDownloadFailed()
        });
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    ipcRenderer.removeAllListeners()
  }

  successFulDownload() {
    notification['success']({
      message: 'Successful download',
      description: 'Your file has been downloaded successfully. The file is in your /Downloads directory.',
    });
  };

  successFulUpload() {
    notification['success']({
      message: 'Successful upload',
      description: 'Your file has been uploaded successfully.',
    });
  };

  setSymmetricPassword(password) {
    this.setState({symmetricPassword: password, encryptionType: 'symmetric'})
  }

  setSkylink(skylink) {
    this.setState({skylink: skylink})
  }

  addFav(encryptionType) {
    this.ipcAddFav({ skylink: this.state.favoriteSkylink, encryption: encryptionType })
  }
  
  cancelFav() {
    this.setState({favoriteSkylink: null})
  }

  noKeys() {
    message.error("You don't have a public key. Generate your pgp keys and try again", 10);
  };

  noneUploadFailed() {
    message.error("We advise you not to exceed 1 gigabyte per file. Try again if it still doesn't work. Try again later.", 10);
  };

  symmetricUploadFailed() {
    message.error("It seems that an error has occurred. Make sure you type a password, we advise you not to exceed 1 gigabyte per file.", 10);
  };

  asymmetricUploadFailed() {
    message.error("It seems that an error has occurred, Make sure you type a passphrase and have previously generated at least one public key. We advise you not to exceed 1 gigabyte per file.", 10);
  };

  noneDownloadFailed() {
    message.error("Try again if it still doesn't work. Try again later.", 10);
  };

  symmetricDownloadFailed() {
    message.error("It seems that an error has occurred, it may be due to a wrong password or a file that is not symmetrically encrypted.", 10);
  };

  asymmetricDownloadFailed() {
    message.error("It seems that an error has occurred, it may be due to a wrong passphrase or a file that is not asymmetrically encrypted. If you don't have a public key generate one and try again with another skylink.", 10);
  };

  ipcAddFav(fav) {
    ipcRenderer.send('postFav', fav)
    this.setState({ addFavModal: false, favoriteSkylink: null, encryptionType: null })

  }

  uploadClick(encryptionType, publicAddress) {    
    if(encryptionType === 'symmetric') {
      ipcRenderer.send('upload', {
        encryptionType: encryptionType,
        password: this.state.symmetricPassword
      })
    } else if(encryptionType === 'asymmetric'){
      ipcRenderer.send('upload', {
        encryptionType: encryptionType,
        publicAddress: publicAddress
      })
    } else {
      ipcRenderer.send('upload', {
        encryptionType: encryptionType
      })
    }
  }

  downloadClick(encryptionType, skylink, privateKeyPassphrase) {    
    if(encryptionType === 'symmetric') {
      ipcRenderer.send('download', {
        encryptionType: encryptionType,
        skylink: skylink,
        password: this.state.symmetricPassword
      })
    } else if(encryptionType === 'asymmetric'){      
      ipcRenderer.send('download', {
        encryptionType: encryptionType,
        skylink: skylink,
        privateKeyPassphrase: privateKeyPassphrase
      })
      
    } else {
      ipcRenderer.send('download', {
        encryptionType: encryptionType,
        skylink: skylink
      })
    }
  }

  render() {
    return (
      <div className="ant-layout">
        <Row align="middle" justify="center">
          <Spin tip="Uploading..." spinning={this.state.loading} delay={500}>
            <Col className="gutter-row-upload" span={24}>
              <FileUpload
                setSymmetricPasssword={(e) => this.setSymmetricPassword(e)}
                onClick={(e, p) => this.uploadClick(e, p)}
                addFav={(e) => this.addFav(e)}
                cancelFav={() => this.cancelFav()}
                favoriteSkylink={this.state.favoriteSkylink}
                addFavModal={this.state.addFavModal}
              />
            </Col>
          </Spin>

          <Spin tip="Downloading..." spinning={this.state.downloadLoading} delay={500}>
            <Col className="gutter-row-download" span={24}>
              <FileDownload 
                setSymmetricPasssword={(e) => this.setSymmetricPassword(e)}
                setSkylink={(e) => this.setSkylink(e)}
                onClick={(e, y, z) => this.downloadClick(e, y, z)}
              />
            </Col>
          </Spin>
        </Row>
      </div>
    )
  }
}

export default UploadDownload