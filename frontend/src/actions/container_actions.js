import {containerActionConstants} from '../constants';
import { internalApiURL } from "../config";

import axios from "axios";


export function get_containers_list() {
   return dispatch => {

        dispatch({type: containerActionConstants.GET_CONTAINIERS_REQUEST});

        const GET_CONTAINERS_ENDPOINT = `${internalApiURL}/v1/container`;

        return new Promise((resolve, reject) => {axios.get(GET_CONTAINERS_ENDPOINT)
            .then((response) => {
                dispatch({type: containerActionConstants.GET_CONTAINIERS_SUCCESS, payload: response.data.containers});
                resolve(response);
            })
            .catch((error) => {
                dispatch({type: containerActionConstants.GET_CONTAINIERS_FAILURE});
                reject(error);
            });
        });
   }
}
