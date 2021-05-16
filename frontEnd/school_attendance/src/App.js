import React, {useEffect } from 'react'
import apis from '../src/apis/apis'
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import {setToken, setUser} from '../src/redux/actions/authActions';
import reducers from './redux/reducers';

import Navigation from './navigation/Navigation';

const store = createStore(reducers, applyMiddleware(thunk));

function App() {

  useEffect(() => {
    let token = sessionStorage.getItem('TOKEN'); // get the initial token and user from browser storage if this is available the token is dispatch to the redux store
    let user = sessionStorage.getItem('USER');

    let _user = JSON.parse(user);
    if (token && token.length > 0 && user) {
      apis.initialize(token)
      store.dispatch(setToken(token));
      store.dispatch(setUser(_user));
    }
  }, [])

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;
