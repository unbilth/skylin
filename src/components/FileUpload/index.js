import React from 'react';

import './style.css'

import { Row, Col, Divider, Modal, Button, Form, Input, Drawer } from 'antd';
import UploadButton from '../../components/atoms/UploadButton'
import CheckboxEncryption from '../../components/CheckboxEncryption'

class FileUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      symmetricChecked: false,
      asymmetricChecked: false,
      passwordDrawer: false,
      addFavModal: false,
      publicAddressDrawer: false
    }
  }

  upload() {
    if (this.state.symmetricChecked) {
      this.showPasswordDrawer()
    } else if (this.state.asymmetricChecked) {
      this.showPublicAddressDrawer()
    } else {
      this.props.onClick('none')
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

  showPasswordDrawer() {
    this.setState({
      passwordDrawer: true
    });
  };

  onFinishPasswordDrawer(values) {
    this.props.setSymmetricPasssword(values.password)
    this.props.onClick('symmetric')
  };

  onClosePasswordDrawer() {
    this.setState({
      passwordDrawer: false,
    });
  };

  showPublicAddressDrawer() {
    this.setState({
      publicAddressDrawer: true
    });
  };

  onFinishPublicAddressDrawer(values) {
    this.props.onClick('asymmetric', values.publicAddress)
  };

  onClosePublicAddressDrawer() {
    this.setState({
      publicAddressDrawer: false,
    });
  };

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
            <h1>Upload</h1>
          </Col>

          <Col className="upload-col" span={24}>
            <UploadButton value="Click to Upload" onClick={() => this.upload()} />
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
        <p>Would you like to add it to your favorites?</p>
      </Modal>

      <Drawer
        title="Upload"
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
                rules={[{ required: true, message: 'Please input your password!' }]}
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
        title="Upload"
        width={720}
        onClose={() => this.onClosePublicAddressDrawer()}
        visible={this.state.publicAddressDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" hideRequiredMark
          onFinish={(e) => this.onFinishPublicAddressDrawer(e)}>
          <Row gutter={16} justify="center">
            <Col>
              <p>Public address</p>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Public address"
                name="publicAddress"
                rules={[{ required: true, message: "Please input the public address!" }]}
              >
                <Input.TextArea placeholder="Public Address" />
              </Form.Item>
            </Col>

            <Col span="12">
              <Button
                onClick={() => this.onClosePublicAddressDrawer()}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button onClick={(e) => this.onClosePublicAddressDrawer()} htmlType="submit" type="primary">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  }
}

export default FileUpload;