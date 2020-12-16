import React from 'react';
import { Row } from 'antd';
import LoginForm from '../../components/login_form'

class LoginPage extends React.Component {
  render() {
    return (
      <Row align="middle" justify="center" style={{ height: '100vh', width: '100vw', 
           background: "radial-gradient(#434343, #1f1f1f)",
            }}>
          <Row align="middle" justify="center" style={{flexFlow: 'column'}}>
            <LoginForm />
          </Row>
      </Row>
    );
  }
}

export default LoginPage;