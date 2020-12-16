import { billingActionConstants } from '../constants';
import { message } from 'antd';
import { apiURL } from "../config";
import axios from "axios";


export function add_money(amount, redirect_url) {
    return dispatch => {
        const ADD_MONEY_ENDPOINT = `${apiURL}/api/billing/init_payment/${amount}/${redirect_url}`;

        return new Promise((resolve, reject) => {axios.post(ADD_MONEY_ENDPOINT)
            .then ((response) => {
                const url = response.data.redirect_url;
                window.location.replace(url);
                resolve(response);
            })
            .catch( (error) => {
                const status = error.response.status
                if (status === 400) {
                    const msg = error.response.data.ERROR;
                    message.error({content: msg, duration: 2.5, key: 'adding_error_msg'});
                }
                reject(error);
            });
        });
    }
}


export function get_money() {
    return dispatch => {
        const ADD_MONEY_ENDPOINT = `${apiURL}/api/billing/get_money`;
        dispatch({type: billingActionConstants.GET_CURRENT_MONEY_REQUEST})
        return new Promise((resolve, reject) => {axios.get(ADD_MONEY_ENDPOINT)
            .then ((response) => {
                dispatch({type: billingActionConstants.GET_CURRENT_MONEY_SUCCESS, payload: response.data.money});
                resolve(response);
            })
            .catch( (error) => {
                console.log(error);
                dispatch({type: billingActionConstants.GET_CURRENT_MONEY_ERROR})
                reject(error);
            });
        });
    }
}


export function get_transactions(timestamp_begin, timestamp_end) {
    return dispatch => {
        const ADD_MONEY_ENDPOINT = `${apiURL}/api/billing/get_transactions/${timestamp_begin}/${timestamp_end}`;
        dispatch({type: billingActionConstants.GET_TRANSACTIONS_LIST_REQUEST})
        return new Promise((resolve, reject) => {axios.get(ADD_MONEY_ENDPOINT)
            .then ((response) => {
                dispatch({type: billingActionConstants.GET_TRANSACTIONS_LIST_SUCCESS, payload: response.data.Deltas ? response.data.Deltas : []});
                resolve(response);
            })
            .catch( (error) => {
                console.log(error);
                dispatch({type: billingActionConstants.GET_TRANSACTIONS_LIST_ERROR})
                reject(error);
            });
        });
    }
}


export function get_daily_money_change() {
    return dispatch => {
        const timestamp_end = Math.ceil(new Date().getTime() / 1000);
        const timestamp_begin = timestamp_end - 24 * 60 * 60;

        const ADD_MONEY_ENDPOINT = `${apiURL}/api/billing/get_transactions/${timestamp_begin}/${timestamp_end}`;
        return new Promise((resolve, reject) => {axios.get(ADD_MONEY_ENDPOINT)
            .then ((response) => {
                const deltas = response.data.Deltas ? response.data.Deltas : [];
                let balance = 0;
                deltas.map((delta) => {balance += Number(delta.Balance); return null;});
                resolve(balance);
            })
            .catch( (error) => {
                reject(error);
            });
        });
    }
}