/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Layout from './components/layout/Layout';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
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
