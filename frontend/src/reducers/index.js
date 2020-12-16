import { combineReducers } from 'redux';
import { authentication } from './authentication_reducer';
import { func } from './func_reducer';
import { billing } from './billing_reducer';
import { container } from './container_reducer';

const rootReducer = combineReducers({
    authentication,
    func,
    billing,
    container,
});

export default rootReducer;