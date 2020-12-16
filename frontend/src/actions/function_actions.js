import { functionActionConstants } from '../constants';
import { internalApiURL } from "../config";

import axios from "axios";

export function remove_function(name) {
    return dispatch => {
        dispatch({type: functionActionConstants.DELETE_FUNC_REQUEST, payload: name});

        const REMOVE_FUNCTION_ENDPOINT = `${internalApiURL}/v1/function/${name}`;

        return new Promise((resolve, reject) => {
            axios.delete(REMOVE_FUNCTION_ENDPOINT)
                .then((response) => {
                    dispatch({type: functionActionConstants.DELETE_FUNC_SUCCESS, payload: name});
                    resolve(response);
                })
                .catch((error) => {
                    dispatch({type: functionActionConstants.DELETE_FUNC_FAILURE, payload: name});
                    reject(error);
                });
        });
    }
}

export function get_functions_list() {
   return dispatch => {
        dispatch({type: functionActionConstants.GET_FUNCS_REQUEST});

        const GET_FUNCTION_ENDPOINT = `${internalApiURL}/v1/function`;

        return new Promise((resolve, reject) => {axios.get(GET_FUNCTION_ENDPOINT)
            .then((response) => {
                dispatch({type: functionActionConstants.GET_FUNCS_SUCCESS, payload: response.data.functions});
                resolve(response);
            })
            .catch((error) => {
                dispatch({type: functionActionConstants.GET_FUNCS_FAILURE});
                reject(error);
            });
        });
   }
}
