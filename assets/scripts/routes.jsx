import React from 'react';
import classNames from 'classnames';
import {IndexRoute, Route} from 'react-router';
import Root from './pages/Root';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Failure from './pages/Failure';

import _ from 'lodash';
/**
 * Includes Sidebar, Header and Footer.
 */

export default function({dispatch, getState}) {
  return (
    <Route path="/" component={Root}>
      <Route path="products" component={Products} />
      <Route path="checkout" component={Checkout} />
      <Route path="success" component={Success} />
      <Route path="failure" component={Failure} />
    </Route>
  );
}
