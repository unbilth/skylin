import React from 'react'

import './style.css'
import 'antd/dist/antd.css';

import { Table, Row, Col, Button } from 'antd';

const { Column } = Table;
const { ipcRenderer } = window.require("electron");

class History extends React.Component {
  _isMounted = false
  constructor(props) {
    super(props)
    this.state = {
      history: []
    }
  }

  componentDidMount() {
    this._isMounted = true
    if (this._isMounted) {
    ipcRenderer.on('history', (event, res) => {
      this.setState({ history: res })
    })
    ipcRenderer.send('getHistory')

    ipcRenderer.on('historyDeleted', (event, res) => {
      this.setState({ history: res })
      ipcRenderer.send('getHistory')
    })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    ipcRenderer.removeAllListeners()
  }

  deleteHistory() {
    ipcRenderer.send('deleteHistory')
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
              <Button type="primary" onClick={() => this.deleteHistory()}>Delete your history</Button>
          </Col>
        </Row>

        <Row xl={0}>
          <Col span={24} >
            <Table dataSource={this.state.history} pagination={{ pageSize: 20 }} scroll={{ y: 330 }}>
              <Column title="Skylink" dataIndex="skylink" key="skylink" width={500} />
              <Column title="Encryption" dataIndex="encryption" key="encryption" />
              <Column title="Type" dataIndex="type" key="type" />
            </Table>
          </Col>
        </Row>
      </div>
    )
  }
}

export default History