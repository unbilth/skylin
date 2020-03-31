import React from 'react'

import FileUpload from '../../components/FileUpload'
import FileDownload from '../../components/FileDownload'
import { Row, Col, Spin, Modal, message, notification } from 'antd';
import { 
  noKeys, 
  uploadFileFailed, 
  uploadSymmetricFileFailed, 
  uploadAsymmetricFileFailed,
  downloadFileFailed, 
  downloadSymmetricFileFailed, 
  downloadAsymmetricFileFailed 
} from '../../lib/errorMessages'

import './style.css'
import 'antd/dist/antd.css';

const { ipcRenderer } = window.require("electron");

class UploadDownload extends React.Component {
  _isMounted = false
  constructor(props) {
    super(props)
    this.state = {
      downloadLoading: false,
      loading: false,
      addFav: false,
      addFavModal: false,
      favoriteSkylink: null,
      symmetricPassword: null
    }
  }

  componentDidMount() {
    this._isMounted = true

    if(this._isMounted) {
      ipcRenderer.on('reply', () => {
        this.setState({ loading: true })
      })
  
      ipcRenderer.on('download reply', () => {
        this.setState({ downloadLoading: true })
      })
  
      ipcRenderer.on('successful upload', (e, res) => {
        this.setState({
          loading: false,
          addFavModal: true,
          favoriteSkylink: res.skylink
        }, () => {
          this.successFullUpload()
        })
      })
  
      ipcRenderer.on('successful download', (e, res) => {
        this.setState({
          downloadLoading: false,
          encryptionMethod: res.encryption
        },() => {
          this.successFullDownload()
        })
      })

      ipcRenderer.on('noneUploadFailed', () => {
        this.setState({ loading: false }, () => {
          uploadFileFailed()
        });
      })

      ipcRenderer.on('symmetricUploadFailed', () => {
        this.setState({ loading: false }, () => {
          uploadSymmetricFileFailed()
        });
      })

      ipcRenderer.on('asymmetricUploadFailed', () => {
        this.setState({ loading: false }, () => {
          uploadAsymmetricFileFailed()
        });
      })

      ipcRenderer.on('noneDownloadFailed', () => {
        this.setState({ downloadLoading: false }, () => {
          downloadFileFailed()
        });
      })
  
      ipcRenderer.on('symmetricDownloadFailed', () => {
        this.setState({ downloadLoading: false }, () => {
          downloadSymmetricFileFailed()
        });
      })

      ipcRenderer.on('asymmetricDownloadFailed', () => {
        this.setState({ downloadLoading: false }, () => {
          downloadAsymmetricFileFailed()
        });
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    ipcRenderer.removeAllListeners()
  }

  successFullDownload() {
    notification['success']({
      message: 'Successful download',
      description: 'Your file has been downloaded successfully. The file is in your /Downloads directory.',
    });
  };

  successFullUpload() {
    notification['success']({
      message: 'Successful upload',
      description: 'Your file has been uploaded successfully.',
    });
  };

  setSymmetricPassword(password) {
    this.setState({symmetricPassword: password})
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

  ipcAddFav(fav) {
    ipcRenderer.send('postFav', fav)
    this.setState({ addFavModal: false, favoriteSkylink: null, encryptionType: null })
  }

  uploadClick(encryptionType, publicAddress) {  
    switch(encryptionType){
      case 'symmetric':
        ipcRenderer.send('upload', {
          encryptionType: encryptionType,
          password: this.state.symmetricPassword
        })
        break
      case 'asymmetric':
        ipcRenderer.send('upload', {
          encryptionType: encryptionType,
          publicAddress: publicAddress
        })
        break
      default:
        ipcRenderer.send('upload', {
          encryptionType: encryptionType
        })
    }
  }

  downloadClick(encryptionType, skylink, privateKeyPassphrase) {
    switch(encryptionType){
      case 'symmetric':
        ipcRenderer.send('download', {
          encryptionType: encryptionType,
          skylink: skylink,
          password: this.state.symmetricPassword
        })
        break
      case 'asymmetric':
        ipcRenderer.send('download', {
          encryptionType: encryptionType,
          skylink: skylink,
          privateKeyPassphrase: privateKeyPassphrase
        })
        break
      default:
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