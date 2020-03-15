import React, { Component } from 'react'
import { Route, Link, HashRouter } from 'react-router-dom';
import { createBrowserHistory as createHistory } from 'history';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import UploadDownload from './containers/UploadDownload/index'
import Favorites from './containers/Favorites/index'
import History from './containers/History/index'
import HeaderStatistics from './containers/HeaderStatistics/index'
import PublicKeys from './containers/PublicKeys/index';

import { Layout, Menu } from 'antd';
import { AntCloudOutlined, StarOutlined, KeyOutlined, HistoryOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const history = createHistory();

class App extends Component {
  render() {
    return (
      <HashRouter history={history}>
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <AntCloudOutlined />
                <Link to="/"><span className="nav-text">Upload / Download</span></Link>
              </Menu.Item>

              <Menu.Item key="2">
                <StarOutlined />
                <Link to="/favorites"><span className="nav-text">Favorites</span></Link>
              </Menu.Item>

              <Menu.Item key="3">
                <HistoryOutlined />
                <Link to="/history"><span className="nav-text">History</span></Link>
              </Menu.Item>

              <Menu.Item key="4">
                <KeyOutlined />
                <Link to="/publicKeys"><span className="nav-text">Public Keys</span></Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header className="site-layout-sub-header-background" style={{ padding: 20 }}>
              <HeaderStatistics />
            </Header>

            <Content style={{ margin: '24px 16px 0' }}>
              <div className="site-layout-background" style={{ padding: 24 }}>
                <Route path="/" exact component={UploadDownload} />
                <Route path="/favorites" component={Favorites} />
                <Route path="/history" component={History} />
                <Route path="/publicKeys" component={PublicKeys} />
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Stats provided by siastats.info
            </Footer>
          </Layout>
        </Layout>
      </HashRouter>
    )
  }
}

export default App