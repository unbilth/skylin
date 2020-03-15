import React from 'react'

import './style.css'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import { Row, Col, notification,  Table, Button, Modal, Form, Input, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Column } = Table;
const { ipcRenderer } = window.require("electron");

class PublicKeys extends React.Component {
  _isMounted = false
  constructor(props) {
    super(props)
    this.state = {
      publicKeys: [],
      pgpModal: false,
      visible: false
    }
  }

  componentDidMount() {
    this._isMounted = true
    if (this._isMounted) {
      ipcRenderer.send('getPublicKeys')

      ipcRenderer.on('publicKeys', (event, res) => {
        this.setState({ publicKeys: res })
      })

      ipcRenderer.on('publicKeyDeleted', (event, res) => {
        this.setState({ publicKeys: res })
        ipcRenderer.send('getPublicKeys')
      })

      ipcRenderer.on('NewPublicKey', (event, res) => {
        this.openNotificationKeysGenerated()
        ipcRenderer.send('getPublicKeys')
      })

      ipcRenderer.on('changeCurrentKeys', (event, res) => {
        this.successChangedKey()
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    ipcRenderer.removeAllListeners()
  }

  successChangedKey() {
    Modal.success({
      content: 'You are now using a new public key',
    });
  }

  deletePublicKey(id) {
    ipcRenderer.send('deletePublicKey', id)
  }

  changeCurrentKeys(id) {
    ipcRenderer.send('changeCurrentKeys', id)
  }

  openNotificationKeysGenerated() {
    notification['success']({
      message: 'Successful',
      description: 'Your public key generated.',
    });
    this.setState({ publicKeys: [] })
  };

  showModal() {
    this.setState({ pgpModal: true })
  };

  handleOk() {
    this.setState({ pgpModal: false })
  };

  handleCancel() {
    this.setState({ pgpModal: false })
  };

  onFinishFailed(errorInfo) {
    //console.log('Failed:', errorInfo);
  };

  showDrawer() {
    this.setState({
      visible: true,
    });
  };

  onFinish(values) {
    ipcRenderer.send('postPublicKey', {
      passphrase: values.passphrase
    })

  };

  onClose() {
    this.setState({
      visible: false,
    });
  };
 
  render() {
    return (
      <div>
        <Row>
          <Col>
            <Row  gutter={[16]}>
              <Col>
                <Button type="primary" onClick={() => this.showDrawer()}>
                <PlusOutlined />New public key</Button>
              </Col>
            </Row>
            
            <Drawer
              title="New public key"
              width={720}
              onClose={() => this.onClose()}
              visible={this.state.visible}
              bodyStyle={{ paddingBottom: 80 }}
            >
              <Form layout="vertical" hideRequiredMark
                onFinish={(e) => this.onFinish(e)}>
                <Row gutter={16} justify="center">
                  <Col>
                    <p>
                      Passphrase to add a layer of security to your private key.
                      If you forget the passphrase, you will no longer be able to decrypt
                      the private key.
                    </p>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Password"
                      name="passphrase"
                      rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                      <Input.Password placeholder="Example : What the private key is encrypted with." />
                    </Form.Item>
                  </Col>

                  <Col span="12">
                    <Button
                      onClick={() => this.onClose()}
                      style={{ marginRight: 8 }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={(e) => this.onClose()} htmlType="submit" type="primary">
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Drawer>
          </Col>
        </Row>

        <Table dataSource={this.state.publicKeys} pagination={{ pageSize: 10 }} scroll={{ y: 330 }} style={{ whiteSpace: 'pre' }}>
          <Column title="My public keys" dataIndex="public" key="key" width={600}/>
          <Column
            title="Action"
            key="key"
            render={(text, record) => (
              <div> 
                <a style={{ padding: '5px' }} onClick={() => {
                    this.changeCurrentKeys(record.key)
                  }}>Select</a>
                <a style={{ padding: '5px' }} onClick={() => {
                    this.deletePublicKey(record.key)
                  }}>Delete</a>
              </div>
            )}
          />
        </Table>
      </div>
    )
  }
}

export default PublicKeys