import { userActionConstants } from '../constants';
import { apiURL } from "../config";
import axios from "axios";


export function logout() {
    return dispatch => {
        axios.defaults.headers.common['Authorization'] = '';
        axios.defaults.headers.common['X-Token'] = '';
        dispatch({ type: userActionConstants.LOGOUT });
    }
}

export function login_google(id_token) {
    return dispatch => {
        dispatch({type: userActionConstants.LOGIN_REQUEST});

        const GOOGLE_LOGIN_ENDPOINT = `${apiURL}/api/accounts/login`;

        return new Promise((resolve, reject) => {axios.post(GOOGLE_LOGIN_ENDPOINT, {id_token})
             .then((response) => {
                const token = response.data.token;
                const user = response.data.user;
                axios.defaults.headers.common['Authorization'] = 'Token ' + token;
                axios.defaults.headers.common['X-Token'] = token;
                dispatch({type: userActionConstants.LOGIN_SUCCESS, token, user});
                dispatch( { type: userActionConstants.CURRENT_USER_INFO_SUCCESS, user: user } );
                resolve(response);
             })
             .catch((error) => {
                const err_text = "Authentication error, please try again later or contact customer support";
                axios.defaults.headers.common['Authorization'] = '';
                axios.defaults.headers.common['X-Token'] = '';
                dispatch({type: userActionConstants.LOGIN_FAILURE, payload: err_text});
                reject(error);
             });
        });
    }
}

export function get_facebook_user_credentials(access_token) {
    return dispatch => {
        const FB_USER_INFO_ENDPOINT = `https://graph.facebook.com/me?access_token=${access_token}&fields=id%2Cemail%2Cfirst_name%2Clast_name`;

        return new Promise((resolve, reject) => {axios.get(FB_USER_INFO_ENDPOINT)
             .then((response) => {
                resolve(response);
             })
             .catch((error) => {
                reject(error);
             });
        });
    }
}

export function login_with_facebook_credentials(access_token, user_id, signed_request, first_name, last_name, email) {
        return dispatch => {
            dispatch({type: userActionConstants.LOGIN_REQUEST});
    
            const FACEBOOK_LOGIN_ENDPOINT = `${apiURL}/api/accounts/login_fb`;
    
            return new Promise((resolve, reject) => {axios.post(FACEBOOK_LOGIN_ENDPOINT, {access_token, user_id, signed_request, first_name, last_name, email})
                 .then((response) => {
                    const token = response.data.token;
                    const user = response.data.user;
                    axios.defaults.headers.common['Authorization'] = 'Token ' + token;
                    axios.defaults.headers.common['X-Token'] = token;
                    dispatch({type: userActionConstants.LOGIN_SUCCESS, token, user});
                    dispatch( { type: userActionConstants.CURRENT_USER_INFO_SUCCESS, user: user } );
                    resolve(response);
                 })
                 .catch((error) => {
                    const err_text = "Authentication error, please try again later or contact customer support";
                    axios.defaults.headers.common['Authorization'] = '';
                    axios.defaults.headers.common['X-Token'] = '';
                    dispatch({type: userActionConstants.LOGIN_FAILURE, payload: err_text});
                    reject(error);
                 });
            });
        }
    }
    
export function revoke_token() {
    return dispatch => {
        const REVOKE_TOKEN_ENDPOINT = `${apiURL}/api/accounts/revoke_token`

        return new Promise((revoke, reject) => {axios.post(REVOKE_TOKEN_ENDPOINT)
             .then((response) => {
                const token = response.data.token;
                const user = response.data.user;
                axios.defaults.headers.common['Authorization'] = 'Token ' + token;
                axios.defaults.headers.common['X-Token'] = token;
                dispatch({type: userActionConstants.LOGIN_SUCCESS, token, user});
                dispatch( { type: userActionConstants.CURRENT_USER_INFO_SUCCESS, user: user } );
            })
             .catch((error) => {
                const err_text = (error.response && error.response.status === 400 ? "Невозможно войти с предоставленными учетными данными." : "Ошибка соединения с сервером, пожалуйста, повторите позднее");
                axios.defaults.headers.common['Authorization'] = '';
                axios.defaults.headers.common['X-Token'] = '';
                dispatch({type: userActionConstants.LOGIN_FAILURE, payload: err_text});
             });
        });
    }
}

