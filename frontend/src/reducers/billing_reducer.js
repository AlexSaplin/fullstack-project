import { billingActionConstants } from '../constants';

const initialState = {
    money: undefined,
    processing_money: false,
    transactions: [],
    processing_transactions: false,
};

export function billing(state = initialState, action) {
    switch (action.type) {
        case billingActionConstants.GET_CURRENT_MONEY_REQUEST:
            return Object.assign({}, state, { 
                processing_money: true,
            });

        case billingActionConstants.GET_CURRENT_MONEY_SUCCESS:
            return Object.assign({}, state, { 
                processing_money: false,
                money: action.payload,
            });

        case billingActionConstants.GET_CURRENT_MONEY_ERROR:
            return Object.assign({}, state, { 
                processing_money: false,
                money: undefined,
            })

        case billingActionConstants.GET_TRANSACTIONS_LIST_REQUEST:
            return Object.assign({}, state, { 
                processing_transactions: true
            });

        case billingActionConstants.GET_TRANSACTIONS_LIST_SUCCESS:
            return Object.assign({}, state, { 
                processing_transactions: false,
                transactions: action.payload,
            });

        case billingActionConstants.GET_TRANSACTIONS_LIST_ERROR:
            return Object.assign({}, state, { 
                processing_transactions: false,
                transactions: [],
            });

        default:
            return state;
    }
}
