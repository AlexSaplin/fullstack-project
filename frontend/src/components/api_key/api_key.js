import React from 'react';
import { connect } from 'react-redux';
import { Row, Card, Typography, Button, Alert } from 'antd';
import { isMobile } from "react-device-detect";
import { UserActions } from '../../actions';

import './api_key.css'

const { Text, Title } = Typography;

class APIKeyUnwrapped extends React.Component {
    state = {
        copied: false,
    }

    copyToClipboard = (e) => {
        this.apiKey.select();
        document.execCommand('copy');
        this.apiKey.blur();
        if (window.getSelection) { // All browsers, except IE <=8
            window.getSelection().removeAllRanges();
        } else if (document.selection) { // IE <=8
            document.selection.empty();
        }
        
        this.setState({ copied: true });
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => this.setState({copied: false}), 4 * 1000); // 4 seconds timeout to restore copy state
    };

    render() {
        const { token = '', revoke_token, money} = this.props;
        const { copied } = this.state;
        return (
            <>
            <Row justify="center" style={{width: '100%'}}>
                { money !== undefined && Number(money) <= 0 &&
                <Alert
                    style={{fontSize: 16, marginBottom: 20, width: '100%'}}
                    message="Warning: Positive balance is required to create and use resources!"
                    type="warning"
                    closable
                />
                }
            </Row>
            <Row justify="center" style={{width: '100%'}}>
                <Card style={{marginTop: 25}}>
                    <Title level={2} style={{fontSize: isMobile ? '2em' : '32px', textAlign: 'center', marginBottom: 10}}>
                        Your API key is
                    </Title>
                    <input readOnly className="apikey_key_field" 
                           style= {{fontSize: isMobile ? '1.3em' : '26px', width: isMobile ? '60vw' : '550px'}}
                           ref={(key) => this.apiKey = key} 
                           onClick={this.copyToClipboard} value={token}/>
                    <Row justify="center">
                        <Text type="secondary" style= {{fontSize: isMobile ? '1em' : '16px'}} >
                            { !copied ? 
                                <>(click to copy to clipboard)</>
                            :
                                <>Copied successfully!</>
                            }
                        </Text>
                    </Row>
                    <Row justify="center" style={{marginTop: '2em'}}>
                        <Button danger onClick={() => revoke_token().catch(
                            (error) => error.response && error.response.status === 401 && this.props.logout() // logout on 401 error
                        )}>
                        Revoke and regenerate API key</Button>
                    </Row>
                </Card>
            </Row>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        token: state.authentication.token,
        money: state.billing.money,
    };
}

const actionCreators = {
    revoke_token: UserActions.revoke_token,
    logout: UserActions.logout,
};

const APIKey = connect(mapStateToProps, actionCreators)(APIKeyUnwrapped);

export default APIKey;