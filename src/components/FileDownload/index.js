import React from 'react';

import './style.css'

import { Row, Col, Divider, Modal, Button, Form, Input, Drawer } from 'antd';
import DownloadButton from '../../components/atoms/DownloadButton'
import CheckboxEncryption from '../../components/CheckboxEncryption'


class FileDownload extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      symmetricChecked: false,
      asymmetricChecked: false,
      passwordDrawer: false,
      privateKeyPassphraseDrawer: false,
      skylinkDrawer: false,
      skylink: null
    }
  }

  download() {
    if(!this.state.skylinkDrawer) {
      this.showSkylinkDrawer()
    }
  }

  symmetricChecked(checkbox) {
    if (checkbox) {
      this.setState({
        symmetricChecked: true,
      });
    } else {
      this.setState({
        symmetricChecked: false,
      });
    }
  }

  asymmetricChecked(checkbox) {
    if (checkbox) {
      this.setState({
        asymmetricChecked: true,
      });
    } else {
      this.setState({
        asymmetricChecked: false,
      });
    }
  }

  showSkylinkDrawer() {
    this.setState({
      skylinkDrawer: true
    });
  };


  onFinishSkylinkDrawer(values) {
    this.props.setSkylink(values.skylink)

    if(this.state.symmetricChecked){
      this.showPasswordDrawer(values.skylink)
    } else {
      if (this.state.asymmetricChecked) {
        this.showPrivateKeyPassphraseDrawer(values.skylink)
      } else {
        this.props.onClick('none', values.skylink)
      }
    }
  }

  onCloseSkylinkDrawer() {
    this.setState({
    skylinkDrawer: false,
    })
  }

  showPasswordDrawer(skylink) {
    this.setState({
      passwordDrawer: true,
      skylink: skylink
    })
  }

  onFinishPasswordDrawer(values) {
    this.props.setSymmetricPasssword(values.password)
    this.props.onClick('symmetric', this.state.skylink)
  }
  
  onClosePasswordDrawer() {
    this.setState({
      passwordDrawer: false,
    })
  }

  showPrivateKeyPassphraseDrawer(skylink) {
    this.setState({
      privateKeyPassphraseDrawer: true,
      skylink: skylink
    })
  }

  onFinishPrivateKeyPassphraseDrawer(values) {
    this.props.onClick('asymmetric', this.state.skylink, values.password)
  }

  onClosePrivateKeyPassphraseDrawer() {
    this.setState({
      privateKeyPassphraseDrawer: false,
    })
  }

  addFav() {
    if (this.state.symmetricChecked) {
      this.props.addFav('symmetric')
    }
    else if (this.state.asymmetricChecked) {
      this.props.addFav('asymmetric')
    } else {
      this.props.addFav('none')
    }
  }

  handleOkFav() {
    this.setState({
      addFavModal: true,
    }, () => {
      this.props.addFav()
    });
  }

  handleCancelFav() {
    this.setState({
      addFavModal: false,
    }, () => {
      this.props.cancelFav()
    });
  }

  render() {
    return <div>
      <Row>
        <Row justify="center">
          <Col span={24}>
            <h1>Download</h1>
          </Col>

          <Col className="download-col" span={24}>
            <DownloadButton value="Click to Download" onClick={() => this.download()} />
            <Divider orientation="left">Encryption</Divider>
            <CheckboxEncryption
              passwordDrawer={() => this.showPasswordDrawer()}
              symmetricChecked={(e) => this.symmetricChecked(e)}
              asymmetricChecked={(e) => this.asymmetricChecked(e)}
            />
          </Col>
        </Row>
      </Row>

      <Modal
        title="Your skylink"
        visible={this.props.addFavModal}
        onOk={() => this.addFav()}
        onCancel={() => this.handleCancelFav()}
      >
        {this.props.favoriteSkylink}
      </Modal>

      <Drawer
        title="Download"
        width={720}
        onClose={() => this.onCloseSkylinkDrawer()}
        visible={this.state.skylinkDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" hideRequiredMark
          onFinish={(e) => this.onFinishSkylinkDrawer(e)}>
          <Row gutter={16} justify="center">
            
            <Col span={24}>
              <Form.Item
                label="Skylink"
                name="skylink"
                rules={[{ required: true, message: 'Please input a skylink.' }]}
              >
                <Input placeholder="Example : sia://PAL0w4SdA5rFCDGEutgpeQ50Om-YkBabtXVOJAkmedslKw" />
              </Form.Item>
            </Col>

            <Col span="12">
              <Button
                onClick={() => this.onCloseSkylinkDrawer()}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button onClick={(e) => this.onCloseSkylinkDrawer()} htmlType="submit" type="primary">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>

      <Drawer
        title="Download"
        width={720}
        onClose={() => this.onClosePasswordDrawer()}
        visible={this.state.passwordDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" hideRequiredMark
          onFinish={(e) => this.onFinishPasswordDrawer(e)}>
          <Row gutter={16} justify="center">
            <Col>
              <p>File password</p>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input a password!' }]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>

            <Col span="12">
              <Button
                onClick={() => this.onClosePasswordDrawer()}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button onClick={(e) => this.onClosePasswordDrawer()} htmlType="submit" type="primary">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>

      <Drawer
        title="Download"
        width={720}
        onClose={() => this.onClosePrivateKeyPassphraseDrawer()}
        visible={this.state.privateKeyPassphraseDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" hideRequiredMark
          onFinish={(e) => this.onFinishPrivateKeyPassphraseDrawer(e)}>
          <Row gutter={16} justify="center">
            <Col>
              <p>Private key passphrase</p>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your passphrase!' }]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>

            <Col span="12">
              <Button
                onClick={() => this.onClosePrivateKeyPassphraseDrawer()}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button onClick={(e) => this.onClosePrivateKeyPassphraseDrawer()} htmlType="submit" type="primary">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  }
}

export default FileDownload;