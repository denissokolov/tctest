/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import 'normalize.css';
import './base.scss';

import rootReducer from './reducers';
import Layout from './components/layout/Layout';

const store = createStore(rootReducer, applyMiddleware(thunk));

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );
};

render(Layout);

if (module.hot) {
  module.hot.accept('./components/layout/Layout', () => {
    // eslint-disable-next-line global-require
    const NextLayout = require('./components/layout/Layout').default;
    render(NextLayout);
  });
}
