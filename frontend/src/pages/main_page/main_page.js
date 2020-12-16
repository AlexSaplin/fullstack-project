import React from 'react';
import { Layout, Menu, Drawer, Row, Col, Dropdown, Button } from 'antd';
import { BrowserView, MobileView } from "react-device-detect";
import { matchPath } from 'react-router';

import {
  CreditCardOutlined,
  LinkOutlined,
  ClusterOutlined,
  ImportOutlined,
  MenuOutlined,
  UserOutlined,
  DollarOutlined,
  DownOutlined,
  QuestionOutlined,
  GithubOutlined,
  ReadOutlined,
  MessageOutlined,
  CloudServerOutlined,
  BookOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  Link,
} from "react-router-dom"
import { UserActions, BillingActions } from '../../actions';

import FunctionsList from '../../components/functions_list';
import APIKey from '../../components/api_key';
import Billing from '../../components/billing';

import Logo from './logo.png';
import ContainersList from "../../components/containers_list";
import NewContainerModal from "../../components/containers_list/new_container_modal";

const { Content, Header, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class MainPageUnwrapped extends React.Component {
  componentDidMount() {
    this.props.get_money();
  }

  state = {
    activeMenuItem: 'functions',
    mobileMenuVisible: false,
    containersVisible: false,
  };

  showContainersModal = () => {
    this.setState({
      containersVisible: true,
    });
  };

  hideContainersModal = () => {
    this.setState({
      containersVisible: false,
    })
  };

  onMobileMenuClose = () => {
    const { mobileMenuVisible } = this.state;
    this.setState({mobileMenuVisible: !mobileMenuVisible});
  }

  render() {
    const { location, user, money } = this.props;
    const { mobileMenuVisible } = this.state;

    let active_tab = 'functions';
    if (location.pathname === '/containers')
      active_tab = 'containers';
    if (location.pathname === '/api_key')
      active_tab = 'api_key';
    if (location.pathname === '/billing')
      active_tab = 'billing';

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <BrowserView>
          <Sider style={{minHeight: '100%'}}>
            <Row justify="center" align="middle" style={{height: '64px'}}>
              <img src={Logo} alt={"deepmux"} style={{height: '50px'}}/>
            </Row>
            <Menu theme="dark" style={{minHeight: '100%'}} selectedKeys={[active_tab]} >
              <Menu.Item key="containers" icon={<CloudServerOutlined />} style={{marginTop: '0'}}>
                <Link to="/containers">Containers</Link>
              </Menu.Item>
              <Menu.Item key="functions" icon={<ClusterOutlined />} style={{marginTop: '0'}}>
                <Link to="/functions">Functions</Link>
              </Menu.Item>
              <Menu.Item key="api_key" icon={<LinkOutlined />}>
                <Link to="/api_key">API Key</Link>
              </Menu.Item>
              <Menu.Item key="billing" icon={<CreditCardOutlined />}>
                <Link to="/billing">Billing</Link>
              </Menu.Item>
              <SubMenu key="help_sub" icon={<QuestionOutlined />} title="Help">
                <Menu.Item key="help_colab" icon={<BookOutlined />}>
                  <a href="https://colab.research.google.com/drive/1Hxx5k-o4_WRMptX2hz8Ht0_HBpvziiMs" target="_blank" rel="noopener noreferrer" >Colab Example</a>
                </Menu.Item>
                <Menu.Item key="help_github" icon={<GithubOutlined />}>
                  <a href="https://github.com/deep-Mux" target="_blank" rel="noopener noreferrer" >GitHub</a>
                </Menu.Item>
                <Menu.Item key="help_docs" icon={<ReadOutlined />}>
                  <a href="https://deep-mux.github.io" target="_blank" rel="noopener noreferrer" >Documentation</a>
                </Menu.Item>
                <Menu.Item key="help_support" icon={<MessageOutlined />}>
                  <a href="mailto:dev@deepmux.com" target="_blank" rel="noopener noreferrer" >Contact Support</a>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
        </BrowserView>
        <MobileView>
          <Drawer
            title="Menu"
            placement="left"
            closable={true}
            onClose={this.onMobileMenuClose}
            visible={mobileMenuVisible}
            forceRender={true}
            className="mainpage_drawer"
            bodyStyle={{padding: 0}}
          >
            <Menu theme="light" style={{minHeight: '100%', marginTop: '20px'}} selectedKeys={[active_tab]} >
              <Menu.Item key="containers" icon={<CloudServerOutlined />} style={{marginTop: '0'}} onClick={() => {this.setState({mobileMenuVisible: false})}}>
                <Link to="/containers">Containers</Link>
              </Menu.Item>
              <Menu.Item key="functions" icon={<ClusterOutlined />} style={{marginTop: '0'}} onClick={() => {this.setState({mobileMenuVisible: false})}}>
                <Link to="/functions">Functions</Link>
              </Menu.Item>
              <Menu.Item key="api_key" icon={<LinkOutlined />} onClick={() => {this.setState({mobileMenuVisible: false})}}>
                <Link to="/api_key">API Key</Link>
              </Menu.Item>
              <Menu.Item key="billing" icon={<CreditCardOutlined />} onClick={() => {this.setState({mobileMenuVisible: false})}}>
                <Link to="/billing">Billing</Link>
              </Menu.Item>
              <SubMenu key="help_sub" icon={<QuestionOutlined />} title="Help">
                <Menu.Item key="help_colab" icon={<BookOutlined />}>
                  <a href="https://colab.research.google.com/drive/1Hxx5k-o4_WRMptX2hz8Ht0_HBpvziiMs" target="_blank" rel="noopener noreferrer" >Colab Example</a>
                </Menu.Item>
                <Menu.Item key="help_github" icon={<GithubOutlined />}>
                  <a href="https://github.com/deep-Mux" target="_blank" rel="noopener noreferrer" >GitHub</a>
                </Menu.Item>
                <Menu.Item key="help_docs" icon={<ReadOutlined />}>
                  <a href="https://deep-mux.github.io" target="_blank" rel="noopener noreferrer" >Documentation</a>
                </Menu.Item>
                <Menu.Item key="help_support" icon={<MessageOutlined />}>
                  <a href="mailto:dev@deepmux.com" target="_blank" rel="noopener noreferrer" >Contact Support</a>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="4" icon={<ImportOutlined />} onClick={() => {this.setState({mobileMenuVisible: false}); this.props.logout()}}>
                Logout
              </Menu.Item>
            </Menu>
          </Drawer>
        </MobileView>
        <Layout className="site-layout">
          <MobileView>
            <Header>
              <Row align="middle" justify="center" style={{width: '100%', height: '100%'}}>
                <MenuOutlined
                  style={{fontSize: '24px', color: '#fff', lineHeight: '1.35', position: 'absolute', left: '15px', top: '20px'}}
                  onClick={() => this.setState({mobileMenuVisible: true})}
                />

                <img src={Logo} alt={"deepmux"} style={{height: '64px'}}/>
              </Row>
            </Header>
          </MobileView>
          <BrowserView>
            <Header style={{padding: 0, background: '#fff'}}>
              <Row align="middle" justify="space-between" style={{width: '100%', height: '100%', paddingRight: '34px', paddingLeft: '34px'}}>
                <Col>
                  { !!matchPath(
                    this.props.location.pathname,
                    '/containers'
                  ) && (
                    <>
                      <Button type="primary" onClick={this.showContainersModal}>
                        <PlusOutlined/>Deploy New Container</Button>
                      <NewContainerModal visible={this.state.containersVisible} hideModal={this.hideContainersModal}/>
                    </>
                  )
                  }
                </Col>
                <Col>
                  <Row align="middle" justify="space-between" style={{width: '100%', height: '100%'}}>
                    <Link to="/billing">
                      <Col>
                        <Row align="middle" style={{height: '100%'}}>
                          <Button style={{border: 'none', marginRight: 10}}>
                            <Row align="middle" style={{height: '100%'}}>
                              <DollarOutlined style={{fontSize: 20}}/>&nbsp;{money !== undefined ? Number(money).toFixed(2) : "Loading..."}
                            </Row>
                          </Button>
                        </Row>
                      </Col>
                    </Link>

                    <Col >
                      <Dropdown overlay={(
                        <Menu>
                          <Menu.Item danger icon={<ImportOutlined />} onClick={this.props.logout}>
                            Logout
                          </Menu.Item>
                        </Menu>
                      )}>
                        <Button style={{border: 'none'}}>
                          <UserOutlined style={{fontSize: 20}}/>&nbsp;{user.first_name} {user.last_name}&nbsp;<DownOutlined />
                        </Button>
                      </Dropdown>
                    </Col>
                  </Row>
                </Col>

              </Row>
            </Header>
          </BrowserView>
          <Content style={{ margin: '16px 16px' }}>
            <Switch>
              <Route path='/containers'> <ContainersList /></Route>
              <Route path='/functions'> <FunctionsList /></Route>
              <Route path='/api_key'><APIKey /></Route>
              <Route path='/billing'><Billing /></Route>
              <Redirect to='/functions'/>
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>DeepMux © 2020</Footer>
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.authentication.user,
    money: state.billing.money,
  };
}

const actionCreators = {
  logout: UserActions.logout,
  get_money: BillingActions.get_money,
};

const MainPage = connect(mapStateToProps, actionCreators)(MainPageUnwrapped);


export default withRouter(MainPage);