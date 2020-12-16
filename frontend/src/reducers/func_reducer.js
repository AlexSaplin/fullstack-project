import { functionActionConstants } from '../constants';

const initialState = {
    funcs: [],
    processing: 0,
};

export function func(state = initialState, action) {
    switch (action.type) {
        case functionActionConstants.DELETE_FUNC_REQUEST: {
            const processing = state.processing;
            return Object.assign({}, state, {
                processing: processing + 1,
            })
        }

        case functionActionConstants.DELETE_FUNC_SUCCESS: {
            const processing = state.processing;
            let funcs = [...state.funcs];
            const index = funcs.findIndex((value) => {
                return value.name === action.payload
            });
            
            if (index > -1) {
                funcs.splice(index, 1);
            }
            return Object.assign({}, state, {
                funcs: funcs,
                processing: processing - 1,
            });
        }

        case functionActionConstants.DELETE_FUNC_FAILURE: {
            const processing = state.processing;
            return Object.assign({}, state, {
                processing: processing - 1,
            })
        }

        case functionActionConstants.GET_FUNCS_REQUEST: {
            const processing = state.processing;
            return Object.assign({}, state, {
                processing: processing + 1,
            });
        }

        case functionActionConstants.GET_FUNCS_SUCCESS: {
            const processing = state.processing;
            return Object.assign({}, state, {
                funcs: action.payload,
                processing: processing - 1,
            });
        }

        case functionActionConstants.GET_FUNCS_FAILURE: {
            const processing = state.processing;
            return Object.assign({}, state, {
                funcs: [],
                processing: processing - 1,
            })
        }

        default:
            return state;
    }
}
