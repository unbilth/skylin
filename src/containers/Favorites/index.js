import React from 'react'

import './style.css'

import { Table } from 'antd';
const { Column } = Table;

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

const { ipcRenderer } = window.require("electron");

class Favorites extends React.Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      favorites: []
    }
  }

  componentDidMount() {
    this._isMounted = true

    if (this._isMounted) {
      ipcRenderer.send('getFavorites')

      ipcRenderer.on('favorites', (event, res) => {
        this.setState({ favorites: res })
      })

      ipcRenderer.on('favoriteDeleted', (event, res) => {
        this.setState({ favorites: [] })
        ipcRenderer.send('getFavorites')
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    ipcRenderer.removeAllListeners()
  }

  deleteFavorite(id) {
    ipcRenderer.send('deleteFavorite', id)
  }

  render() {
    return (
      <div>
        <Table dataSource={this.state.favorites} pagination={{ pageSize: 20 }} scroll={{ y: 330 }}>
          <Column title="Skylink" dataIndex="skylink" key="skylink" width={500} />
          <Column title="Encryption" dataIndex="encryption" key="encryption" />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <span>
                <a onClick={() => {
                  this.deleteFavorite(record.key)
                }}>Delete</a>
              </span>
            )}
          />
        </Table>
      </div>
    )
  }
}

export default Favorites