import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import {loadState, saveState} from './persist_store'

import axios from "axios";

import App from './pages/app';

import { BrowserRouter as Router } from 'react-router-dom'

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

const loggerMiddleware = createLogger();
const persistedState = loadState();
const store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

store.subscribe(() => {
    saveState({
        authentication: { ...store.getState().authentication, errorMessage: '' }
    });
});

const { authentication = {} } = store.getState();
const { token = '' } = authentication;
if (token !== '') {
    axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    axios.defaults.headers.common['X-Token'] = token;
}


ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>,
    document.getElementById('root')
);
