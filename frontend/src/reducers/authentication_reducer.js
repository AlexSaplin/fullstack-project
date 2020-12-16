import { userActionConstants } from '../constants';

const initialState = {
    errorMessage: '',
    loggingIn: false,
    loggedIn: false,
    token: '',
    user: {},
};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userActionConstants.LOGIN_REQUEST:
            return Object.assign({}, state, { 
                errorMessage: '',
                loggingIn: true,
                loggedIn: false,
                token: '',
                user: {}
            });

        case userActionConstants.LOGIN_SUCCESS:
            return Object.assign({}, state, { 
                errorMessage: '',
                loggingIn: false,
                loggedIn: true,
                token: action.token,
                user: action.user
            });

        case userActionConstants.LOGIN_FAILURE:
            return Object.assign({}, state, { 
                errorMessage: action.payload,
                loggingIn: false,
                loggedIn: false,
                token: '',
                user: {}
            })

        case userActionConstants.CURRENT_USER_INFO_SUCCESS:
            return Object.assign({}, state, { 
                user: action.user
            });

        case userActionConstants.LOGOUT:
            return initialState;

        default:
            return state;
    }
}
