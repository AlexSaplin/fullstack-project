/* global FB */
import React from 'react';
import { connect } from 'react-redux';
import { UserActions } from '../../actions';
import { Button, Row, Divider } from 'antd'
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import GoogleLogin from "react-google-login";

import Logo from './logo.png'

class LoginFormUnwrapped extends React.Component {
    google_login_success = googleUser => {
        const id_token = googleUser.getAuthResponse().id_token;
        this.props.login_google(id_token);
    };

    facebook_login = () => {
        FB.login((login_response) => {
            const {accessToken, signedRequest, userID} = login_response.authResponse;
            this.props.get_facebook_user_credentials(accessToken)
                .then((creds_response) => {
                    const { email, first_name, last_name } = creds_response.data;
                    this.props.login_with_facebook_credentials(accessToken, userID, signedRequest, first_name, last_name, email);
            });
        }, {scope: 'public_profile,email'});
    }

    render() {
        return (
            <>
            <img src={Logo} alt="Deepmux" style={{width: 300, marginBottom: 30}} />
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
                onSuccess={this.google_login_success}
                cookiePolicy={'single_host_origin'}
                render={(renderProps) => {return (
                    <Button onClick={renderProps.onClick} style={{marginTop: 10, fontSize: 17, height: 40, width: 260, padding: '0 10px 0 10px'}}>
                        <Row align="middle" style={{height: 40}}>
                            <Row align="middle">
                                <GoogleOutlined style={{fontSize: 24}} />
                                <Divider type="vertical" style={{height: '35px', marginLeft: '10px', marginRight: '15px'}} />
                            </Row>
                            Sign in with Google
                        </Row>
                    </Button>
                )} }
            />
            <Button onClick={this.facebook_login} style={{marginTop: 10, fontSize: 17, height: 40, width: 260, padding: '0 10px 0 10px'}}>
                <Row align="middle" style={{height: 40}}>
                    <Row align="middle">
                        <FacebookOutlined style={{fontSize: 24}} />
                        <Divider type="vertical" style={{height: '35px', marginLeft: '10px', marginRight: '15px'}} />
                    </Row>
                    Sign in with Facebook
                </Row>
            </Button>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const actionCreators = {
    login_google: UserActions.login_google,
    get_facebook_user_credentials: UserActions.get_facebook_user_credentials,
    login_with_facebook_credentials: UserActions.login_with_facebook_credentials,
};

const LoginForm = connect(mapStateToProps, actionCreators)(LoginFormUnwrapped);

export default LoginForm;