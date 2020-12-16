import React from 'react';
import LoginPage from '../login_page'
import MainPage from '../main_page'
import { connect } from 'react-redux';

const AppUnwrapped = ({loggedIn}) => {
    if (loggedIn) 
        return <MainPage />
    else 
        return <LoginPage />
};

function mapStateToProps(state) {
    return {
        loggedIn: state.authentication.loggedIn,
    };
}

const App = connect(mapStateToProps)(AppUnwrapped);

export default App;