import {containerActionConstants} from '../constants';

const initialState = {
    containers: [],
    processing: 0,
};

export function container(state = initialState, action) {
    switch (action.type) {
        case containerActionConstants.GET_CONTAINIERS_REQUEST: {
            const processing = state.processing;
            return Object.assign({}, state, {
                processing: processing + 1,
            });
        }

        case containerActionConstants.GET_CONTAINIERS_SUCCESS: {
            const processing = state.processing;
            return Object.assign({}, state, {
                containers: action.payload,
                processing: processing - 1,
            });
        }

        case containerActionConstants.GET_CONTAINIERS_FAILURE: {
            const processing = state.processing;
            return Object.assign({}, state, {
                containers: [],
                processing: processing - 1,
            })
        }
        default:
            return state;
    }
}