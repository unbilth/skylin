import React from 'react'
import { Statistic, Card, Row, Col } from 'antd';
import './style.css'
import 'antd/dist/antd.css';

class HeaderStatistics extends React.Component {
  _isMounted = false
  constructor(props) {
    super(props)
    this.state = {
      hosts: null,
      tbCapacity: null,
      tbUsed: null
    }
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      fetch("https://siastats.info/dbs/network_status.json").then(res => res.json())
        .then(
          (res) => {
            this.setState({
              hosts: res.online_hosts,
              tbCapacity: res.network_capacity_TB,
              tbUsed: res.used_storage_TB
            })
          },
          (error) => {

            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Row justify="center" gutter={16}>
        <Col span={6} justify="center">
          <Card>
            <Statistic
              title="Hosts"
              value={this.state.hosts}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="TB capacity"
              value={this.state.tbCapacity}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="TB used"
              value={this.state.tbUsed}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>
    )
  }
}

export default HeaderStatistics