import React from 'react';
import { connect } from 'react-redux';
import { UserActions, BillingActions } from '../../actions';

import { Form, Button, InputNumber } from 'antd'

class AddMoneyFormUnwrapped extends React.Component {

    onFormFinish = (values) => { 
        const redirect_url = "http://app.deepmux.com/billing";

        if (values.price && Number(values.price) > 0) {
            this.props.add_money(values.price, redirect_url).catch(
                (error) => error.response && error.response.status === 401 && this.props.logout() // logout on 401 error
            );
        }
    }

    render() {
        return (
            <Form layout="inline" onFinish = {this.onFormFinish}>
            <Form.Item name="price" initialValue={10.0}>
                <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit"> 
                    Process payment
                </Button>
            </Form.Item>
            </Form>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const actionCreators = {
    logout: UserActions.logout,
    add_money: BillingActions.add_money,
};

const AddMoneyForm = connect(mapStateToProps, actionCreators)(AddMoneyFormUnwrapped);

export default AddMoneyForm;

