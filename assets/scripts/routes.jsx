import React from 'react';
import classNames from 'classnames';
import {IndexRoute, Route} from 'react-router';
import Root from './pages/Root';
import Products from './pages/Products';

import _ from 'lodash';
/**
 * Includes Sidebar, Header and Footer.
 */

export default function({dispatch, getState}) {
  return (
    <Route path="/" component={Root}>
      <Route path="products" component={Products} />
    </Route>
  );
}
